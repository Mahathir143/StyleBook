using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore;
using StyleBook.Shared.Common;
using StyleBook.Shared.Domain.Entities;
using StyleBook.Shared.Infrastructure.Data;
using StyleBook.Shared.Infrastructure.Repositories;

namespace StyleBook.ApiGateway.Endpoints;

public static class BookingEndpoints
{
    public static void MapBookingEndpoints(this WebApplication app)
    {
        // 1. Dynamic Slot Calculation Engine
        app.MapGet("/api/bookings/available-slots", async (Guid? stylistId, Guid? branchId, DateTime date, string? serviceIds, IUnitOfWork uow) =>
        {
            var bookingDate = DateOnly.FromDateTime(date);
            var dayOfWeek = (int)date.DayOfWeek;

            var parsedServiceIds = (serviceIds ?? "1").Split(',')
                .Select(s => int.TryParse(s.Trim(), out var id) ? id : 1)
                .ToList();

            var serviceRepo = uow.Repository<MasterService>();
            var services = await serviceRepo.Query().Where(s => parsedServiceIds.Contains(s.Id)).ToListAsync();
            var defaultTotalMinutes = services.Sum(s => s.DefaultDurationMinutes);
            if (defaultTotalMinutes <= 0) defaultTotalMinutes = 30;

            StylistProfile? targetStylist = null;
            if (stylistId.HasValue)
            {
                targetStylist = await uow.Repository<StylistProfile>().GetByIdAsync(stylistId.Value);
            }
            else if (branchId.HasValue)
            {
                targetStylist = await uow.Repository<StylistProfile>().Query()
                    .FirstOrDefaultAsync(s => s.CurrentBranchId == branchId.Value && s.IsActive);
            }

            if (targetStylist == null)
            {
                return Results.Ok(ApiResponse<object>.Ok(new List<object>
                {
                    new { Time = "10:00 AM", Available = true },
                    new { Time = "11:00 AM", Available = true },
                    new { Time = "02:00 PM", Available = true },
                    new { Time = "04:00 PM", Available = true },
                    new { Time = "06:00 PM", Available = true }
                }));
            }

            var customDurations = await uow.Repository<StylistServiceDuration>().Query()
                .Where(d => d.StylistId == targetStylist.Id && parsedServiceIds.Contains(d.ServiceId))
                .ToListAsync();

            var effectiveMinutes = 0;
            foreach (var sId in parsedServiceIds)
            {
                var custom = customDurations.FirstOrDefault(cd => cd.ServiceId == sId);
                if (custom != null && custom.IsApprovedByOwner)
                {
                    effectiveMinutes += custom.DurationMinutes;
                }
                else
                {
                    effectiveMinutes += services.FirstOrDefault(s => s.Id == sId)?.DefaultDurationMinutes ?? 30;
                }
            }

            var workingHours = await uow.Repository<StylistWorkingHours>().Query()
                .FirstOrDefaultAsync(w => w.StylistId == targetStylist.Id && w.DayOfWeek == dayOfWeek);

            var start = workingHours?.StartTime ?? new TimeSpan(9, 0, 0);
            var end = workingHours?.EndTime ?? new TimeSpan(20, 0, 0);
            var breakStart = workingHours?.BreakStart ?? new TimeSpan(13, 0, 0);
            var breakEnd = workingHours?.BreakEnd ?? new TimeSpan(14, 0, 0);

            var exception = await uow.Repository<StylistDailyException>().Query()
                .FirstOrDefaultAsync(e => e.StylistId == targetStylist.Id && e.ExceptionDate == bookingDate && e.IsApprovedByOwner);

            if (exception != null)
            {
                if (exception.IsLeave)
                {
                    return Results.Ok(ApiResponse<object>.Ok(new List<object>(), "Stylist is on leave on this date."));
                }
                if (exception.StartTime.HasValue) start = exception.StartTime.Value;
                if (exception.EndTime.HasValue) end = exception.EndTime.Value;
                if (exception.LunchBreakStart.HasValue) breakStart = exception.LunchBreakStart.Value;
                if (exception.LunchBreakEnd.HasValue) breakEnd = exception.LunchBreakEnd.Value;
            }

            var existingBookings = await uow.Repository<Booking>().Query()
                .Where(b => b.StylistId == targetStylist.Id && b.BookingDate == bookingDate && b.Status != "Cancelled")
                .ToListAsync();

            var slotList = new List<object>();
            var current = start;

            while (current.Add(TimeSpan.FromMinutes(effectiveMinutes)) <= end)
            {
                var slotEnd = current.Add(TimeSpan.FromMinutes(effectiveMinutes));
                var overlapsBreak = (current < breakEnd && slotEnd > breakStart);
                var overlapsBooking = existingBookings.Any(b => current < b.EndTime && slotEnd > b.StartTime);

                var isAvailable = !overlapsBreak && !overlapsBooking;
                var formattedTime = DateTime.Today.Add(current).ToString("hh:mm tt");

                slotList.Add(new
                {
                    Time = formattedTime,
                    StartTime = current.ToString(@"hh\:mm"),
                    EndTime = slotEnd.ToString(@"hh\:mm"),
                    Available = isAvailable,
                    DurationMinutes = effectiveMinutes,
                    Reason = !isAvailable ? (overlapsBreak ? "Staff Break" : "Booked") : "Available"
                });

                current = current.Add(TimeSpan.FromMinutes(30));
            }

            return Results.Ok(ApiResponse<object>.Ok(slotList));
        });

        // 2. Create Booking
        app.MapPost("/api/bookings", async (CreateBookingDto dto, IUnitOfWork uow) =>
        {
            var bookingDate = DateOnly.FromDateTime(dto.BookingDate);
            var refCode = "SB-" + RandomNumberGenerator.GetInt32(100000, 999999);

            var booking = new Booking
            {
                BookingReference = refCode,
                CustomerUserId = dto.CustomerUserId,
                BranchId = dto.BranchId,
                StylistId = dto.StylistId,
                WorkType = dto.WorkType ?? "IN_SALON",
                CustomerDoorstepAddress = dto.CustomerDoorstepAddress,
                BookingDate = bookingDate,
                StartTime = TimeSpan.Parse(dto.StartTime),
                EndTime = TimeSpan.Parse(dto.EndTime),
                TotalAmount = dto.TotalAmount,
                DiscountAmount = dto.DiscountAmount,
                NetPayable = dto.TotalAmount - dto.DiscountAmount,
                PricingModel = dto.IsNegotiated ? "NEGOTIATED" : "FIXED",
                Status = "PendingConfirmation"
            };

            await uow.Repository<Booking>().AddAsync(booking);
            await uow.CommitAsync();

            foreach (var item in dto.Items)
            {
                var bItem = new BookingItem
                {
                    BookingId = booking.Id,
                    ServiceId = item.ServiceId,
                    ServiceName = item.ServiceName,
                    AppliedPrice = item.AppliedPrice,
                    DurationMinutes = item.DurationMinutes
                };
                await uow.Repository<BookingItem>().AddAsync(bItem);
            }

            if (dto.IsNegotiated && dto.CustomerOfferPrice.HasValue)
            {
                var neg = new BookingNegotiation
                {
                    BookingId = booking.Id,
                    OriginalPrice = dto.TotalAmount,
                    CustomerOfferPrice = dto.CustomerOfferPrice.Value,
                    Status = "Proposed"
                };
                await uow.Repository<BookingNegotiation>().AddAsync(neg);
            }

            await uow.CommitAsync();

            return Results.Ok(ApiResponse<object>.Ok(new { booking.Id, booking.BookingReference, booking.Status }, "Booking created successfully"));
        });

        // 3. Confirm Booking & Generate Secure OTP
        app.MapPost("/api/bookings/{id:guid}/confirm", async (Guid id, IUnitOfWork uow) =>
        {
            var booking = await uow.Repository<Booking>().GetByIdAsync(id);
            if (booking == null) return Results.NotFound(ApiResponse<object>.Fail("Booking not found"));

            booking.Status = "Confirmed";
            booking.UpdatedAt = DateTime.UtcNow;

            var otpNum = RandomNumberGenerator.GetInt32(100000, 999999).ToString();
            var otp = new BookingOtp
            {
                BookingId = booking.Id,
                OtpCode = otpNum,
                OtpHash = PasswordHasher.HashPassword(otpNum),
                ExpiresAt = DateTime.UtcNow.AddHours(24),
                IsVerified = false
            };

            var otpRepo = uow.Repository<BookingOtp>();
            var existingOtp = await otpRepo.GetByIdAsync(id);
            if (existingOtp != null)
            {
                existingOtp.OtpCode = otpNum;
                existingOtp.OtpHash = PasswordHasher.HashPassword(otpNum);
                existingOtp.ExpiresAt = DateTime.UtcNow.AddHours(24);
                existingOtp.IsVerified = false;
                otpRepo.Update(existingOtp);
            }
            else
            {
                await otpRepo.AddAsync(otp);
            }

            await uow.CommitAsync();

            return Results.Ok(ApiResponse<object>.Ok(new { booking.Id, booking.Status, Otp = otpNum }, "Booking Confirmed! OTP Generated for Customer check-in."));
        });

        // 4. Verify OTP Check-in
        app.MapPost("/api/bookings/{id:guid}/verify-otp", async (Guid id, VerifyOtpDto dto, IUnitOfWork uow) =>
        {
            var booking = await uow.Repository<Booking>().GetByIdAsync(id);
            if (booking == null) return Results.NotFound(ApiResponse<object>.Fail("Booking not found"));

            var otpRepo = uow.Repository<BookingOtp>();
            var otp = await otpRepo.GetByIdAsync(id);

            if (otp == null || otp.OtpCode != dto.OtpCode)
            {
                if (otp != null) otp.RetryCount++;
                await uow.CommitAsync();
                return Results.BadRequest(ApiResponse<object>.Fail("Invalid OTP code. Please verify with the customer."));
            }

            otp.IsVerified = true;
            otp.VerifiedAt = DateTime.UtcNow;
            booking.Status = "InProgress";
            booking.UpdatedAt = DateTime.UtcNow;

            await uow.CommitAsync();

            return Results.Ok(ApiResponse<object>.Ok(new { booking.Id, booking.Status }, "OTP Verified successfully! Service is now In Progress."));
        });

        // 5. Complete Service
        app.MapPost("/api/bookings/{id:guid}/complete", async (Guid id, IUnitOfWork uow) =>
        {
            var booking = await uow.Repository<Booking>().GetByIdAsync(id);
            if (booking == null) return Results.NotFound(ApiResponse<object>.Fail("Booking not found"));

            booking.Status = "Completed";
            booking.UpdatedAt = DateTime.UtcNow;
            await uow.CommitAsync();

            return Results.Ok(ApiResponse<object>.Ok(new { booking.Id, booking.Status }, "Booking marked as Completed"));
        });

        // 6. List Bookings
        app.MapGet("/api/bookings", async (Guid? customerUserId, Guid? branchId, Guid? stylistId, string? status, IUnitOfWork uow) =>
        {
            var query = uow.Repository<Booking>().Query()
                .Include(b => b.Items)
                .Include(b => b.Otp)
                .Include(b => b.Negotiations)
                .Include(b => b.Customer)
                .Include(b => b.Branch)
                .OrderByDescending(b => b.CreatedAt)
                .AsQueryable();

            if (customerUserId.HasValue) query = query.Where(b => b.CustomerUserId == customerUserId.Value);
            if (branchId.HasValue) query = query.Where(b => b.BranchId == branchId.Value);
            if (stylistId.HasValue) query = query.Where(b => b.StylistId == stylistId.Value);
            if (!string.IsNullOrEmpty(status)) query = query.Where(b => b.Status == status);

            var list = await query.ToListAsync();
            return Results.Ok(ApiResponse<IEnumerable<Booking>>.Ok(list));
        });

        // 7. Customer Review
        app.MapPost("/api/bookings/{id:guid}/review", async (Guid id, CreateReviewDto dto, IUnitOfWork uow) =>
        {
            var booking = await uow.Repository<Booking>().GetByIdAsync(id);
            if (booking == null) return Results.NotFound(ApiResponse<object>.Fail("Booking not found"));
            if (booking.Status != "Completed") return Results.BadRequest(ApiResponse<object>.Fail("Reviews can only be submitted for completed bookings."));

            var existingReview = await uow.Repository<Review>().Query().FirstOrDefaultAsync(r => r.BookingId == id);
            if (existingReview != null) return Results.BadRequest(ApiResponse<object>.Fail("A review has already been submitted for this booking. Duplicate reviews are prevented."));

            var review = new Review
            {
                BookingId = id,
                CustomerUserId = dto.CustomerUserId,
                SalonId = dto.SalonId,
                BranchId = dto.BranchId,
                StylistId = dto.StylistId,
                BranchRating = Math.Clamp(dto.BranchRating, 1, 5),
                BranchComment = dto.BranchComment,
                StylistRating = Math.Clamp(dto.StylistRating, 1, 5),
                StylistComment = dto.StylistComment
            };

            await uow.Repository<Review>().AddAsync(review);
            await uow.CommitAsync();

            return Results.Ok(ApiResponse<Review>.Ok(review, "Thank you for reviewing both the salon branch and the stylist!"));
        });

        // 8. List Reviews
        app.MapGet("/api/bookings/reviews", async (Guid? branchId, Guid? stylistId, IUnitOfWork uow) =>
        {
            var query = uow.Repository<Review>().Query()
                .Include(r => r.Customer)
                .OrderByDescending(r => r.CreatedAt)
                .AsQueryable();

            if (branchId.HasValue) query = query.Where(r => r.BranchId == branchId.Value);
            if (stylistId.HasValue) query = query.Where(r => r.StylistId == stylistId.Value);

            var list = await query.ToListAsync();
            return Results.Ok(ApiResponse<IEnumerable<Review>>.Ok(list));
        });
    }
}

public record CreateBookingDto(Guid CustomerUserId, Guid? BranchId, Guid? StylistId, string? WorkType, string? CustomerDoorstepAddress, DateTime BookingDate, string StartTime, string EndTime, decimal TotalAmount, decimal DiscountAmount, bool IsNegotiated, decimal? CustomerOfferPrice, List<BookingItemDto> Items);
public record BookingItemDto(int ServiceId, string ServiceName, decimal AppliedPrice, int DurationMinutes);
public record VerifyOtpDto(string OtpCode);
public record CreateReviewDto(Guid CustomerUserId, Guid? SalonId, Guid? BranchId, Guid? StylistId, int BranchRating, string? BranchComment, int StylistRating, string? StylistComment);

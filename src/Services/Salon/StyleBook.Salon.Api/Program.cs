using Microsoft.EntityFrameworkCore;
using StyleBook.Shared.Common;
using StyleBook.Shared.Domain.Entities;
using StyleBook.Shared.Infrastructure.Data;
using StyleBook.Shared.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

var connString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<StyleBookDbContext>(options =>
    options.UseNpgsql(connString));

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy => policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("AllowAll");

app.MapGet("/health", () => Results.Ok(new { status = "Healthy", service = "StyleBook.Salon.Api" }));

// 1. List Salons (Public & Filterable by District, BusinessType, Status)
app.MapGet("/api/salons", async (int? districtId, string? businessType, string? status, IUnitOfWork uow) =>
{
    var query = uow.Repository<Salon>().Query()
        .Include(s => s.Branches)
            .ThenInclude(b => b.ServicePricings)
        .Include(s => s.Stylists)
            .ThenInclude(st => st.User)
        .AsQueryable();

    if (!string.IsNullOrEmpty(status))
    {
        query = query.Where(s => s.ApprovalStatus == status);
    }
    else
    {
        query = query.Where(s => s.ApprovalStatus == "Approved");
    }

    if (!string.IsNullOrEmpty(businessType))
    {
        query = query.Where(s => s.BusinessType == businessType);
    }

    if (districtId.HasValue)
    {
        query = query.Where(s => s.Branches.Any(b => b.DistrictId == districtId.Value));
    }

    var salons = await query.ToListAsync();
    return Results.Ok(ApiResponse<IEnumerable<Salon>>.Ok(salons));
});

// 2. Get Salon by ID
app.MapGet("/api/salons/{id:guid}", async (Guid id, IUnitOfWork uow) =>
{
    var salon = await uow.Repository<Salon>().Query()
        .Include(s => s.Branches)
            .ThenInclude(b => b.ServicePricings)
        .Include(s => s.Stylists)
            .ThenInclude(st => st.User)
        .Include(s => s.Stylists)
            .ThenInclude(st => st.WorkingHours)
        .Include(s => s.Stylists)
            .ThenInclude(st => st.ServiceDurations)
        .FirstOrDefaultAsync(s => s.Id == id);

    if (salon == null) return Results.NotFound(ApiResponse<object>.Fail("Salon not found"));
    return Results.Ok(ApiResponse<Salon>.Ok(salon));
});

// 3. Create Salon (Owner Registration)
app.MapPost("/api/salons", async (CreateSalonDto dto, IUnitOfWork uow) =>
{
    var salon = new Salon
    {
        OwnerUserId = dto.OwnerUserId,
        BusinessType = dto.BusinessType,
        BrandName = dto.BrandName,
        RegistrationNumber = dto.RegistrationNumber,
        ApprovalStatus = "Pending" // Requires management approval
    };

    await uow.Repository<Salon>().AddAsync(salon);
    await uow.CommitAsync();

    // If Independent or initial branch provided
    if (dto.InitialBranch != null)
    {
        var branch = new Branch
        {
            SalonId = salon.Id,
            BranchName = dto.InitialBranch.BranchName,
            DistrictId = dto.InitialBranch.DistrictId,
            AddressLine = dto.InitialBranch.AddressLine,
            Latitude = dto.InitialBranch.Latitude,
            Longitude = dto.InitialBranch.Longitude,
            PhoneContact = dto.InitialBranch.PhoneContact,
            IsDoorstepEnabled = dto.InitialBranch.IsDoorstepEnabled
        };
        await uow.Repository<Branch>().AddAsync(branch);
        await uow.CommitAsync();
    }

    return Results.Ok(ApiResponse<Salon>.Ok(salon, "Salon created successfully, pending management approval."));
});

// 4. Management Approval Workflow (Super Admin / Zonal Manager)
app.MapPost("/api/salons/{id:guid}/review", async (Guid id, SalonReviewDto dto, IUnitOfWork uow) =>
{
    var salon = await uow.Repository<Salon>().GetByIdAsync(id);
    if (salon == null) return Results.NotFound(ApiResponse<object>.Fail("Salon not found"));

    salon.ApprovalStatus = dto.Approve ? "Approved" : "Rejected";
    salon.ApprovedBy = dto.ReviewerUserId;
    salon.ApprovedAt = DateTime.UtcNow;
    salon.RejectionReason = dto.RejectionReason;

    uow.Repository<Salon>().Update(salon);
    await uow.CommitAsync();

    return Results.Ok(ApiResponse<Salon>.Ok(salon, $"Salon {(dto.Approve ? "Approved" : "Rejected")} successfully"));
});

// 5. Add Branch to Salon
app.MapPost("/api/salons/{salonId:guid}/branches", async (Guid salonId, CreateBranchDto dto, IUnitOfWork uow) =>
{
    var branch = new Branch
    {
        SalonId = salonId,
        BranchName = dto.BranchName,
        DistrictId = dto.DistrictId,
        AddressLine = dto.AddressLine,
        Latitude = dto.Latitude,
        Longitude = dto.Longitude,
        PhoneContact = dto.PhoneContact,
        IsDoorstepEnabled = dto.IsDoorstepEnabled
    };

    await uow.Repository<Branch>().AddAsync(branch);
    await uow.CommitAsync();

    return Results.Ok(ApiResponse<Branch>.Ok(branch, "Branch added successfully"));
});

// 6. Branch Pricing Configuration (Fixed vs Negotiable)
app.MapPost("/api/branches/{branchId:guid}/services", async (Guid branchId, SetBranchPricingDto dto, IUnitOfWork uow) =>
{
    var repo = uow.Repository<BranchServicePricing>();
    var existing = await repo.Query().FirstOrDefaultAsync(p => p.BranchId == branchId && p.ServiceId == dto.ServiceId);

    if (existing != null)
    {
        existing.CustomPrice = dto.CustomPrice;
        existing.IsNegotiable = dto.IsNegotiable;
        existing.MinimumNegotiablePrice = dto.MinimumNegotiablePrice;
        existing.IsOffered = dto.IsOffered;
        repo.Update(existing);
    }
    else
    {
        var pricing = new BranchServicePricing
        {
            BranchId = branchId,
            ServiceId = dto.ServiceId,
            CustomPrice = dto.CustomPrice,
            IsNegotiable = dto.IsNegotiable,
            MinimumNegotiablePrice = dto.MinimumNegotiablePrice,
            IsOffered = dto.IsOffered
        };
        await repo.AddAsync(pricing);
    }

    await uow.CommitAsync();
    return Results.Ok(ApiResponse<object>.Ok(new { branchId, dto.ServiceId }, "Branch service pricing updated"));
});

// 7. Stylist Management: Transfer Stylist or toggle Doorstep
app.MapPost("/api/stylists/{stylistId:guid}/transfer", async (Guid stylistId, Guid targetBranchId, IUnitOfWork uow) =>
{
    var stylistRepo = uow.Repository<StylistProfile>();
    var stylist = await stylistRepo.GetByIdAsync(stylistId);
    if (stylist == null) return Results.NotFound(ApiResponse<object>.Fail("Stylist not found"));

    stylist.CurrentBranchId = targetBranchId;
    stylistRepo.Update(stylist);
    await uow.CommitAsync();

    return Results.Ok(ApiResponse<StylistProfile>.Ok(stylist, "Stylist transferred successfully"));
});

app.MapPost("/api/stylists/{stylistId:guid}/toggle-doorstep", async (Guid stylistId, bool enabled, decimal radiusKm, IUnitOfWork uow) =>
{
    var stylistRepo = uow.Repository<StylistProfile>();
    var stylist = await stylistRepo.GetByIdAsync(stylistId);
    if (stylist == null) return Results.NotFound(ApiResponse<object>.Fail("Stylist not found"));

    stylist.DoorstepEnabled = enabled;
    stylist.DoorstepRadiusKm = radiusKm;
    stylistRepo.Update(stylist);
    await uow.CommitAsync();

    return Results.Ok(ApiResponse<StylistProfile>.Ok(stylist, "Stylist doorstep status updated"));
});

// 8. Stylist Daily Exception / Shift Adjustment (e.g. today lunch at 3pm)
app.MapPost("/api/stylists/{stylistId:guid}/exceptions", async (Guid stylistId, CreateExceptionDto dto, IUnitOfWork uow) =>
{
    var exception = new StylistDailyException
    {
        StylistId = stylistId,
        ExceptionDate = DateOnly.FromDateTime(dto.ExceptionDate),
        StartTime = dto.StartTime,
        EndTime = dto.EndTime,
        LunchBreakStart = dto.LunchBreakStart,
        LunchBreakEnd = dto.LunchBreakEnd,
        Reason = dto.Reason,
        IsApprovedByOwner = dto.AutoApproveByOwner,
        IsLeave = dto.IsLeave
    };

    await uow.Repository<StylistDailyException>().AddAsync(exception);
    await uow.CommitAsync();

    return Results.Ok(ApiResponse<StylistDailyException>.Ok(exception, "Stylist daily exception submitted"));
});

app.Run();

// DTOs
public record CreateSalonDto(Guid OwnerUserId, string BusinessType, string BrandName, string? RegistrationNumber, CreateBranchDto? InitialBranch);
public record CreateBranchDto(string BranchName, int? DistrictId, string AddressLine, double Latitude, double Longitude, string? PhoneContact, bool IsDoorstepEnabled);
public record SalonReviewDto(bool Approve, Guid ReviewerUserId, string? RejectionReason);
public record SetBranchPricingDto(int ServiceId, decimal CustomPrice, bool IsNegotiable, decimal? MinimumNegotiablePrice, bool IsOffered);
public record CreateExceptionDto(DateTime ExceptionDate, TimeSpan? StartTime, TimeSpan? EndTime, TimeSpan? LunchBreakStart, TimeSpan? LunchBreakEnd, string? Reason, bool AutoApproveByOwner, bool IsLeave);

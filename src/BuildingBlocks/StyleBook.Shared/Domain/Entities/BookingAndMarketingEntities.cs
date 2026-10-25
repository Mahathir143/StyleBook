using System.ComponentModel.DataAnnotations.Schema;

namespace StyleBook.Shared.Domain.Entities;

[Table("bookings", Schema = "booking")]
public class Booking
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string BookingReference { get; set; } = string.Empty;
    public Guid CustomerUserId { get; set; }
    public User? Customer { get; set; }
    public Guid? BranchId { get; set; }
    public Branch? Branch { get; set; }
    public Guid? StylistId { get; set; }
    public StylistProfile? Stylist { get; set; }
    public string WorkType { get; set; } = "IN_SALON"; // IN_SALON, DOORSTEP
    public string? CustomerDoorstepAddress { get; set; }
    public DateOnly BookingDate { get; set; }
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public decimal TotalAmount { get; set; }
    public decimal DiscountAmount { get; set; } = 0.00m;
    public string? CouponCode { get; set; }
    public decimal NetPayable { get; set; }
    public string PricingModel { get; set; } = "FIXED"; // FIXED, NEGOTIATED
    public string Status { get; set; } = "PendingConfirmation";
    // PendingConfirmation, Confirmed, InProgress, Completed, Cancelled, Rescheduled
    public string? CancellationReason { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public List<BookingItem> Items { get; set; } = new();
    public BookingOtp? Otp { get; set; }
    public List<BookingNegotiation> Negotiations { get; set; } = new();
}

[Table("booking_items", Schema = "booking")]
public class BookingItem
{
    public int Id { get; set; }
    public Guid BookingId { get; set; }
    public Booking? Booking { get; set; }
    public int ServiceId { get; set; }
    public string ServiceName { get; set; } = string.Empty;
    public decimal AppliedPrice { get; set; }
    public int DurationMinutes { get; set; }
}

[Table("booking_otps", Schema = "booking")]
public class BookingOtp
{
    public Guid BookingId { get; set; }
    public Booking? Booking { get; set; }
    public string OtpCode { get; set; } = string.Empty;
    public string OtpHash { get; set; } = string.Empty;
    public DateTime ExpiresAt { get; set; }
    public DateTime? VerifiedAt { get; set; }
    public int RetryCount { get; set; } = 0;
    public bool IsVerified { get; set; } = false;
}

[Table("booking_negotiations", Schema = "booking")]
public class BookingNegotiation
{
    public int Id { get; set; }
    public Guid BookingId { get; set; }
    public Booking? Booking { get; set; }
    public decimal OriginalPrice { get; set; }
    public decimal CustomerOfferPrice { get; set; }
    public decimal? OwnerCounterPrice { get; set; }
    public string Status { get; set; } = "Proposed"; // Proposed, Accepted, Countered, Declined
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

[Table("reviews", Schema = "booking")]
public class Review
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid BookingId { get; set; }
    public Booking? Booking { get; set; }
    public Guid CustomerUserId { get; set; }
    public User? Customer { get; set; }
    public Guid? SalonId { get; set; }
    public Guid? BranchId { get; set; }
    public Branch? Branch { get; set; }
    public Guid? StylistId { get; set; }
    public StylistProfile? Stylist { get; set; }
    public int BranchRating { get; set; } = 5;
    public string? BranchComment { get; set; }
    public int StylistRating { get; set; } = 5;
    public string? StylistComment { get; set; }
    public string? OwnerReply { get; set; }
    public bool IsModerated { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

[Table("offers", Schema = "marketing")]
public class Offer
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string CreatorType { get; set; } = "MANAGEMENT"; // MANAGEMENT, SALON_OWNER
    public Guid CreatorId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string DiscountType { get; set; } = "PERCENTAGE"; // PERCENTAGE, FLAT
    public decimal DiscountValue { get; set; }
    public string TargetAudience { get; set; } = "ALL_CUSTOMERS";
    public int MinBranchesRequired { get; set; } = 0;
    public string? PromoCode { get; set; }
    public DateTime ValidFrom { get; set; }
    public DateTime ValidTo { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

[Table("announcements", Schema = "marketing")]
public class Announcement
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid? SenderUserId { get; set; }
    public Guid? SalonId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string Content { get; set; } = string.Empty;
    public string? BannerImageUrl { get; set; }
    public string TargetAudience { get; set; } = "GLOBAL";
    public bool IsPublished { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

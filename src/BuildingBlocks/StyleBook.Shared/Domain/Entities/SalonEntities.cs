using System.ComponentModel.DataAnnotations.Schema;

namespace StyleBook.Shared.Domain.Entities;

[Table("salons", Schema = "salon")]
public class Salon
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid OwnerUserId { get; set; }
    public int? ZoneId { get; set; } = 1;
    public string BusinessType { get; set; } = "SHOP_OWNER"; // SHOP_OWNER, INDEPENDENT
    public string BrandName { get; set; } = string.Empty;
    public string? RegistrationNumber { get; set; }
    public string ApprovalStatus { get; set; } = "Pending"; // Pending, Approved, Rejected
    public Guid? ApprovedBy { get; set; }
    public DateTime? ApprovedAt { get; set; }
    public string? RejectionReason { get; set; }
    public string? LogoUrl { get; set; }
    public string? BannerUrl { get; set; }
    public decimal Rating { get; set; } = 5.0m;
    public int TotalReviews { get; set; } = 0;
    public bool IsActive { get; set; } = true;
    public string? PocName { get; set; }
    public string? PocPhone { get; set; }
    public string? PocEmail { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<Branch> Branches { get; set; } = new();
    public List<StylistProfile> Stylists { get; set; } = new();
}

[Table("branches", Schema = "salon")]
public class Branch
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SalonId { get; set; }
    public Salon? Salon { get; set; }
    public string BranchName { get; set; } = string.Empty;
    public int? DistrictId { get; set; }
    public string? Locality { get; set; }
    public string AddressLine { get; set; } = string.Empty;
    public double Latitude { get; set; }
    public double Longitude { get; set; }
    public string? PhoneContact { get; set; }
    public string? PocName { get; set; }
    public string? PocPhone { get; set; }
    public string? PocEmail { get; set; }
    public string? PocRole { get; set; } = "Branch In-Charge";
    public bool IsDoorstepEnabled { get; set; } = false;
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<BranchServicePricing> ServicePricings { get; set; } = new();
}

[Table("stylist_profiles", Schema = "salon")]
public class StylistProfile
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public Guid? SalonId { get; set; }
    public Salon? Salon { get; set; }
    public Guid? CurrentBranchId { get; set; }
    public Branch? CurrentBranch { get; set; }
    public bool IsIndependent { get; set; } = false;
    public string? Specialization { get; set; }
    public decimal DoorstepRadiusKm { get; set; } = 0.00m;
    public bool DoorstepEnabled { get; set; } = false;
    public decimal Rating { get; set; } = 5.0m;
    public int TotalReviews { get; set; } = 0;
    public bool IsActive { get; set; } = true;

    public List<StylistServiceDuration> ServiceDurations { get; set; } = new();
    public List<StylistWorkingHours> WorkingHours { get; set; } = new();
    public List<StylistDailyException> DailyExceptions { get; set; } = new();
}

[Table("branch_service_pricing", Schema = "salon")]
public class BranchServicePricing
{
    public int Id { get; set; }
    public Guid BranchId { get; set; }
    public Branch? Branch { get; set; }
    public int ServiceId { get; set; }
    public decimal CustomPrice { get; set; }
    public bool IsNegotiable { get; set; } = false;
    public decimal? MinimumNegotiablePrice { get; set; }
    public bool IsOffered { get; set; } = true;
}

[Table("stylist_service_durations", Schema = "salon")]
public class StylistServiceDuration
{
    public int Id { get; set; }
    public Guid StylistId { get; set; }
    public StylistProfile? Stylist { get; set; }
    public int ServiceId { get; set; }
    public int DurationMinutes { get; set; }
    public bool IsApprovedByOwner { get; set; } = true;
}

[Table("stylist_working_hours", Schema = "salon")]
public class StylistWorkingHours
{
    public int Id { get; set; }
    public Guid StylistId { get; set; }
    public StylistProfile? Stylist { get; set; }
    public int DayOfWeek { get; set; } // 0 = Sunday, 6 = Saturday
    public TimeSpan StartTime { get; set; }
    public TimeSpan EndTime { get; set; }
    public TimeSpan? BreakStart { get; set; }
    public TimeSpan? BreakEnd { get; set; }
    public bool IsOffDay { get; set; } = false;
}

[Table("stylist_daily_exceptions", Schema = "salon")]
public class StylistDailyException
{
    public int Id { get; set; }
    public Guid StylistId { get; set; }
    public StylistProfile? Stylist { get; set; }
    public DateOnly ExceptionDate { get; set; }
    public TimeSpan? StartTime { get; set; }
    public TimeSpan? EndTime { get; set; }
    public TimeSpan? LunchBreakStart { get; set; }
    public TimeSpan? LunchBreakEnd { get; set; }
    public string? Reason { get; set; }
    public bool IsApprovedByOwner { get; set; } = false;
    public bool IsLeave { get; set; } = false;
}

[Table("compliance_notices", Schema = "salon")]
public class ComplianceNotice
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid SalonId { get; set; }
    public Guid? BranchId { get; set; }
    public Guid IssuedBy { get; set; }
    public string TargetType { get; set; } = "BRANCH"; // STYLIST, OWNER, BRANCH, CUSTOMER
    public Guid? TargetId { get; set; }
    public string? TargetName { get; set; }
    public string NoticeType { get; set; } = "HYGIENE_COMPLAINT";
    public string Subject { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public int GracePeriodHours { get; set; } = 48;
    public string Status { get; set; } = "NOTICE_ISSUED"; // NOTICE_ISSUED, OWNER_REPLIED, RESOLVED, ACTION_TAKEN_INACTIVE
    public string? OwnerReply { get; set; }
    public DateTime? OwnerRepliedAt { get; set; }
    public DateTime IssuedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ActionTakenAt { get; set; }
}

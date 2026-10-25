using System.ComponentModel.DataAnnotations.Schema;

namespace StyleBook.Shared.Domain.Entities;

[Table("countries", Schema = "master")]
public class Country
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string IsoCode { get; set; } = string.Empty;
    public string PhoneCode { get; set; } = string.Empty;
    public string Currency { get; set; } = "INR";
    public bool IsActive { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

[Table("states", Schema = "master")]
public class State
{
    public int Id { get; set; }
    public int CountryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string StateCode { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

[Table("zones", Schema = "master")]
public class Zone
{
    public int Id { get; set; }
    public int StateId { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

[Table("districts", Schema = "master")]
public class District
{
    public int Id { get; set; }
    public int ZoneId { get; set; }
    public string Name { get; set; } = string.Empty;
    public bool IsActive { get; set; } = true;
}

[Table("service_categories", Schema = "master")]
public class ServiceCategory
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? IconUrl { get; set; }
    public int SortOrder { get; set; } = 0;
}

[Table("services", Schema = "master")]
public class MasterService
{
    public int Id { get; set; }
    public int CategoryId { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string TargetGender { get; set; } = "Unisex";
    public int DefaultDurationMinutes { get; set; } = 30;
    public decimal BaseMarketPrice { get; set; } = 0.00m;
    public decimal MinimumFloorPrice { get; set; } = 0.00m;
    public bool IsDoorstepEligible { get; set; } = true;
    public bool IsActive { get; set; } = true;
}

[Table("work_types", Schema = "master")]
public class WorkType
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
}

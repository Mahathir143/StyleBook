using System.ComponentModel.DataAnnotations.Schema;

namespace StyleBook.Shared.Domain.Entities;

[Table("users", Schema = "identity")]
public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Username { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string PhoneNumber { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string? LastName { get; set; }
    public string UserType { get; set; } = "CUSTOMER"; // MANAGEMENT, OWNER, STYLIST, CUSTOMER
    public string? AvatarUrl { get; set; }
    public bool IsActive { get; set; } = true;
    public bool IsPhoneVerified { get; set; } = true;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public List<UserRole> UserRoles { get; set; } = new();
    public List<UserTerritoryAllocation> TerritoryAllocations { get; set; } = new();
}

[Table("roles", Schema = "identity")]
public class Role
{
    public int Id { get; set; }
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
}

[Table("user_roles", Schema = "identity")]
public class UserRole
{
    public Guid UserId { get; set; }
    public User? User { get; set; }
    public int RoleId { get; set; }
    public Role? Role { get; set; }
}

[Table("user_territory_allocations", Schema = "identity")]
public class UserTerritoryAllocation
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public int? CountryId { get; set; }
    public int? StateId { get; set; }
    public int? ZoneId { get; set; }
    public int? DistrictId { get; set; }
    public Guid? BrandId { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

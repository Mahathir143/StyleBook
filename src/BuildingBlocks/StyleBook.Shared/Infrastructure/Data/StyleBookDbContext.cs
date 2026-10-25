using Microsoft.EntityFrameworkCore;
using StyleBook.Shared.Domain.Entities;

namespace StyleBook.Shared.Infrastructure.Data;

public class StyleBookDbContext : DbContext
{
    public StyleBookDbContext(DbContextOptions<StyleBookDbContext> options) : base(options)
    {
    }

    // Master
    public DbSet<Country> Countries => Set<Country>();
    public DbSet<State> States => Set<State>();
    public DbSet<Zone> Zones => Set<Zone>();
    public DbSet<District> Districts => Set<District>();
    public DbSet<ServiceCategory> ServiceCategories => Set<ServiceCategory>();
    public DbSet<MasterService> Services => Set<MasterService>();
    public DbSet<WorkType> WorkTypes => Set<WorkType>();

    // Identity
    public DbSet<User> Users => Set<User>();
    public DbSet<Role> Roles => Set<Role>();
    public DbSet<UserRole> UserRoles => Set<UserRole>();
    public DbSet<UserTerritoryAllocation> UserTerritoryAllocations => Set<UserTerritoryAllocation>();

    // Salon & Stylist
    public DbSet<Salon> Salons => Set<Salon>();
    public DbSet<Branch> Branches => Set<Branch>();
    public DbSet<StylistProfile> StylistProfiles => Set<StylistProfile>();
    public DbSet<BranchServicePricing> BranchServicePricings => Set<BranchServicePricing>();
    public DbSet<StylistServiceDuration> StylistServiceDurations => Set<StylistServiceDuration>();
    public DbSet<StylistWorkingHours> StylistWorkingHours => Set<StylistWorkingHours>();
    public DbSet<StylistDailyException> StylistDailyExceptions => Set<StylistDailyException>();

    // Booking
    public DbSet<Booking> Bookings => Set<Booking>();
    public DbSet<BookingItem> BookingItems => Set<BookingItem>();
    public DbSet<BookingOtp> BookingOtps => Set<BookingOtp>();
    public DbSet<BookingNegotiation> BookingNegotiations => Set<BookingNegotiation>();
    public DbSet<Review> Reviews => Set<Review>();

    // Marketing
    public DbSet<Offer> Offers => Set<Offer>();
    public DbSet<Announcement> Announcements => Set<Announcement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Composite Keys
        modelBuilder.Entity<UserRole>()
            .HasKey(ur => new { ur.UserId, ur.RoleId });

        modelBuilder.Entity<BookingOtp>()
            .HasKey(bo => bo.BookingId);

        modelBuilder.Entity<BranchServicePricing>()
            .HasIndex(p => new { p.BranchId, p.ServiceId })
            .IsUnique();

        modelBuilder.Entity<StylistServiceDuration>()
            .HasIndex(d => new { d.StylistId, d.ServiceId })
            .IsUnique();
    }
}

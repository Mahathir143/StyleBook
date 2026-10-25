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

app.MapGet("/health", () => Results.Ok(new { status = "Healthy", service = "StyleBook.Marketing.Api" }));

// 1. Get Offers (Filter by audience: ALL_OWNERS, MULTI_BRANCH_OWNERS, ALL_CUSTOMERS)
app.MapGet("/api/marketing/offers", async (string? audience, string? creatorType, IUnitOfWork uow) =>
{
    var query = uow.Repository<Offer>().Query().Where(o => o.IsActive);
    if (!string.IsNullOrEmpty(audience))
    {
        query = query.Where(o => o.TargetAudience == audience || o.TargetAudience == "ALL_CUSTOMERS" || o.TargetAudience == "ALL_OWNERS");
    }
    if (!string.IsNullOrEmpty(creatorType))
    {
        query = query.Where(o => o.CreatorType == creatorType);
    }

    var offers = await query.OrderByDescending(o => o.CreatedAt).ToListAsync();
    return Results.Ok(ApiResponse<IEnumerable<Offer>>.Ok(offers));
});

// 2. Create Offer (Management or Owner)
app.MapPost("/api/marketing/offers", async (CreateOfferDto dto, IUnitOfWork uow) =>
{
    var offer = new Offer
    {
        CreatorType = dto.CreatorType,
        CreatorId = dto.CreatorId,
        Title = dto.Title,
        Description = dto.Description,
        DiscountType = dto.DiscountType,
        DiscountValue = dto.DiscountValue,
        TargetAudience = dto.TargetAudience,
        MinBranchesRequired = dto.MinBranchesRequired,
        PromoCode = dto.PromoCode,
        ValidFrom = dto.ValidFrom,
        ValidTo = dto.ValidTo,
        IsActive = true
    };

    await uow.Repository<Offer>().AddAsync(offer);
    await uow.CommitAsync();

    return Results.Ok(ApiResponse<Offer>.Ok(offer, "Offer created successfully"));
});

// 3. Get Announcements
app.MapGet("/api/marketing/announcements", async (string? audience, IUnitOfWork uow) =>
{
    var query = uow.Repository<Announcement>().Query().Where(a => a.IsPublished);
    if (!string.IsNullOrEmpty(audience))
    {
        query = query.Where(a => a.TargetAudience == "GLOBAL" || a.TargetAudience == audience);
    }

    var list = await query.OrderByDescending(a => a.CreatedAt).ToListAsync();
    return Results.Ok(ApiResponse<IEnumerable<Announcement>>.Ok(list));
});

// 4. Create Announcement
app.MapPost("/api/marketing/announcements", async (CreateAnnouncementDto dto, IUnitOfWork uow) =>
{
    var ann = new Announcement
    {
        SenderUserId = dto.SenderUserId,
        SalonId = dto.SalonId,
        Title = dto.Title,
        Content = dto.Content,
        BannerImageUrl = dto.BannerImageUrl,
        TargetAudience = dto.TargetAudience,
        IsPublished = true
    };

    await uow.Repository<Announcement>().AddAsync(ann);
    await uow.CommitAsync();

    return Results.Ok(ApiResponse<Announcement>.Ok(ann, "Announcement broadcast successfully"));
});

app.Run();

public record CreateOfferDto(string CreatorType, Guid CreatorId, string Title, string? Description, string DiscountType, decimal DiscountValue, string TargetAudience, int MinBranchesRequired, string? PromoCode, DateTime ValidFrom, DateTime ValidTo);
public record CreateAnnouncementDto(Guid? SenderUserId, Guid? SalonId, string Title, string Content, string? BannerImageUrl, string TargetAudience);

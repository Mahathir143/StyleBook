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

app.MapGet("/health", () => Results.Ok(new { status = "Healthy", service = "StyleBook.MasterData.Api" }));

// Geographic Master Endpoints
app.MapGet("/api/master/countries", async (IUnitOfWork uow) =>
{
    var countries = await uow.Repository<Country>().GetAllAsync();
    return Results.Ok(ApiResponse<IEnumerable<Country>>.Ok(countries));
});

app.MapGet("/api/master/states", async (int countryId, IUnitOfWork uow) =>
{
    var states = await uow.Repository<State>().FindAsync(s => s.CountryId == countryId);
    return Results.Ok(ApiResponse<IEnumerable<State>>.Ok(states));
});

app.MapGet("/api/master/zones", async (int stateId, IUnitOfWork uow) =>
{
    var zones = await uow.Repository<Zone>().FindAsync(z => z.StateId == stateId);
    return Results.Ok(ApiResponse<IEnumerable<Zone>>.Ok(zones));
});

app.MapGet("/api/master/districts", async (int? zoneId, IUnitOfWork uow) =>
{
    if (zoneId.HasValue)
    {
        var districts = await uow.Repository<District>().FindAsync(d => d.ZoneId == zoneId.Value);
        return Results.Ok(ApiResponse<IEnumerable<District>>.Ok(districts));
    }
    var allDistricts = await uow.Repository<District>().GetAllAsync();
    return Results.Ok(ApiResponse<IEnumerable<District>>.Ok(allDistricts));
});

// Categories & Services
app.MapGet("/api/master/categories", async (IUnitOfWork uow) =>
{
    var categories = await uow.Repository<ServiceCategory>().Query()
        .OrderBy(c => c.SortOrder)
        .ToListAsync();
    return Results.Ok(ApiResponse<IEnumerable<ServiceCategory>>.Ok(categories));
});

app.MapGet("/api/master/services", async (int? categoryId, IUnitOfWork uow) =>
{
    var query = uow.Repository<MasterService>().Query();
    if (categoryId.HasValue)
    {
        query = query.Where(s => s.CategoryId == categoryId.Value);
    }
    var services = await query.Where(s => s.IsActive).ToListAsync();
    return Results.Ok(ApiResponse<IEnumerable<MasterService>>.Ok(services));
});

app.MapGet("/api/master/work-types", async (IUnitOfWork uow) =>
{
    var types = await uow.Repository<WorkType>().GetAllAsync();
    return Results.Ok(ApiResponse<IEnumerable<WorkType>>.Ok(types));
});

app.MapGet("/api/master/roles", async (IUnitOfWork uow) =>
{
    var roles = await uow.Repository<Role>().GetAllAsync();
    return Results.Ok(ApiResponse<IEnumerable<Role>>.Ok(roles));
});

app.Run();

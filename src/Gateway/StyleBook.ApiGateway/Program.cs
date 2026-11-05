using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using StyleBook.ApiGateway.Endpoints;
using StyleBook.Shared.Common;
using StyleBook.Shared.Infrastructure.Data;
using StyleBook.Shared.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// DbContext & Repositories
var connString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<StyleBookDbContext>(options =>
    options.UseNpgsql(connString));

builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// JWT Configuration
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>() ?? new JwtSettings();
builder.Services.AddSingleton(jwtSettings);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret))
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.UseCors("AllowAll");
app.UseAuthentication();
app.UseAuthorization();

// Root & Health Checks for Render
app.MapGet("/", () => Results.Ok(new
{
    service = "StyleBook Unified Cloud API",
    status = "Online",
    version = "1.0.0",
    timestamp = DateTime.UtcNow
}));

app.MapGet("/health", () => Results.Ok(new
{
    status = "Healthy",
    service = "StyleBook.ApiGateway",
    timestamp = DateTime.UtcNow
}));

// Register All Microservice Module Endpoints
app.MapIdentityEndpoints();
app.MapMasterDataEndpoints();
app.MapSalonEndpoints();
app.MapBookingEndpoints();
app.MapMarketingEndpoints();

app.Run();

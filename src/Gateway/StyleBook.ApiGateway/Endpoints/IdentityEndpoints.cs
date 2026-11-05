using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using StyleBook.Shared.Common;
using StyleBook.Shared.Domain.Entities;
using StyleBook.Shared.Infrastructure.Data;
using StyleBook.Shared.Infrastructure.Repositories;

namespace StyleBook.ApiGateway.Endpoints;

public static class IdentityEndpoints
{
    public static void MapIdentityEndpoints(this WebApplication app)
    {
        app.MapPost("/api/auth/login", async (LoginRequest request, IUnitOfWork uow, JwtSettings jwt) =>
        {
            var userRepo = uow.Repository<User>();
            var user = await userRepo.Query()
                .Include(u => u.UserRoles)
                    .ThenInclude(ur => ur.Role)
                .Include(u => u.TerritoryAllocations)
                .FirstOrDefaultAsync(u => u.Username.ToLower() == request.UsernameOrEmail.ToLower() ||
                                          (u.Email != null && u.Email.ToLower() == request.UsernameOrEmail.ToLower()) ||
                                          u.PhoneNumber == request.UsernameOrEmail);

            if (user == null || !PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
            {
                return Results.BadRequest(ApiResponse<object>.Fail("Invalid credentials"));
            }

            if (!user.IsActive)
            {
                return Results.BadRequest(ApiResponse<object>.Fail("Your account is currently disabled."));
            }

            var roles = user.UserRoles.Select(ur => ur.Role?.Code ?? "CUSTOMER").ToList();
            var token = JwtTokenService.GenerateToken(user, roles, jwt);

            var responseData = new
            {
                Token = token,
                User = new
                {
                    user.Id,
                    user.Username,
                    user.Email,
                    user.PhoneNumber,
                    user.FirstName,
                    user.LastName,
                    user.UserType,
                    Roles = roles,
                    Territories = user.TerritoryAllocations.Select(t => new
                    {
                        t.CountryId,
                        t.StateId,
                        t.ZoneId,
                        t.DistrictId,
                        t.BrandId
                    })
                }
            };

            return Results.Ok(ApiResponse<object>.Ok(responseData, "Login successful"));
        });

        app.MapPost("/api/auth/register", async (RegisterRequest req, IUnitOfWork uow, JwtSettings jwt) =>
        {
            var userRepo = uow.Repository<User>();
            var roleRepo = uow.Repository<Role>();

            var existing = await userRepo.Query().AnyAsync(u => u.Username.ToLower() == req.Username.ToLower() || u.PhoneNumber == req.PhoneNumber);
            if (existing)
            {
                return Results.BadRequest(ApiResponse<object>.Fail("Username or Phone number already registered"));
            }

            var newUser = new User
            {
                Username = req.Username,
                Email = req.Email,
                PhoneNumber = req.PhoneNumber,
                FirstName = req.FirstName,
                LastName = req.LastName,
                PasswordHash = PasswordHasher.HashPassword(req.Password),
                UserType = req.UserType ?? "CUSTOMER",
                IsActive = true,
                IsPhoneVerified = true
            };

            await userRepo.AddAsync(newUser);
            await uow.CommitAsync();

            var targetRoleCode = req.UserType switch
            {
                "OWNER" => "SHOP_OWNER",
                "INDEPENDENT" => "INDEPENDENT_OWNER",
                "STYLIST" => "STYLIST",
                _ => "CUSTOMER"
            };

            var role = await roleRepo.Query().FirstOrDefaultAsync(r => r.Code == targetRoleCode);
            if (role != null)
            {
                var userRoleRepo = uow.Repository<UserRole>();
                await userRoleRepo.AddAsync(new UserRole { UserId = newUser.Id, RoleId = role.Id });
                await uow.CommitAsync();
            }

            var roles = new List<string> { targetRoleCode };
            var token = JwtTokenService.GenerateToken(newUser, roles, jwt);

            return Results.Ok(ApiResponse<object>.Ok(new { Token = token, UserId = newUser.Id }, "Registration successful"));
        });

        app.MapGet("/api/auth/me", async (ClaimsPrincipal userClaims, IUnitOfWork uow) =>
        {
            var userIdStr = userClaims.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userIdStr) || !Guid.TryParse(userIdStr, out var userId))
            {
                return Results.Unauthorized();
            }

            var userRepo = uow.Repository<User>();
            var user = await userRepo.Query()
                .Include(u => u.UserRoles).ThenInclude(ur => ur.Role)
                .Include(u => u.TerritoryAllocations)
                .FirstOrDefaultAsync(u => u.Id == userId);

            if (user == null) return Results.NotFound();

            var profile = new
            {
                user.Id,
                user.Username,
                user.Email,
                user.PhoneNumber,
                user.FirstName,
                user.LastName,
                user.UserType,
                Roles = user.UserRoles.Select(ur => ur.Role?.Code),
                user.TerritoryAllocations
            };

            return Results.Ok(ApiResponse<object>.Ok(profile));
        }).RequireAuthorization();

        app.MapPost("/api/users/allocate-territory", async (TerritoryAllocationRequest req, IUnitOfWork uow) =>
        {
            var allocRepo = uow.Repository<UserTerritoryAllocation>();
            var alloc = new UserTerritoryAllocation
            {
                UserId = req.UserId,
                CountryId = req.CountryId,
                StateId = req.StateId,
                ZoneId = req.ZoneId,
                DistrictId = req.DistrictId,
                BrandId = req.BrandId
            };
            await allocRepo.AddAsync(alloc);
            await uow.CommitAsync();
            return Results.Ok(ApiResponse<object>.Ok(alloc, "Territory allocated successfully"));
        }).RequireAuthorization();
    }
}

public record LoginRequest(string UsernameOrEmail, string Password);
public record RegisterRequest(string Username, string? Email, string PhoneNumber, string Password, string FirstName, string? LastName, string? UserType);
public record TerritoryAllocationRequest(Guid UserId, int? CountryId, int? StateId, int? ZoneId, int? DistrictId, Guid? BrandId);


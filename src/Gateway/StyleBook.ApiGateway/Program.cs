using Ocelot.DependencyInjection;
using Ocelot.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("ocelot.json", optional: false, reloadOnChange: true);

builder.Services.AddOcelot(builder.Configuration);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod();
    });
});

var app = builder.Build();

app.UseCors("AllowAll");

// Gateway Root Health Check
app.MapGet("/", () => Results.Ok(new
{
    service = "StyleBook API Gateway (Ocelot)",
    status = "Online",
    version = "1.0.0",
    docs = "All requests route through port 5000"
}));

await app.UseOcelot();

app.Run();

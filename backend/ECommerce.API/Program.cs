using ECommerce.API.Data;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Fetch connection string securely from configurations
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 2. Register the AppDbContext into the Dependency Injection pipeline
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// --- LOOK HERE: Make sure these two lines are exactly in this order ---
builder.Services.AddControllers();     // 1. Register controller paths first
builder.Services.AddOpenApi();         // 2. Then register OpenAPI document services
// ---------------------------------------------------------------------

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();               // Generates raw JSON metadata data
    app.MapScalarApiReference();    // Draws the interactive visual testing dashboard
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

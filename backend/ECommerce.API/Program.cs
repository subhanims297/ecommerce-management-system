using ECommerce.API.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Fetch connection string securely from configurations
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 2. Register the AppDbContext into the Dependency Injection pipeline
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    // Basic local testing setup
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();

using ECommerce.API.Data;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// 1. Fetch connection string securely from configurations
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

// 2. Register the AppDbContext into the Dependency Injection pipeline
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString));

// 3. --- ADD THIS CORS POLICY BLOCK HERE ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // Your React app web address port
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
// ------------------------------------------

builder.Services.AddControllers();
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

// 4. --- ACTIVATE CORS FILTER MIDDLEWARE HERE ---
app.UseCors("AllowReactApp"); // Must be placed exactly between HttpsRedirection and Authorization
// ----------------------------------------------

app.UseAuthorization();
app.MapControllers();

app.Run();

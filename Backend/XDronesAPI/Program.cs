var builder = WebApplication.CreateBuilder(args);
builder.Services.AddControllers();
// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --- ADICIONADO: Configuração do serviço de CORS ---
builder.Services.AddCors(options =>
{
    // Criamos uma política chamada "PermitirTudo" para desenvolvimento
    options.AddPolicy("PermitirTudo",
        policy =>
        {
            policy.AllowAnyOrigin()  // Aceita pedidos de qualquer lugar (do teu frontend)
                  .AllowAnyMethod()  // Aceita GET, POST, PUT, DELETE, etc.
                  .AllowAnyHeader(); // Aceita quaisquer cabeçalhos
        });
});
// --------------------------------------------------

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// --- ADICIONADO: Ativar o Middleware de CORS ---
// Importante: Deve estar antes dos endpoints (MapGet, etc.)
app.UseCors("PermitirTudo");
// ----------------------------------------------

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
{
    var forecast = Enumerable.Range(1, 5).Select(index =>
        new WeatherForecast
        (
            DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            Random.Shared.Next(-20, 55),
            summaries[Random.Shared.Next(summaries.Length)]
        ))
        .ToArray();
    return forecast;
})
.WithName("GetWeatherForecast")
.WithOpenApi();

// Não te esqueças de adicionar o teu Controller de Produtos aqui também,
// senão a rota /api/products não vai funcionar.
app.MapControllers();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
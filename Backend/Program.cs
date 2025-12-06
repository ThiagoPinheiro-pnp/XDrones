using Microsoft.EntityFrameworkCore;
using Backend.Data;   // Se a pasta for XDronesAPI.Data, ajuste aqui
using Backend.Models; // Se a pasta for XDronesAPI.Models, ajuste aqui

var builder = WebApplication.CreateBuilder(args);

// ==================================================================
// 1. CONFIGURAÇÃO DOS SERVIÇOS
// ==================================================================

// Conexão MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// Controllers e Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS (Liberar acesso para o Frontend)
builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTudo", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// ==================================================================
// 2. PIPELINE DE EXECUÇÃO
// ==================================================================

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("PermitirTudo");
app.UseAuthorization();
app.MapControllers();

// ==================================================================
// 3. BANCO DE DADOS (Apenas verifica criação e Admin)
// ==================================================================
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();

        // Garante que o banco existe (sem apagar dados)
        context.Database.EnsureCreated();

        // --- REMOVI A PARTE DOS PRODUTOS AQUI ---
        // Agora o sistema confia 100% nos dados que você inseriu via SQL.

        // Mantive apenas o Admin como backup (se já existir, ele ignora)
        if (!context.Usuarios.Any())
        {
            context.Usuarios.Add(new Usuario 
            { 
                Nome = "Administrador", 
                Email = "admin@xdrones.com", 
                Senha = "123", 
                Role = "Admin" 
            });
            context.SaveChanges();
            Console.WriteLine("--- Usuário Admin de backup criado ---");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro ao conectar no banco: {ex.Message}");
    }
}

app.Run();
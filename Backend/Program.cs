using Microsoft.EntityFrameworkCore;
using Backend.Data;   // <--- CORRIGIDO: Namespace Backend
using Backend.Models; // <--- CORRIGIDO: Namespace Backend

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
// 3. INICIALIZAÇÃO DO BANCO (Verificação e Admin)
// ==================================================================
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();

        // Garante que o banco e tabelas existem
        context.Database.EnsureCreated();

        // Cria apenas o Admin se não existir (Backup)
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
            Console.WriteLine("--- Usuário Admin criado ---");
        }
        else
        {
            Console.WriteLine("--- Banco de Dados conectado com sucesso! ---");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro ao conectar no banco: {ex.Message}");
    }
}

app.Run();
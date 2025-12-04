using System.Globalization;
using Microsoft.EntityFrameworkCore;
using XDronesAPI.Data;
using XDronesAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. CONFIGURAÇÃO DA CULTURE (PT-BR)
var cultureInfo = new CultureInfo("pt-BR");
CultureInfo.DefaultThreadCurrentCulture = cultureInfo;
CultureInfo.DefaultThreadCurrentUICulture = cultureInfo;

// 2. Configurar Conexão MySQL
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("PermitirTudo", policy =>
    {
        policy.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("PermitirTudo");
app.MapControllers();

// 3. CRIAÇÃO AUTOMÁTICA DO BANCO E DADOS INICIAIS (SEEDER)
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();

        // Garante que o banco e tabelas existem
        context.Database.EnsureCreated();

        // 3.1 Seeding de PRODUTOS
        if (!context.Produtos.Any())
        {
            context.Produtos.AddRange(
                new Product { Nome = "DJI Mini 4 Pro", Preco = 4590.00m, Imagem = "assets/img/drone-card-agricultra.png", Categoria = "Agricultura" },
                new Product { Nome = "DJI Air 3", Preco = 8290.00m, Imagem = "assets/img/drone-card-monitoramento.jpeg", Categoria = "Industria" },
                new Product { Nome = "DJI Mavic 3", Preco = 12590.00m, Imagem = "assets/img/drone-card-defesa.jpg", Categoria = "Defesa" }
            );
            context.SaveChanges();
        }

        // 3.2 Seeding de USUÁRIOS
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

            Console.WriteLine("--- Usuário ADMIN criado: admin@xdrones.com / 123 ---");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro ao criar o banco de dados: {ex.Message}");
    }
}

app.Run();
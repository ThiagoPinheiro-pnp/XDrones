using Microsoft.EntityFrameworkCore;
using XDronesAPI.Data;
using XDronesAPI.Models;

var builder = WebApplication.CreateBuilder(args);

// 1. Configurar Conexão MySQL
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

// 5. CRIAÇÃO AUTOMÁTICA DO BANCO E DADOS INICIAIS (SEEDER ATUALIZADO)
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var context = services.GetRequiredService<AppDbContext>();
        
        // Garante que o banco e tabelas existem
        context.Database.EnsureCreated();

        // 5.1 Seeding de PRODUTOS
        if (!context.Produtos.Any())
        {
            context.Produtos.AddRange(
                new Product { Nome = "DJI Mini 4 Pro", Preco = 4590.00m, Imagem = "assets/img/drone-card-agricultra.png", Categoria = "Agricultura" },
                new Product { Nome = "DJI Air 3", Preco = 8290.00m, Imagem = "assets/img/drone-card-monitoramento.jpeg", Categoria = "Industria" },
                new Product { Nome = "DJI Mavic 3", Preco = 12590.00m, Imagem = "assets/img/drone-card-defesa.jpg", Categoria = "Defesa" }
            );
            context.SaveChanges(); // Salva produtos primeiro
        }

        // 5.2 Seeding de USUÁRIOS (NOVO!)
        if (!context.Usuarios.Any())
        {
            context.Usuarios.Add(new Usuario 
            { 
                Nome = "Administrador", 
                Email = "admin@xdrones.com", 
                Senha = "123", // Senha simples para teste
                Role = "Admin" 
            });
            context.SaveChanges(); // Salva o usuário
            Console.WriteLine("--- Usuário ADMIN criado: admin@xdrones.com / 123 ---");
        }
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Erro ao criar o banco de dados: {ex.Message}");
    }
}

app.Run();
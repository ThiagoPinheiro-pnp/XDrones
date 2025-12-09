using Microsoft.EntityFrameworkCore;
using Backend.Data;  
using Backend.Models;
using BCrypt.Net;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

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
//builder.Services.AddSwaggerGen();


builder.Services.AddSwaggerGen(c =>
{   
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "NomeDaSuaAPI", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization", // Nome do cabeçalho HTTP
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer", // Esquema padrão usado com JWT
        BearerFormat = "JWT",
        In = ParameterLocation.Header, // Indica que o token é passado no cabeçalho
        Description = "Insira o token JWT no formato: Bearer {seu token}",
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer" // ID definido acima
                }
            },
            new string[] {} // Escopos necessários (deixe vazio para JWT simples)
        }
    });
});




builder.Services.AddScoped<TokenService>();
builder.Services.AddScoped<ValidationService>();

var jwtKey = builder.Configuration.GetValue<string>("Jwt:Key") ?? throw new InvalidOperationException("Jwt:Key não configurado");
var key = Encoding.ASCII.GetBytes(jwtKey);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.RequireHttpsMetadata = false; // Mude para true em produção
    options.SaveToken = true;
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["Jwt:Audience"],
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero // Sem margem de tempo para expiração
    };
});





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
app.UseAuthentication();
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
                Senha = BCrypt.Net.BCrypt.HashPassword("123"), 
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
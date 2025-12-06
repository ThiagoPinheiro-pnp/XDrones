using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AuthController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // 1. Verifica se o usuário existe no banco
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == request.Email && u.Senha == request.Senha);

            if (usuario == null)
            {
                return Unauthorized(new { mensagem = "Email ou senha inválidos." });
            }

            // 2. Se existe, gera um token simples (simulação)
            // Em projetos reais, aqui usaríamos JWT (Json Web Token)
            var tokenSimulado = $"token-acesso-{usuario.Id}-{Guid.NewGuid()}";

            return Ok(new { 
                mensagem = "Login realizado com sucesso!", 
                token = tokenSimulado, 
                usuario = usuario.Nome,
                role = usuario.Role
            });
        }
        
        // Rota opcional para criar usuários (Registro)
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Usuario usuario)
        {
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return Ok(new { mensagem = "Usuário criado com sucesso!" });
        }
    }
}
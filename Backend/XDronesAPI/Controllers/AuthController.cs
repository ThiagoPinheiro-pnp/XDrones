using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XDronesAPI.Data;
using XDronesAPI.Models;

namespace XDronesAPI.Controllers
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
            // Vai ao banco MySQL procurar um usuário com esse email e senha
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == request.Email && u.Senha == request.Senha);

            // Se não achou ninguém, nega o acesso
            if (usuario == null)
            {
                return Unauthorized(new { mensagem = "Email ou senha incorretos!" });
            }

            // Se achou, libera o acesso e manda um token (simulado)
            return Ok(new { 
                mensagem = "Login realizado com sucesso!", 
                token = $"token-acesso-{usuario.Id}-{DateTime.Now.Ticks}", 
                usuario = usuario.Nome,
                tipo = usuario.Role
            });
        }
    }
}
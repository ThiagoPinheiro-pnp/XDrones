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

        // ==========================================================
        // 1. LOGIN (Entrar no sistema)
        // ==========================================================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            // Busca o usuário no banco pelo Email e Senha
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == request.Email && u.Senha == request.Senha);

            // Se não achar, retorna erro 401 (Não autorizado)
            if (usuario == null)
            {
                return Unauthorized(new { mensagem = "Email ou senha inválidos." });
            }

            // Gera um token simulado (em produção usaríamos JWT)
            var tokenSimulado = $"token-{usuario.Id}-{Guid.NewGuid()}";

            // Retorna os dados para o Frontend
            return Ok(new { 
                mensagem = "Login realizado com sucesso!", 
                token = tokenSimulado, 
                
                // --- CORREÇÃO IMPORTANTE AQUI ---
                id = usuario.Id,  // Precisamos enviar o ID para buscar os pedidos depois!
                // --------------------------------
                
                usuario = usuario.Nome,
                role = usuario.Role
            });
        }

        // ==========================================================
        // 2. REGISTRO (Criar nova conta)
        // ==========================================================
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] Usuario usuario)
        {
            // Verifica se o email já existe para evitar duplicidade
            if (await _context.Usuarios.AnyAsync(u => u.Email == usuario.Email))
            {
                return BadRequest(new { mensagem = "Este email já está cadastrado." });
            }

            // Se a Role (função) vier vazia, define como "Cliente"
            if (string.IsNullOrEmpty(usuario.Role)) 
            {
                usuario.Role = "Cliente";
            }

            // Salva no banco
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Usuário criado com sucesso!" });
        }
    }
}
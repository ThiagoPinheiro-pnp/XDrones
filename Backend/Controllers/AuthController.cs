using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using BCrypt.Net;
using Microsoft.AspNetCore.Authorization;

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly TokenService _tokenService; 
        private readonly ValidationService _validationService;

        public AuthController(AppDbContext context, TokenService tokenService, ValidationService validationService)
        {
            _context = context;
            _tokenService = tokenService;
            _validationService = validationService;
        }

        // ==========================================================
        // 1. LOGIN (Entrar no sistema)
        // ==========================================================
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == request.Email);
            
            bool senhaValida = false;
            if (usuario != null)
            {
                try
                {
                    senhaValida = BCrypt.Net.BCrypt.Verify(request.Senha, usuario.Senha);
                }
                catch
                {
                    // Se a senha armazenada não estiver em formato bcrypt (ex: texto puro),
                    // como fallback (apenas para desenvolvimento) compara texto simples.
                    // Em produção, obrigue re-hash das senhas.
                    senhaValida = (usuario.Senha == request.Senha);
                }
            }

            if (usuario == null || !senhaValida)
            {
                return Unauthorized(new { mensagem = "Email ou senha inválidos." });
            }

            // --- Autenticação bem-sucedida a partir daqui ---

            // 3. Gera um token simulado (em produção usaríamos JWT)
            // var tokenSimulado = $"token-{usuario.Id}-{Guid.NewGuid()}";
            // 3. Gera o JWT usando o TokenService
            var jwtToken = _tokenService.GenerateToken(usuario);

            // 4. Retorna os dados para o Frontend
            return Ok(new
            {
                mensagem = "Login realizado com sucesso!",
                token = jwtToken,

                id = usuario.Id,

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
            // 0. Valida formato de email
            if (!_validationService.IsValidEmail(usuario.Email))
            {
                return BadRequest(new { mensagem = "Formato de email inválido." });
            }

            // Valida CPF (se fornecido)
            if (!string.IsNullOrWhiteSpace(usuario.Cpf) && !_validationService.IsValidCPF(usuario.Cpf))
            {
                return BadRequest(new { mensagem = "CPF inválido. Verifique o número digitado." });
            }

            // Valida força da senha
            var pwdValidation = _validationService.ValidatePassword(usuario.Senha);
            if (!pwdValidation.Success)
            {
                return BadRequest(new { mensagem = pwdValidation.Error });
            }

            // 1. **Verifica se o email já existe**
            if (await _context.Usuarios.AnyAsync(u => u.Email == usuario.Email))
            {
                return BadRequest(new { mensagem = "Este email já está cadastrado." });
            }

            // 2. **Define a Role padrão e impede atribuição pelo cliente**
            // Por segurança, não confiamos em valores enviados pelo cliente para a role.
            // Sempre atribuímos a role padrão 'Cliente' no registro público.
            usuario.Role = "Cliente";

            // Hash da senha (validação já garantiu que senha não é nula)
            usuario.Senha = BCrypt.Net.BCrypt.HashPassword(usuario.Senha);

            // 4. **Salva no banco**
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            return Ok(new { mensagem = "Usuário criado com sucesso!" });
        }

        // ==========================================================
        // 3. RETORNAR USUÁRIO ATUAL (me)
        // ==========================================================
        [HttpGet("me")]
        [Authorize]
        public async Task<IActionResult> Me()
        {
            try
            {
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (userId == null) return Unauthorized();

                if (!int.TryParse(userId, out var id)) return Unauthorized();

                var usuario = await _context.Usuarios.FindAsync(id);
                if (usuario == null) return NotFound();

                // Não retornamos a senha
                return Ok(new
                {
                    id = usuario.Id,
                    nome = usuario.Nome,
                    email = usuario.Email,
                    role = usuario.Role,
                    endereco = usuario.Endereco,
                    numero = usuario.Numero,
                    cep = usuario.Cep,
                    referencia = usuario.Referencia,
                    cpf = usuario.Cpf
                });
            }
            catch (Exception ex)
            {
                // Log simples do erro no servidor (não vaze detalhes para o cliente)
                Console.WriteLine($"Erro em /api/Auth/me: {ex}");
                return StatusCode(500, new { mensagem = "Erro interno ao carregar perfil." });
            }
        }

        // ==========================================================
        // 4. ATUALIZAR PERFIL DO USUÁRIO (me)
        // ==========================================================
        [HttpPut("me")]
        [Authorize]
        public async Task<IActionResult> UpdateMe([FromBody] Usuario dto)
        {
            try
            {
                var userId = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                if (userId == null) return Unauthorized();
                if (!int.TryParse(userId, out var id)) return Unauthorized();

                var usuario = await _context.Usuarios.FindAsync(id);
                if (usuario == null) return NotFound();

                // Atualiza campos permitidos (não permitimos alterar role aqui)
                usuario.Nome = dto.Nome ?? usuario.Nome;
                usuario.Endereco = dto.Endereco ?? usuario.Endereco;
                usuario.Numero = dto.Numero ?? usuario.Numero;
                usuario.Cep = dto.Cep ?? usuario.Cep;
                usuario.Referencia = dto.Referencia ?? usuario.Referencia;
                usuario.Cpf = dto.Cpf ?? usuario.Cpf;

                // Se for fornecida nova senha, valida e atualiza (hash)
                if (!string.IsNullOrWhiteSpace(dto.Senha))
                {
                    var pwdValidation = _validationService.ValidatePassword(dto.Senha);
                    if (!pwdValidation.Success)
                    {
                        return BadRequest(new { mensagem = pwdValidation.Error });
                    }
                    usuario.Senha = BCrypt.Net.BCrypt.HashPassword(dto.Senha);
                }

                _context.Usuarios.Update(usuario);
                await _context.SaveChangesAsync();

                return Ok(new { mensagem = "Perfil atualizado com sucesso." });
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Erro em PUT /api/Auth/me: {ex}");
                return StatusCode(500, new { mensagem = "Erro interno ao atualizar perfil." });
            }
        }
    }





}
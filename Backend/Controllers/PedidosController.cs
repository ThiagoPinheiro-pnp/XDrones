using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PedidosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PedidosController(AppDbContext context)
        {
            _context = context;
        }

        // ==========================================================
        // 1. CRIAR NOVO PEDIDO (Chamado pelo Checkout)
        // ==========================================================
        [HttpPost]
        [Authorize] 
        public async Task<IActionResult> CriarPedido([FromBody] Pedido pedido)
        {
            // Validação simples
            if (pedido == null)
            {
                return BadRequest("Dados do pedido inválidos.");
            }

            // Define a data atual do servidor (Brasília/Local)
            pedido.DataPedido = DateTime.Now;

            // Adiciona ao banco de dados MySQL
            _context.Pedidos.Add(pedido);
            await _context.SaveChangesAsync();

            // Retorna sucesso com o ID do pedido gerado
            return Ok(new { 
                mensagem = "Pedido realizado com sucesso!", 
                idPedido = pedido.Id 
            });
        }

        // ==========================================================
        // 2. LISTAR PEDIDOS DO USUÁRIO (Chamado pelo Perfil/Meus Pedidos)
        // ==========================================================
        [HttpGet("usuario/{usuarioId}")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<Pedido>>> GetPedidosPorUsuario(int usuarioId)
        {
            // Validação: apenas o próprio usuário ou um Admin pode consultar os pedidos
            var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim == null)
            {
                return Unauthorized();
            }

            // Se não for Admin e tentar acessar outro usuário, bloqueia
            if (!User.IsInRole("Admin") && userIdClaim != usuarioId.ToString())
            {
                return Forbid();
            }

            // Busca na tabela 'Pedidos' todos que tenham o UsuarioId igual ao solicitado
            var pedidos = await _context.Pedidos
                .Where(p => p.UsuarioId == usuarioId)
                .OrderByDescending(p => p.DataPedido) // Ordena do mais recente para o mais antigo
                .ToListAsync();

            return Ok(pedidos);
        }
    }
}
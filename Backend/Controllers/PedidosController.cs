using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;


namespace Backend.Controllers
{
[ApiController]
[Route("api/[controller]")]
public class PedidosController : ControllerBase
{
private readonly AppDbContext _db;


public PedidosController(AppDbContext db) { _db = db; }


[HttpGet]
public async Task<IActionResult> GetAll() => Ok(await _db.Pedidos.Include(p => p.Itens).ToListAsync());


[HttpGet("{id}")]
public async Task<IActionResult> Get(int id)
{
var p = await _db.Pedidos.Include(x => x.Itens).FirstOrDefaultAsync(x => x.Id == id);
if (p == null) return NotFound();
return Ok(p);
}


[HttpPost]
public async Task<IActionResult> Create([FromBody] CreatePedidoDto dto)
{
var cliente = await _db.Clientes.FindAsync(dto.ClienteId);
if (cliente == null) return BadRequest("cliente not found");
var pedido = new Pedido { Cliente = cliente };
foreach (var it in dto.Itens)
{
var detalhe = new DetalhesPedido { IdProduto = it.ProdutoId, NmProduto = it.Nome, VlProduto = it.Preco, QtdPedido = it.Quantidade };
detalhe.CalcularPreco();
pedido.Itens.Add(detalhe);
}
_db.Pedidos.Add(pedido);
await _db.SaveChangesAsync();
return CreatedAtAction(nameof(Get), new { id = pedido.Id }, pedido);
}
}


public record CreatePedidoDto(int ClienteId, List<CreateItemDto> Itens);
public record CreateItemDto(int ProdutoId, string Nome, decimal Preco, int Quantidade);
}
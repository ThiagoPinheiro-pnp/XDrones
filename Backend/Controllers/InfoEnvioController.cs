using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;


namespace Backend.Controllers
{
[ApiController]
[Route("api/[controller]")]
public class InfoEnvioController : ControllerBase
{
private readonly AppDbContext _db;
public InfoEnvioController(AppDbContext db) { _db = db; }


[HttpPost]
public async Task<IActionResult> Create([FromBody] InfoEnvio dto)
{
_db.InfosEnvio.Add(dto);
await _db.SaveChangesAsync();
return CreatedAtAction(nameof(Get), new { id = dto.Id }, dto);
}


[HttpGet("{id}")]
public async Task<IActionResult> Get(int id)
{
var e = await _db.InfosEnvio.FindAsync(id);
if (e == null) return NotFound();
return Ok(e);
}
}
}
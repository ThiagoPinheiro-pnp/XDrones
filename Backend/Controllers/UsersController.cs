using Microsoft.AspNetCore.Mvc;
using Backend.Services;
using Backend.Models;


namespace Backend.Controllers
{
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
private readonly IUserService _userService;


public UsersController(IUserService userService) { _userService = userService; }


[HttpPost("register")]
public async Task<IActionResult> RegisterCliente([FromBody] RegisterClienteDto dto)
{
var existing = await _userService.GetByUsernameAsync(dto.Username);
if (existing != null) return BadRequest("username already exists");
var cliente = await _userService.CreateClienteAsync(dto.Username, dto.Email, dto.Password, dto.NomeCliente);
return CreatedAtAction(nameof(GetById), new { id = cliente.Id }, new { cliente.Id, cliente.Username, cliente.Email });
}


[HttpPost("login")]
public async Task<IActionResult> Login([FromBody] LoginDto dto)
{
var ok = await _userService.VerifyPasswordAsync(dto.Username, dto.Password);
if (!ok) return Unauthorized();
return Ok(new { message = "login ok" });
}


[HttpGet("{id}")]
public async Task<IActionResult> GetById(int id)
{
var u = await _userService.GetByIdAsync(id);
if (u == null) return NotFound();
return Ok(u);
}
}


public record RegisterClienteDto(string Username, string Email, string Password, string NomeCliente);
public record LoginDto(string Username, string Password);
}
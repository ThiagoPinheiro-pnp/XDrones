namespace Backend.Models
{
public abstract class Usuario
{
public int Id { get; set; }
public string Username { get; set; } = null!;
public string Email { get; set; } = null!;
public string PasswordHash { get; set; } = null!; // hashed password
public DateTime DtRegistro { get; set; } = DateTime.UtcNow;
}
}
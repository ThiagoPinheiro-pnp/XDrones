using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Backend.Data;
using Backend.Models;

namespace Backend.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;
        private readonly PasswordHasher<Usuario> _passwordHasher;

        public UserService(AppDbContext context)
        {
            _context = context;
            _passwordHasher = new PasswordHasher<Usuario>();
        }

        public async Task<Usuario?> Authenticate(string email, string password)
        {
            var user = await _context.Usuarios.FirstOrDefaultAsync(x => x.Email == email);

            if (user == null) return null;

            var result = _passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);

            if (result == PasswordVerificationResult.Failed) return null;

            return user;
        }

        public async Task<Usuario> Register(Usuario usuario, string password)
        {
            usuario.PasswordHash = _passwordHasher.HashPassword(usuario, password);
            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();
            return usuario;
        }

        public async Task<Usuario?> GetById(int id)
        {
            return await _context.Usuarios.FindAsync(id);
        }
        public async Task<Usuario?> GetByUsernameAsync(string username)
        {
            return await _context.Usuarios.FirstOrDefaultAsync(x => x.Username == username);
        }
        public async Task<Cliente> CreateClienteAsync(string username, string email, string password, string nomeCliente)
        {
            var cliente = new Cliente
            {
                Username = username,
                Email = email,
                NomeCliente = nomeCliente,
                TipoUsuario = "Cliente", // discriminator TPH
                DtRegistro = DateTime.UtcNow
            };

            cliente.PasswordHash = _passwordHasher.HashPassword(cliente, password);

            _context.Usuarios.Add(cliente);
            await _context.SaveChangesAsync();

            return cliente;
        }



    }
}

using Backend.Models;

namespace Backend.Services
{
    public interface IUserService
    {
        Task<Usuario?> Authenticate(string email, string password);
        Task<Usuario?> GetById(int id);
        Task<Usuario> Register(Usuario usuario, string password);
        Task<Usuario?> GetByUsernameAsync(string username);

        Task<Cliente> CreateClienteAsync(string username, string email, string password, string nomeCliente);

    }
}

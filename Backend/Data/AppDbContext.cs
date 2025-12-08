using Microsoft.EntityFrameworkCore;
using Backend.Models;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        // Tabela de Pedidos (que já criamos antes)
        public DbSet<Pedido> Pedidos { get; set; }

        // Tabela de Produtos (ADICIONAR ESTA LINHA)
        public DbSet<Product> Produtos { get; set; }
        
        public DbSet<Usuario> Usuarios { get; set; }
    }
}
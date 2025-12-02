using Microsoft.EntityFrameworkCore;
using XDronesAPI.Models;

namespace XDronesAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Product> Produtos { get; set; }

        public DbSet<Usuario> Usuarios { get; set; }
    }
}
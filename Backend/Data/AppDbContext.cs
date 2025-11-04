using Microsoft.EntityFrameworkCore;
using Backend.Models;


namespace Backend.Data
{
public class AppDbContext : DbContext
{
public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}


public DbSet<Usuario> Usuarios { get; set; }
public DbSet<Cliente> Clientes { get; set; }
public DbSet<Administrador> Administradores { get; set; }
public DbSet<Pedido> Pedidos { get; set; }
public DbSet<DetalhesPedido> DetalhesPedidos { get; set; }
public DbSet<InfoEnvio> InfosEnvio { get; set; }


protected override void OnModelCreating(ModelBuilder modelBuilder)
{
// TPH configuration: discriminator
modelBuilder.Entity<Usuario>()
.HasDiscriminator<string>("UserType")
.HasValue<Usuario>("Usuario")
.HasValue<Cliente>("Cliente")
.HasValue<Administrador>("Administrador");


modelBuilder.Entity<Usuario>().Property(u => u.Username).IsRequired();
modelBuilder.Entity<Usuario>().Property(u => u.Email).IsRequired();


modelBuilder.Entity<Cliente>().ToTable("Usuarios");
modelBuilder.Entity<Administrador>().ToTable("Usuarios");
modelBuilder.Entity<Usuario>().ToTable("Usuarios");


// Pedido <-> DetalhesPedido
modelBuilder.Entity<DetalhesPedido>()
.HasOne(d => d.Pedido)
.WithMany(p => p.Itens)
.HasForeignKey(d => d.PedidoId)
.OnDelete(DeleteBehavior.Cascade);


base.OnModelCreating(modelBuilder);
}
}
}
namespace Backend.Models
{
public class Pedido
{
public int Id { get; set; }
public DateTime DtCriacao { get; set; } = DateTime.UtcNow;
public DateTime? DataEnvio { get; set; }
public int ClienteId { get; set; }
public Cliente Cliente { get; set; } = null!;
public string StPedido { get; set; } = "Pendente";


// Relacionamento 1..* -> DetalhesPedido
public List<DetalhesPedido> Itens { get; set; } = new();


// Relacionamento 1 -> InfoEnvio (opcional)
public int? InfoEnvioId { get; set; }
public InfoEnvio? InfoEnvio { get; set; }


// Método utilitário
public decimal CalcularTotal() => Itens.Sum(i => i.VlSubtotal);
}
}
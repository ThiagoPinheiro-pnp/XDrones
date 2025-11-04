namespace Backend.Models
{
public class DetalhesPedido
{
public int Id { get; set; }
public int PedidoId { get; set; }
public Pedido Pedido { get; set; } = null!;


public int IdProduto { get; set; }
public string NmProduto { get; set; } = string.Empty;
public decimal VlProduto { get; set; }
public int QtdPedido { get; set; }
public decimal VlSubtotal { get; set; }


public void CalcularPreco() => VlSubtotal = VlProduto * QtdPedido;
}
}
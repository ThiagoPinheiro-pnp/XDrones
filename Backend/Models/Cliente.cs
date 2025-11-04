namespace Backend.Models
{
public class Cliente : Usuario
{
public string NomeCliente { get; set; } = null!;
public string EndCliente { get; set; } = string.Empty;
public string CdCreditCardInfo { get; set; } = string.Empty; // atenção: sensível
public string InfoEnvio { get; set; } = string.Empty; // opção simples


// Navegação
public List<Pedido> Pedidos { get; set; } = new();
}
}
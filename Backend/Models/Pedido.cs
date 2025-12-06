using System;

namespace XDronesAPI.Models
{
    public class Pedido
    {
        public int Id { get; set; }
        public string NomeCliente { get; set; } = string.Empty;
        public string Endereco { get; set; } = string.Empty;
        public string FormaPagamento { get; set; } = string.Empty;
        public decimal Total { get; set; }
        public DateTime DataPedido { get; set; } = DateTime.Now;
        
        // Aqui guardamos quem comprou (simples)
        public int UsuarioId { get; set; } 
    }
}
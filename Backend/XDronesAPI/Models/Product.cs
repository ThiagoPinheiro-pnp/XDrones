using System.ComponentModel.DataAnnotations.Schema;

namespace XDronesAPI.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        
        [Column(TypeName = "decimal(18,2)")] // Garante precisão de moeda no banco
        public decimal Preco { get; set; }
        
        public string Imagem { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        
        // NOVO CAMPO:
        public string Descricao { get; set; } = string.Empty;
    }
}   
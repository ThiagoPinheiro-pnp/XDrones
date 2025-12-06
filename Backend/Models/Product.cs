using System.ComponentModel.DataAnnotations.Schema;

namespace XDronesAPI.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        
        // Define que é dinheiro com 2 casas decimais no banco
        [Column(TypeName = "decimal(18,2)")] 
        public decimal Preco { get; set; }
        
        public string Imagem { get; set; } = string.Empty;
        public string Categoria { get; set; } = string.Empty;
        
        // O campo novo que estava no JSON
        public string Descricao { get; set; } = string.Empty;
    }
}
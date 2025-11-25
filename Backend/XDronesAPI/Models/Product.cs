namespace XDronesAPI.Models
{
    // Esta classe define a estrutura de um produto no backend.
    public class Product
    {
        // O ID único do produto
        public int Id { get; set; }

        // O nome do drone
        public string Nome { get; set; }

        // O preço. Em C#, usamos 'decimal' para valores monetários para garantir precisão.
        public decimal Preco { get; set; } 

        // O caminho da imagem (ex: "assets/img/drone1.jpg")
        public string Imagem { get; set; }
    }
}
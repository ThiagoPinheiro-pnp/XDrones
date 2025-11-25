using Microsoft.AspNetCore.Mvc;
using XDronesAPI.Models; // Importante: Permite usar a classe Product que criamos

namespace XDronesAPI.Controllers
{
    // Define que este controlador responde no endereço "/api/products"
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        // --- DADOS MOCK (Temporário) ---
        // Uma lista estática que simula o nosso banco de dados por enquanto.
        private static readonly List<Product> _produtosMock = new List<Product>
        {
            new Product { 
                Id = 1, 
                Nome = "DJI Mini 4 Pro", 
                Preco = 4590.00m, 
                Imagem = "assets/img/drone-card-agricultra.png" // Usa nomes das tuas imagens reais
            },
            new Product { 
                Id = 2, 
                Nome = "DJI Air 3 Fly More", 
                Preco = 8290.00m, 
                Imagem = "assets/img/drone-card-monitoramento.jpeg" 
            },
            new Product { 
                Id = 3, 
                Nome = "DJI Mavic 3 Pro", 
                Preco = 12590.00m, 
                Imagem = "assets/img/drone-card-defesa.jpg" 
            }
        };
        // -------------------------------

        // Método GET: api/products
        // Quando o frontend pedir a lista, este método é executado.
        [HttpGet]
        public ActionResult<IEnumerable<Product>> GetProducts()
        {
            // Retorna a lista mock com um código 200 OK.
            // O .NET transforma automaticamente a lista de C# para JSON.
            return Ok(_produtosMock);
        }
    }
}   
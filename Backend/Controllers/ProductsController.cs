using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using XDronesAPI.Data;
using XDronesAPI.Models;

namespace XDronesAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ProductsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            return await _context.Produtos.ToListAsync();
        }
    }
}
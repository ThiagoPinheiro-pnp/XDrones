using Backend.Services;

namespace Backend.Services
{
    public class InMemoryCartService : ICartService
    {
        private readonly Dictionary<int, int> _items = new Dictionary<int, int>();

        public void AddItem(int productId, int quantity)
        {
            if (_items.ContainsKey(productId))
                _items[productId] += quantity;
            else
                _items[productId] = quantity;
        }

        public void RemoveItem(int productId)
        {
            if (_items.ContainsKey(productId))
                _items.Remove(productId);
        }

        public Dictionary<int, int> GetItems()
        {
            return _items;
        }

        public void ClearCart()
        {
            _items.Clear();
        }

        public float GetTotal(Dictionary<int, float> productPrices)
        {
            float total = 0;

            foreach (var item in _items)
            {
                if (productPrices.ContainsKey(item.Key))
                {
                    total += productPrices[item.Key] * item.Value;
                }
            }

            return total;
        }
    }
}

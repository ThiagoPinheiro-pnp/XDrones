namespace Backend.Services
{
    public interface ICartService
    {
        void AddItem(int productId, int quantity);
        void RemoveItem(int productId);
        Dictionary<int, int> GetItems();
        void ClearCart();
        float GetTotal(Dictionary<int, float> productPrices);
    }
}

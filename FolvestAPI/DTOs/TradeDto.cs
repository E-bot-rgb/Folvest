namespace FolvestAPI.DTOs
{
    public class TradeDto
    {
        public string Symbol { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }
    }
}
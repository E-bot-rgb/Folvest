namespace FolvestAPI.Models
{
	public class Transaction
	{
		public int Id { get; set; }
		public string Symbol { get; set; } = string.Empty;
		public int Quantity { get; set; }
		public decimal PriceAtPurchase { get; set; }
		public string Type { get; set; } = string.Empty; // "Buy" eller "Sell"
		public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
		public int PortfolioId { get; set; }
		public Portfolio? Portfolio { get; set; }
	}
}
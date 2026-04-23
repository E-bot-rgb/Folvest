namespace FolvestAPI.Models
{
	public class Portfolio
	{
		public int Id { get; set; }
		public decimal Balance { get; set; } = 100000;
		public int UserId { get; set; }
		public User? User { get; set; }
		public ICollection<Transaction> Transactions { get; set; } = new List<Transaction>();
	}
}
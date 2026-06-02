using Microsoft.EntityFrameworkCore;
using FolvestAPI.Models;

namespace FolvestAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; }
        public DbSet<Portfolio> Portfolios { get; set; }
        public DbSet<Stock> Stocks { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = 1,
                    Email = "admin@folvest.com",
                    PasswordHash = "$2a$11$bXcQH.5OqF9JCNn3dzlAVeecjp7NAlewzHpqaIEsqMmyYB7bMc.ra",
                    Role = "Admin"
                },
                new User
                {
                    Id = 2,
                    Email = "user@folvest.com",
                    PasswordHash = "$2a$11$XDIgR.aY70TJD0TAAD8dnuQ7GqSZ6oW53F/VWQ37.XOlpNYmi7Ch6",
                    Role = "User"
                }
            );

            modelBuilder.Entity<Stock>().HasData(
                new Stock { Id = 1, Symbol = "AAPL", Name = "Apple Inc.", CurrentPrice = 189.50m },
                new Stock { Id = 2, Symbol = "MSFT", Name = "Microsoft Corp.", CurrentPrice = 415.20m },
                new Stock { Id = 3, Symbol = "GOOGL", Name = "Alphabet Inc.", CurrentPrice = 175.80m },
                new Stock { Id = 4, Symbol = "TSLA", Name = "Tesla Inc.", CurrentPrice = 245.30m }
            );
        }
    }
}
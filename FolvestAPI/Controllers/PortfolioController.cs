using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using FolvestAPI.Data;
using FolvestAPI.Models;
using FolvestAPI.DTOs;
namespace FolvestAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class PortfolioController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PortfolioController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/portfolio
        [HttpGet]
        public async Task<IActionResult> GetPortfolio()
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var portfolio = await _context.Portfolios
                .Include(p => p.Transactions)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (portfolio == null)
                return NotFound("Portfolio not found.");

            return Ok(portfolio);
        }

        // POST /api/portfolio/buy
        [HttpPost("buy")]
        public async Task<IActionResult> Buy([FromBody] TradeDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var portfolio = await _context.Portfolios
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (portfolio == null)
                return NotFound("Portfolio not found.");

            var totalCost = dto.Price * dto.Quantity;

            if (portfolio.Balance < totalCost)
                return BadRequest("Insufficient balance.");

            portfolio.Balance -= totalCost;

            var transaction = new Transaction
            {
                Symbol = dto.Symbol,
                Quantity = dto.Quantity,
                PriceAtPurchase = dto.Price,
                Type = "Buy",
                PortfolioId = portfolio.Id
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Purchase successful.", balance = portfolio.Balance });
        }

        // POST /api/portfolio/sell
        [HttpPost("sell")]
        public async Task<IActionResult> Sell([FromBody] TradeDto dto)
        {
            var userId = int.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

            var portfolio = await _context.Portfolios
                .Include(p => p.Transactions)
                .FirstOrDefaultAsync(p => p.UserId == userId);

            if (portfolio == null)
                return NotFound("Portfolio not found.");

            var totalOwned = portfolio.Transactions
                .Where(t => t.Symbol == dto.Symbol && t.Type == "Buy")
                .Sum(t => t.Quantity)
                - portfolio.Transactions
                .Where(t => t.Symbol == dto.Symbol && t.Type == "Sell")
                .Sum(t => t.Quantity);

            if (totalOwned < dto.Quantity)
                return BadRequest("Insufficient shares.");

            portfolio.Balance += dto.Price * dto.Quantity;

            var transaction = new Transaction
            {
                Symbol = dto.Symbol,
                Quantity = dto.Quantity,
                PriceAtPurchase = dto.Price,
                Type = "Sell",
                PortfolioId = portfolio.Id
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return Ok(new { message = "Sale successful.", balance = portfolio.Balance });
        }

        // DELETE /api/portfolio/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteTransaction(int id)
        {
            var transaction = await _context.Transactions.FindAsync(id);

            if (transaction == null)
                return NotFound("Transaction not found.");

            _context.Transactions.Remove(transaction);
            await _context.SaveChangesAsync();

            return Ok("Transaction deleted.");
        }
    }
}
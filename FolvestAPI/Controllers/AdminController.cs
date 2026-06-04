using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using FolvestAPI.Data;

namespace FolvestAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AdminController(AppDbContext context)
        {
            _context = context;
        }

        // GET /api/admin/users
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Include(u => u.Portfolio)
                    .ThenInclude(p => p.Transactions)
                .Select(u => new
                {
                    u.Id,
                    u.Email,
                    u.Role,
                    Portfolio = u.Portfolio == null ? null : new
                    {
                        u.Portfolio.Id,
                        u.Portfolio.Balance,
                        Transactions = u.Portfolio.Transactions.Select(t => new
                        {
                            t.Id,
                            t.Symbol,
                            t.Type,
                            t.Quantity,
                            t.PriceAtPurchase,
                            t.CreatedAt
                        })
                    }
                })
                .ToListAsync();

            return Ok(users);
        }
    }
}

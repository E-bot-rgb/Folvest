using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FolvestAPI.Data;
using System.Text.Json;

namespace FolvestAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class StockController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly HttpClient _httpClient;
        private readonly AppDbContext _context;

        public StockController(IConfiguration config, IHttpClientFactory httpClientFactory, AppDbContext context)
        {
            _config = config;
            _httpClient = httpClientFactory.CreateClient();
            _context = context;
        }

        // GET /api/stock/{symbol}
        [HttpGet("{symbol}")]
        public async Task<IActionResult> GetStock(string symbol)
        {
            var apiKey = _config["AlphaVantage:ApiKey"];
            var url = $"https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={apiKey}";

            var response = await _httpClient.GetAsync(url);

            if (!response.IsSuccessStatusCode)
                return StatusCode(500, "Failed to fetch stock data.");

            var json = await response.Content.ReadAsStringAsync();
            var doc = JsonDocument.Parse(json);

            if (!doc.RootElement.TryGetProperty("Global Quote", out var quote))
                return NotFound("Stock not found.");

            var result = new
            {
                symbol = quote.GetProperty("01. symbol").GetString(),
                price = quote.GetProperty("05. price").GetString(),
                change = quote.GetProperty("09. change").GetString(),
                changePercent = quote.GetProperty("10. change percent").GetString(),
                volume = quote.GetProperty("06. volume").GetString()
            };

            return Ok(result);
        }

        // GET /api/stock — hämta alla aktier från databasen
        [HttpGet]
        public async Task<IActionResult> GetAllStocks()
        {
            var stocks = _context.Stocks.ToList();
            return Ok(stocks);
        }
    }
}

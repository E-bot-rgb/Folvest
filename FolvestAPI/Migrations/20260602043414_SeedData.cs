using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace FolvestAPI.Migrations
{
    /// <inheritdoc />
    public partial class SeedData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Stocks",
                columns: new[] { "Id", "CurrentPrice", "Name", "Symbol" },
                values: new object[,]
                {
                    { 1, 189.50m, "Apple Inc.", "AAPL" },
                    { 2, 415.20m, "Microsoft Corp.", "MSFT" },
                    { 3, 175.80m, "Alphabet Inc.", "GOOGL" },
                    { 4, 245.30m, "Tesla Inc.", "TSLA" }
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Email", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { 1, "admin@folvest.com", "$2a$11$zReuUW9PM.Mp05ZTrTMKMO5dXcEGgoBpk1/f6py0j2n4QSs14QH1a", "Admin" },
                    { 2, "user@folvest.com", "$2a$11$/JATdjm8TDzw72XNnrXnEulAlhnpsXyjYWojs0LPg0Pm59lJpCD2u", "User" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Stocks",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Stocks",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "Stocks",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "Stocks",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2);
        }
    }
}

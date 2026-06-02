using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace FolvestAPI.Migrations
{
    /// <inheritdoc />
    public partial class SeedData2 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$bXcQH.5OqF9JCNn3dzlAVeecjp7NAlewzHpqaIEsqMmyYB7bMc.ra");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$XDIgR.aY70TJD0TAAD8dnuQ7GqSZ6oW53F/VWQ37.XOlpNYmi7Ch6");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 1,
                column: "PasswordHash",
                value: "$2a$11$zReuUW9PM.Mp05ZTrTMKMO5dXcEGgoBpk1/f6py0j2n4QSs14QH1a");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: 2,
                column: "PasswordHash",
                value: "$2a$11$/JATdjm8TDzw72XNnrXnEulAlhnpsXyjYWojs0LPg0Pm59lJpCD2u");
        }
    }
}

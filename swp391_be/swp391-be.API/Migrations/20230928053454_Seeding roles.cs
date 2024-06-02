using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace swp391_be.API.Migrations
{
    /// <inheritdoc />
    public partial class Seedingroles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "AspNetRoles",
                columns: new[] { "Id", "ConcurrencyStamp", "Name", "NormalizedName" },
                values: new object[,]
                {
                    { "5849968f-0561-41b5-a8de-3fe1966344a9", "member", "Member", "MEMBER" },
                    { "b2fd82de-54b7-41dd-893f-429b49b4d457", "admin", "Admin", "ADMIN" },
                    { "c49f26d6-ef12-46bc-a746-0d4187274688", "staff", "Staff", "STAFF" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "5849968f-0561-41b5-a8de-3fe1966344a9");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "b2fd82de-54b7-41dd-893f-429b49b4d457");

            migrationBuilder.DeleteData(
                table: "AspNetRoles",
                keyColumn: "Id",
                keyValue: "c49f26d6-ef12-46bc-a746-0d4187274688");
        }
    }
}

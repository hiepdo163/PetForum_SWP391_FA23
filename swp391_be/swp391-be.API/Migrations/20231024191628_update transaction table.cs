using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace swp391_be.API.Migrations
{
    /// <inheritdoc />
    public partial class updatetransactiontable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Transaction_AspNetUsers_BuyerId",
                table: "Transaction");

            migrationBuilder.DropForeignKey(
                name: "FK_Transaction_Vouchers_VoucherId",
                table: "Transaction");

            migrationBuilder.DropTable(
                name: "Vouchers");

            migrationBuilder.DropIndex(
                name: "IX_Transaction_BuyerId",
                table: "Transaction");

            migrationBuilder.DropIndex(
                name: "IX_Transaction_VoucherId",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "BuyerId",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "VoucherId",
                table: "Transaction");

            migrationBuilder.RenameColumn(
                name: "Score",
                table: "AspNetUsers",
                newName: "RemainingPostUploadQuantity");

            migrationBuilder.AddColumn<bool>(
                name: "IsSold",
                table: "Transaction",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "ForumScore",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "MemberShipScore",
                table: "AspNetUsers",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "MemberShip_Transactions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Level = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedDate = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MemberShip_Transactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MemberShip_Transactions_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_MemberShip_Transactions_UserId",
                table: "MemberShip_Transactions",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "MemberShip_Transactions");

            migrationBuilder.DropColumn(
                name: "IsSold",
                table: "Transaction");

            migrationBuilder.DropColumn(
                name: "ForumScore",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "MemberShipScore",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "RemainingPostUploadQuantity",
                table: "AspNetUsers",
                newName: "Score");

            migrationBuilder.AddColumn<string>(
                name: "BuyerId",
                table: "Transaction",
                type: "nvarchar(450)",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "VoucherId",
                table: "Transaction",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Vouchers",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Code = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Discount = table.Column<double>(type: "float", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Vouchers", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Transaction_BuyerId",
                table: "Transaction",
                column: "BuyerId");

            migrationBuilder.CreateIndex(
                name: "IX_Transaction_VoucherId",
                table: "Transaction",
                column: "VoucherId",
                unique: true,
                filter: "[VoucherId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Transaction_AspNetUsers_BuyerId",
                table: "Transaction",
                column: "BuyerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Transaction_Vouchers_VoucherId",
                table: "Transaction",
                column: "VoucherId",
                principalTable: "Vouchers",
                principalColumn: "Id");
        }
    }
}

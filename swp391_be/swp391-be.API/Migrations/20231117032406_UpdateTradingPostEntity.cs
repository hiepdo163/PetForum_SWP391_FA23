using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace swp391_be.API.Migrations
{
    /// <inheritdoc />
    public partial class UpdateTradingPostEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Transaction");
            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "TradingPosts",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsSold",
                table: "TradingPosts",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "TransactionDate",
                table: "TradingPosts",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TradingPosts_AspNetUsers_UserId",
                table: "TradingPosts",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_TradingPosts_AspNetUsers_UserId",
                table: "TradingPosts");

            migrationBuilder.DropTable(
                name: "TPost_Transaction");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "TradingPosts",
                newName: "SellerId");

            migrationBuilder.RenameIndex(
                name: "IX_TradingPosts_UserId",
                table: "TradingPosts",
                newName: "IX_TradingPosts_SellerId");

            migrationBuilder.AddColumn<Guid>(
                name: "TradingPostId",
                table: "TradingPosts",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateIndex(
                name: "IX_TradingPosts_TradingPostId",
                table: "TradingPosts",
                column: "TradingPostId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_TradingPosts_AspNetUsers_SellerId",
                table: "TradingPosts",
                column: "SellerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_TradingPosts_TradingPosts_TradingPostId",
                table: "TradingPosts",
                column: "TradingPostId",
                principalTable: "TradingPosts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.CreateTable(
                name: "TPost_Transaction",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TradingPostId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SellerId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    IsSold = table.Column<bool>(type: "bit", nullable: false),
                    TransactionDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TPost_Transaction", x => x.Id);
                    table.ForeignKey(
                        name: "FK_TPost_Transaction_AspNetUsers_SellerId",
                        column: x => x.SellerId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_TPost_Transaction_TradingPosts_TradingPostId",
                        column: x => x.TradingPostId,
                        principalTable: "TradingPosts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TPost_Transaction_SellerId",
                table: "TPost_Transaction",
                column: "SellerId");

            migrationBuilder.CreateIndex(
                name: "IX_TPost_Transaction_TradingPostId",
                table: "TPost_Transaction",
                column: "TradingPostId",
                unique: true);
        }
    }
}

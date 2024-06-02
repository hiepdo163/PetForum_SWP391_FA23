using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace swp391_be.API.Migrations
{
    /// <inheritdoc />
    public partial class ChangeNameOfTransactionDate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "TransactionDate",
                table: "TradingPosts",
                newName: "CheckDate");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "TPost_Transaction",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SellerId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    TradingPostId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
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

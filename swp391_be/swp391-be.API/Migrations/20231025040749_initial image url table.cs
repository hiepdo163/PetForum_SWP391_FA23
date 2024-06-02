using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace swp391_be.API.Migrations
{
    /// <inheritdoc />
    public partial class initialimageurltable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Trading_Post_ImageUrls",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TradingPostId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Url = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Trading_Post_ImageUrls", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Trading_Post_ImageUrls_TradingPosts_TradingPostId",
                        column: x => x.TradingPostId,
                        principalTable: "TradingPosts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Trading_Post_ImageUrls_TradingPostId",
                table: "Trading_Post_ImageUrls",
                column: "TradingPostId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Trading_Post_ImageUrls");
        }
    }
}

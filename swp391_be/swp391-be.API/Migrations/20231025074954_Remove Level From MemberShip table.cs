using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace swp391_be.API.Migrations
{
    /// <inheritdoc />
    public partial class RemoveLevelFromMemberShiptable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Level",
                table: "MemberShip_Transactions");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Level",
                table: "MemberShip_Transactions",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}

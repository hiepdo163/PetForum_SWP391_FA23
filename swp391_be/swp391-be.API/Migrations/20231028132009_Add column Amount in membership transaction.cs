using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace swp391_be.API.Migrations
{
    /// <inheritdoc />
    public partial class AddcolumnAmountinmembershiptransaction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Amount",
                table: "MemberShip_Transactions",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Amount",
                table: "MemberShip_Transactions");
        }
    }
}

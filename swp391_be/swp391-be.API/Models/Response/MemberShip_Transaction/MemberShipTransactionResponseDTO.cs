using System.ComponentModel.DataAnnotations.Schema;

namespace swp391_be.API.Models.Response.MemberShip_Transaction
{
    public class MemberShipTransactionResponseDTO
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string UserId { get; set; }
        public int Amount { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace swp391_be.API.Models.Domain
{
    public class MemberShip_Transaction
    {
        [Key]
        public Guid Id { get; set; }
        [ForeignKey("UserId")]
        public string UserId { get; set; }
        public User User { get; set; }
        public int Amount { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace swp391_be.API.Models.Domain
{
    public class Report
    {
        [Key]
        public Guid Id { get; set; }

        [ForeignKey("PostId")]
        public Guid PostId { get; set; }
        public Post Post { get; set; }

        public Boolean IsProcessing { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public string Reason { get; set; }

        [ForeignKey("UserId")]
        public string UserId { get; set; }
        public User User { get; set; }

        public DateTime? ProcessDate { get; set; }
        public int IsApproved { get; set; } = -1;
    }
}

using System.ComponentModel.DataAnnotations.Schema;

namespace swp391_be.API.Models.Domain
{
    public class Vote
    {
        [ForeignKey("UserId")]
        public string UserId { get; set; }
        [ForeignKey("PostId")]
        public Guid PostId { get; set; }

        public User User { get; set; }
        public Post Post { get; set; }
    }
}

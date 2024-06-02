using System.ComponentModel.DataAnnotations.Schema;

namespace swp391_be.API.Models.Request.Vote
{
    public class VoteDTO
    {
        public string UserId { get; set; }
        public Guid PostId { get; set; }
    }
}

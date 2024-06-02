using Microsoft.AspNetCore.Identity;
using System.ComponentModel.DataAnnotations;

namespace swp391_be.API.Models.Domain
{
    public class User:IdentityUser
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public Boolean? Gender { get; set; }
        public string? Bio {  get; set; }
        public int ForumScore { get; set; }
        public int MemberShipScore { get; set; }
        public int RemainingPostUploadQuantity { get; set; } = 0;
        public String? ImageUrl { get; set; } = null;
        public bool IsBanned { get; set; } = false;
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public ICollection<Vote> Votes { get; set; }
        public ICollection<Report> Reports { get; set; }
        public ICollection<Post> Posts { get; set; }
        public ICollection<Comment> Comments { get; set; }
        public ICollection<TradingPost> TradingPosts { get; set; }
        public ICollection<MemberShip_Transaction> Memberships { get; set; }
        public ICollection<Feedback> Feedbacks { get; set; }
    }
}

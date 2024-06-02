using Microsoft.EntityFrameworkCore;
using swp391_be.API.Models.Enum;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace swp391_be.API.Models.Domain
{
    public class TradingPost
    {
        [Key]
        public Guid Id { get; set; }
        [ForeignKey("CategoryId")]
        public Guid CategoryId { get; set; }
        public Category Category { get; set; }
        [ForeignKey("UserId")]
        public string UserId { get; set; }
        public User User { get; set; }
        public string Title { get; set; }
        public PetAge Age { get; set; }
        public string Location { get; set; }
        public Double Price { get; set; }
        public string Description { get; set; }
        public DateTime? PublicDate { get; set; }
        public bool IsFree { get; set; }
        public bool IsAccepted { get; set; }
        public bool IsSold { get; set; }
        public DateTime? CheckDate { get; set; }
        public ICollection<TPost_ImageUrl> ImageUrls { get; set; }
    }
}

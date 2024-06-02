
using swp391_be.API.Models.Enum;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace swp391_be.API.Models.Domain
{
    public class Feedback
    {
        public Guid Id { get; set; }

        [Required]
        public string Content { get; set; }

        [Required]
        [Range(1, 5, ErrorMessage = "Stars must be between 1 and 5.")]
        public int Stars { get; set; }

        [Required]
        public string UserId { get; set; }

        [Required]
        public string TargetUserId { get; set; }

        public string PhotoUrl { get; set; }

        public User TargetUser { get; set; }

        public User User { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;

namespace swp391_be.API.Models.Request.Feedback
{
    public class FeedbackRequestDTO
    {
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
    }
}

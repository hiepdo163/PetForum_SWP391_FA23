using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace swp391_be.API.Models.Domain
{
    public class Post
    {
        [Key]
        public Guid Id { get; set; }

        [ForeignKey("UserId")]
        public string UserId { get; set; }//
        public User User { get; set; }

        [ForeignKey("CategoryId")]
        public Guid CategoryId { get; set; }//
        public Category Category { get; set; }

        public string Title { get; set; }//
        public string Content { get; set; }//
        public string Summary { get; set; }//
        public DateTime PublishedDate { get; set; } = DateTime.Now;//
        public bool IsPublished { get; set; } = true;

        public ICollection<Vote> Votes { get; set;}
        public ICollection<Comment> Comments { get; set; }
        public ICollection<Report> Reports { get; set; }
    }
}

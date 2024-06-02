using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace swp391_be.API.Models.Domain
{
    public class Comment
    {
        [Key]
        public Guid Id { get; set; }
        [ForeignKey("UserId")]
        public String UserId { get;set; }
        public User User { get; set; }
        [ForeignKey("PostId")]
        public Guid PostId { get; set; }
        public Post Post { get; set; }
        [ForeignKey("ParentId")]
        public Guid? ParentId { get;set; }
        public Comment? ParentComment { get; set; }
        public string content { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public Boolean IsEdited { get; set; } = false;
        public ICollection<Comment> ChildComments { get; set;}
    }
}

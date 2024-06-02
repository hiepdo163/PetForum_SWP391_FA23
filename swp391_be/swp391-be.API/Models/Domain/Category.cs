using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace swp391_be.API.Models.Domain
{
    public class Category
    {
        [Key]
        public Guid Id { get; set; }
        [ForeignKey("ParentId")]
        public Guid? ParentId { get; set; }
        public Category? ParentCategory { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public ICollection<Post> Posts { get; set; }
        public ICollection<TradingPost> TradingPosts { get; set; }
        public ICollection<Category> ChildCategories { get; set; }
    }
}

namespace swp391_be.API.Models.Response.Post
{
    public class ResponsePostPreviewDTO
    {
        public UserModel User { get; set; }
        public PostModel Post { get; set; }
        public CategoryModel Category { get; set; }
        public ReactionModel Reaction { get; set; }
    }
    public class UserModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string? ImgUrl { get; set; }
        public string Role { get; set; }
    }

    public class TopContributorsModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string? ImgUrl { get; set; }
        public int Amount { get; set; }
        public string Role { get; set; }
    }

    public class CommunityStaffModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string? ImgUrl { get; set; }
        public int Amount { get; set; }
        public string Role { get; set; }
    }

    public class PostModel
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime Date { get; set; }
    }

    public class CategoryModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid? ParentId { get; set; }
        public string? ParentName { get; set; }
    }

    public class ReactionModel
    {
        public int Vote { get; set; }
        public int Comment { get; set; }
    }
}

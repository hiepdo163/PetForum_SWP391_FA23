using swp391_be.API.Models.Domain;

namespace swp391_be.API.Models.Response.Post
{
    public class ResponseTradingPostDTO
    {
        public TradingUserModel User { get; set; }
        public TradingPostModel Post { get; set; }
        public TradingCategoryModel Category { get; set; }
    }

    public class TradingUserModel
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string? ImgUrl { get; set; }
        public string Role { get; set; }
    }

    public class TradingPostModel
    {
        public Guid Id { get; set; }
        public string Title { get; set; }
        public int Age { get; set; }
        public string Location { get; set; }
        public Double Price { get; set; }
        public string Description { get; set; }
        public DateTime? Date { get; set; }
        public bool IsFree { get; set; }
        public string ImageUrls {  get; set; }
    }

    public class TradingCategoryModel
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public Guid? ParentId { get; set; }
    }

}

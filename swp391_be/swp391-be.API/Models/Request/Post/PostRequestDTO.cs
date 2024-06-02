namespace swp391_be.API.Models.Request.Post
{
    public class PostRequestDTO
    {
        public string UserId { get; set; }//
        public string Title { get; set; }//
        public string Content { get; set; }//
        public Guid CategoryId { get; set; }//
    }
}

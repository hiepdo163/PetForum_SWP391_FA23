namespace swp391_be.API.Models.Request.Post
{
    public class PostUpdateDTO
    {
        public Guid Id { get; set; }
        public string? Title { get; set; }//
        public string? Content { get; set; }//
        public Guid Category {  get; set; }
    }
}

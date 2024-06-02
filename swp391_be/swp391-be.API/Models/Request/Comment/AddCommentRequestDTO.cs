namespace swp391_be.API.Models.Request.Comment
{
    public class AddCommentRequestDTO
    {
        public String UserId { get; set; }
        public Guid PostId { get; set; }
        public Guid? ParentId { get; set; }
        public string content { get; set; }
    }
}

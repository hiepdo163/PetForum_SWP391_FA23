namespace swp391_be.API.Models.Response.Category
{
    public class ChildCategoryResponseDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public Guid? ParentId { get; set; }
        public string? ParentName { get; set; }
    }
}

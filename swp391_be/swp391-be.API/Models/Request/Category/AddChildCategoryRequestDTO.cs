namespace swp391_be.API.Models.Request.Category
{
    public class AddChildCategoryRequestDTO
    {
        public Guid ParentId { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}

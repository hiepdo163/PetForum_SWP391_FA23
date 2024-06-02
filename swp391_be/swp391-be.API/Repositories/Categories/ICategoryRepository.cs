using swp391_be.API.Models.Domain;
using swp391_be.API.Models.Response.Category;

namespace swp391_be.API.Repositories.Categories
{
    public interface ICategoryRepository
    {
        public Task<List<CategoryResponseDTO>> GetCategory();
        public Task<List<CategoryResponseDTO>> GetOnlyMainCategory();
        public Task<List<ChildCategoryResponseDTO>> GetChildCategory(Guid id);

        public Task<Category?> AddCategory(Category category);

        public Task<Category?> DeleteChildCategory(Guid id);
        public Task<Category?> DeleteMainCategory(Guid id);

    }
}

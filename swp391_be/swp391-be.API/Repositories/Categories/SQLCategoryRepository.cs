using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using swp391_be.API.Data;
using swp391_be.API.Models.Domain;
using swp391_be.API.Models.Response.Category;

namespace swp391_be.API.Repositories.Categories
{
    public class SQLCategoryRepository : ICategoryRepository
    {
        private readonly DBUtils _dBUtils;

        public SQLCategoryRepository(DBUtils _dBUtils)
        {
            this._dBUtils = _dBUtils;
        }

        public async Task<Category?> AddCategory(Category category)
        {
            try
            {
                var result = await _dBUtils.Categories.AddAsync(category);
                await _dBUtils.SaveChangesAsync();

                return result.Entity;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<Category?> DeleteChildCategory(Guid id)
        {
            var existingCategory = await _dBUtils.Categories.FirstOrDefaultAsync(x => x.ParentId != null && x.Id == id);

            if(existingCategory != null)
            {
                _dBUtils.Categories.Remove(existingCategory);
                await _dBUtils.SaveChangesAsync(); 
            }

            return existingCategory;
        }

        public async Task<Category?> DeleteMainCategory(Guid id)
        {
            var existingCategory = await _dBUtils.Categories.FirstOrDefaultAsync(x => x.Id == id);

            if (existingCategory == null)
            {
                return null;
            }

            var existingChildCategory = await _dBUtils.Categories.Where(x => x.ParentId == id).Include(x => x.ChildCategories).ToListAsync();

            if(existingChildCategory.Count > 0)
            {
                _dBUtils.Categories.RemoveRange(existingChildCategory);
                _dBUtils.Categories.Remove(existingCategory);
            }
            else
            {
                _dBUtils.Categories.Remove(existingCategory);
            }

            await _dBUtils.SaveChangesAsync();

            return existingCategory;
        }

        public async Task<List<CategoryResponseDTO>> GetCategory()
        {
            return await _dBUtils.Categories
                    .Include(x => x.ChildCategories)
                    .Where(x => x.ParentId == null && x.ChildCategories.Count > 0)
                    .Select(x => new CategoryResponseDTO
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Description = x.Description,
                    })
                    .ToListAsync();
        }

        public async Task<List<CategoryResponseDTO>> GetOnlyMainCategory()
        {
            return await _dBUtils.Categories
                    .Include(x => x.ParentCategory)
                    .Where(x => x.ParentId == null)
                    .Select(x => new CategoryResponseDTO
                    {
                        Id = x.Id,
                        Name = x.Name,
                        Description = x.Description,
                    })
                    .ToListAsync();
        }

        public async Task<List<ChildCategoryResponseDTO>> GetChildCategory(Guid id)
        {
            return await _dBUtils.Categories
                     .Where(x => x.ParentId == id)
                     .Include(x => x.ParentCategory)
                     .Select(x => new ChildCategoryResponseDTO
                     {
                         Id = x.Id,
                         Name = x.Name,
                         ParentId = x.ParentId,
                         ParentName = x.ParentCategory.Name,
                         Description = x.Description,
                     })
                     .ToListAsync();
        }

        
    }
}

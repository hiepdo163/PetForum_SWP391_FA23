using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using swp391_be.API.Data;
using swp391_be.API.Models.Domain;
using swp391_be.API.Models.Enum;
using swp391_be.API.Models.Request.Category;
using swp391_be.API.Repositories.Categories;
using swp391_be.API.Repositories.Comments;
using swp391_be.API.Services.Name;

namespace swp391_be.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoryController : ControllerBase
    {
        private readonly IMapper _mapper;
        private readonly ICategoryRepository _categoryRepository;

        public CategoryController(IMapper _mapper, ICategoryRepository _categoryRepository)
        {
            this._mapper = _mapper;
            this._categoryRepository = _categoryRepository;
        }
        [HttpGet]
        [Route("main category only")]
        public async Task<IActionResult> GetMainCateGoryList()
        {
            var result = await _categoryRepository.GetOnlyMainCategory();

            if (result == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] { "Category is empty" }
                });
            }

            return Ok(result);
        }
        [HttpGet]
        [Route("main")]
        public async Task<IActionResult> GetMainCategoryList()
        {
            var result = await _categoryRepository.GetCategory();

            if(result == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] {"Category is empty"}
                });
            }

            return Ok(result);
        }

        [HttpGet]
        [Route("child/{id:Guid}")]
        public async Task<IActionResult> GetMainCateGoryList([FromRoute] Guid id)
        {
            var result = await _categoryRepository.GetChildCategory(id);

            if (result == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] { "This Category doesn't have child" }
                });
            }

            return Ok(result);
        }

        [HttpPost]
        [Route("main")]
        public async Task<IActionResult> AddMainCategory([FromBody] AddCategoryRequestDTO req)
        {
            if(string.IsNullOrEmpty(req.Name) || string.IsNullOrEmpty(req.Description))
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] {"Name or Description can't be empty"}
                });
            }

            var categoryDomainModel = _mapper.Map<Category>(req);

            var result = await _categoryRepository.AddCategory(categoryDomainModel);

            if(result == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] { "Failed to add this category into db" }
                });
            }

            return Ok(result);
        }

        [HttpPost]
        [Route("child/{id:Guid}")]
        public async Task<IActionResult> AddChildCateGoryList([FromRoute] Guid id, [FromBody] AddCategoryRequestDTO req)
        {
            if (string.IsNullOrEmpty(req.Name) || string.IsNullOrEmpty(req.Description))
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] { "Name or Description can't be empty" }
                });
            }

            var categoryDomainModel = _mapper.Map<Category>(req);

            if(categoryDomainModel.ParentId == null)
            {
                categoryDomainModel.ParentId = id;
            }

            var result = await _categoryRepository.AddCategory(categoryDomainModel);

            if (result == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] { "Failed to add this category into db" }
                });
            }

            return Ok(result);
        }

        [HttpDelete]
        [Route("child/{id:Guid}")]
        public async Task<IActionResult> DeleteChildCategory([FromRoute] Guid id)
        {
            var deleteResult = await _categoryRepository.DeleteChildCategory(id);

            if(deleteResult == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] {"Failed to delete category because id doesn't exist"}
                });
            }

            return Ok(deleteResult);
        }

        [HttpDelete]
        [Route("main/{id:Guid}")]
        public async Task<IActionResult> DeleteMainCategory([FromRoute] Guid id)
        {
            var deleteResult = await _categoryRepository.DeleteMainCategory(id);

            if (deleteResult == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] { "Failed to delete category because id doesn't exist" }
                });
            }

            return Ok(deleteResult);
        }
    }
}

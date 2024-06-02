using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using swp391_be.API.Data;
using swp391_be.API.Models.Domain;
using swp391_be.API.Models.Enum;
using swp391_be.API.Models.Request.Comment;
using swp391_be.API.Repositories.Comments;
using swp391_be.API.Services.Name;
using System.Xml.Linq;

namespace swp391_be.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly DBUtils _dBUtils;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly ICommentRepository _commentRepository;
        private readonly INameService _nameService;
        public CommentController(DBUtils _dBUtils, UserManager<User> _userManager
            , IMapper _mapper, ICommentRepository _commentRepository
            , INameService _nameService)
        {
            this._dBUtils = _dBUtils;
            this._userManager = _userManager;
            this._mapper = _mapper;
            this._commentRepository = _commentRepository;
            this._nameService = _nameService;
        }

        [HttpPost]
        [Route("create")]
        [Authorize]
        public async Task<IActionResult> CreateComment([FromBody] AddCommentRequestDTO req)
        {
            if (req.content == null)
            {
                return BadRequest(new
                {
                    succeed = false,
                    errors = new[] { "Content can't be null" }
                });
            }

            var identityUser = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == req.UserId);

            if (identityUser == null)
            {
                return BadRequest(new
                {
                    succeed = false,
                    errors = new[] { "This user doesn't exist" }
                });
            }

            var identityPost = await _dBUtils.Post.FirstOrDefaultAsync(x => x.Id == req.PostId);

            if (identityPost == null)
            {
                return BadRequest(new
                {
                    succeed = false,
                    errors = new[] { "This post doesn't exist" }
                });
            }

            if (!string.IsNullOrEmpty(req.ParentId.ToString()))
            {
                var identityComment = await _dBUtils.Comments.FirstOrDefaultAsync(x => x.Id == req.ParentId);
                if (identityComment == null)
                {
                    return BadRequest(new
                    {
                        succeed = false,
                        errors = new[] { "The comment you have reply doesn't exist" }
                    });
                }
            }

            var commentDomainModel = _mapper.Map<Comment>(req);
            var result = await _commentRepository.CreateAsync(commentDomainModel);

            if (result == null)
            {
                return BadRequest(new
                {
                    succeed = false,
                    errors = new[] { "Somethings happen when store into database" }
                });
            }

            return Ok(new
            {
                succeed = true,
                errors = ""
            });
        }

        [HttpPost]
        [Route("update")]
        
        public async Task<IActionResult> EditComment([FromBody] UpdateCommentRequestDTO req)
        {
            var identityComment = await _dBUtils.Comments.FirstOrDefaultAsync(x => x.Id == req.Id);

            if (identityComment == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] { "This Comment Doesn't Exist" }
                });
            }

            if (string.IsNullOrEmpty(req.content))
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] { "Your content is null" }
                });
            }

            bool isChange = string.IsNullOrEmpty(req.content);
            var result = await _dBUtils.Comments
                                     .Where(x => x.Id == req.Id)
                                     .ExecuteUpdateAsync(property =>
                                         property.SetProperty(e => e.content, e => (isChange)
                                                     ? e.content
                                                     : req.content)
                                                 .SetProperty(e => e.CreatedDate, e => (isChange)
                                                     ? e.CreatedDate
                                                     : DateTime.Now)
                                                 .SetProperty(e => e.IsEdited, e => (isChange)
                                                     ? e.IsEdited
                                                     : true));

            if (result == 0)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] { "Failed to set new value in database" }
                });
            }

            return Ok(new
            {
                succeeded = true,
                errors = ""
            });

        }

        [HttpDelete]
        [Route("delete/{id:Guid}")]
        
        public async Task<IActionResult> DeleteComment([FromRoute] Guid id)
        {
            var commentDomainModel = await _dBUtils.Comments.Include(comment => comment.ChildComments).FirstOrDefaultAsync(x => x.Id == id);

            if (commentDomainModel == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] { "This comment doesn't exist" }
                });
            }

            var result = await _commentRepository.DeleteAsync(commentDomainModel);

            //if (result == null)
            //{
            //    return BadRequest(new
            //    {
            //        succeeded = false,
            //        errors = new[] { "Failed to remove from database" }
            //    });
            //}

            return Ok(new
            {
                succeeded = true,
                errors = ""
            });
        }

        [HttpGet]
        [Route("{id:Guid}/{page:int}")]
        public async Task<IActionResult> GetListOfComment([FromRoute] Guid id, [FromRoute] int page)
        {
            var skipResult = (page - 1) * PageSize.Default;

            var commentList = await _dBUtils.Comments
                                        .Where(c => c.PostId == id && c.ParentId == null)
                                        .OrderByDescending(c => c.CreatedDate)
                                        .Skip(skipResult)
                                        .Take(PageSize.Default)
                                        .Select(x => new
                                        {
                                            id = x.Id,
                                            user = new
                                            {
                                                Id = x.User.Id,
                                                Name = _nameService.ConvertName(x.User.FirstName + " " + x.User.LastName),
                                                ImgUrl = x.User.ImageUrl,
                                            },
                                            Comment = new
                                            {
                                                content = x.content,
                                                CreatedDate = x.CreatedDate,
                                                IsEdited = x.IsEdited
                                            },
                                            ChildrenComment = x.ChildComments
                                                                .Select(y => new
                                                                {
                                                                    id = y.Id,
                                                                    user = new
                                                                    {
                                                                        Id = y.User.Id,
                                                                        Name = _nameService.ConvertName(y.User.FirstName + " " + y.User.LastName),
                                                                        ImgUrl = y.User.ImageUrl,
                                                                    },
                                                                    content = y.content,
                                                                    CreatedDate = y.CreatedDate,
                                                                    IsEdited = y.IsEdited
                                                                })
                                        })
                                        .ToListAsync();

            if (commentList == null)
            {
                return Ok(new
                {
                    succeeded = true,
                    errors = new[] { "This post have no comment" }
                });
            }

            return Ok(commentList);
        }

        [HttpGet]
        [Route("{id:Guid}")]
        public async Task<IActionResult> GetNumberOfComment([FromRoute] Guid id)
        {
            var count = await _dBUtils.Comments.CountAsync(x => x.PostId == id && x.ParentId == null);
            return Ok(count);
        }
    }
}

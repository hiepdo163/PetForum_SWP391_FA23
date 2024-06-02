using System;
using System.Collections;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Security.Policy;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Hosting;
using Microsoft.VisualBasic;
using Newtonsoft.Json.Linq;
using swp391_be.API.Data;
using swp391_be.API.Models.Domain;
using swp391_be.API.Models.Request.Post;
using swp391_be.API.Models.Response.Category;
using swp391_be.API.Models.Response.Post;
using swp391_be.API.Repositories.Comments;
using swp391_be.API.Services.Name;
using static System.Collections.Specialized.BitVector32;

namespace swp391_be.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController : ControllerBase
    {
        private readonly DBUtils _context;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly INameService _nameService;
        private readonly ICommentRepository _commentRepository;

        public PostController(DBUtils context, UserManager<User> _userManager, IMapper _mapper, INameService _nameService, ICommentRepository _commentRepository)
        {
            _context = context;
            this._userManager = _userManager;
            this._mapper = _mapper;
            this._nameService = _nameService;
            this._commentRepository = _commentRepository;
        }

        // SEARCH
        [HttpGet]
        [Route("{postId:Guid}")]
        public async Task<IActionResult> GetPost([FromRoute] Guid postId)
        {
            var result = await _context.Post
               .Where(x => x.Id == postId)
               .Include(x => x.Category.ParentCategory)
               .Select(x => new
               {
                   User = new
                   {
                       Id = x.UserId,
                       Name = _nameService.ConvertName(x.User.FirstName + " " + x.User.LastName),
                       ImgUrl = x.User.ImageUrl,
                   },
                   Post = new
                   {
                       Id = x.Id,
                       Title = x.Title,
                       Content = x.Content,
                       Date = x.PublishedDate,
                   },
                   Category = new
                   {
                       Id = x.CategoryId,
                       Name = x.Category.Name,
                       ParentId = x.Category.ParentId,
                       ParentName = x.Category.ParentCategory.Name,
                   },
                   Reaction = new
                   {
                       Vote = x.Votes.Count,
                       Comment = x.Comments.Count
                   },
                   ReactionUser = new
                   {
                       users = x.Votes.Select(x => x.UserId).ToList()
                   }
               })
               .FirstOrDefaultAsync();
            return Ok(result);
        }

        [HttpGet]
        public async Task<IActionResult> GetPostPreview(
            Guid? categoryId = null,
            int page = 1,
            int pageSize = 10,
            string sortOrder = "desc")  
        {
            var query = _context.Post
                .Include(x => x.Votes)
                .Include(x => x.User)
                .Include(x => x.Category.ParentCategory)
                .Include(y => y.Category)
                .Include(z => z.Comments)
                .Where(p => p.IsPublished);

            if (categoryId.HasValue)
            {
                query = query.Where(p => p.CategoryId == categoryId || p.Category.ParentId == categoryId);
            }

            query = sortOrder.ToLower() == "asc" ?
                query.OrderBy(x => x.PublishedDate) :
                query.OrderByDescending(x => x.PublishedDate);

            var totalPosts = await query.CountAsync();

            var posts = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var totalPages = (int)Math.Ceiling((double)totalPosts / pageSize);

            var result = new
            {
                TotalPosts = totalPosts,
                TotalPages = totalPages,
                CurrentPage = page,
                PageSize = pageSize,
                Posts = posts.Select(x => new ResponsePostPreviewDTO
                {
                    User = new UserModel
                    {
                        Id = x.UserId,
                        Name = _nameService.ConvertName(x.User.FirstName + " " + x.User.LastName),
                        ImgUrl = x.User.ImageUrl,
                        Role = _userManager.GetRolesAsync(x.User).Result[0]
                    },
                    Post = new PostModel
                    {
                        Id = x.Id,
                        Title = x.Title,
                        Content = x.Summary,  
                        Date = x.PublishedDate,
                    },
                    Category = new CategoryModel
                    {
                        Id = x.CategoryId,
                        Name = x.Category.Name,
                        ParentId = x.Category.ParentId,
                        ParentName = x.Category.ParentCategory.Name
                    },
                    Reaction = new ReactionModel
                    {
                        Vote = x.Votes.Count,
                        Comment = x.Comments.Count
                    }
                }).ToList()
            };

            return Ok(result);
        }


        [HttpGet]
        [Route("related-thread/{id:Guid}")]
        public async Task<IActionResult> GetRelatedThreads([FromRoute] Guid id)
        {
            try
            {
                var existingCategory = await _context.Post.Where(x => x.Id == id).Select(x => x.CategoryId).FirstOrDefaultAsync();
                var posts = await _context.Post
                    .Include(x => x.User)
                    .Include(x => x.Votes)
                    .Include(x => x.Category)
                    .Include(x => x.Category.ParentCategory)
                    .Include(x => x.Comments)
                    .Where(x => x.CategoryId == existingCategory && x.Id != id).ToListAsync();

                var result = posts.Select(x => new
                {
                    User = new
                    {
                        Id = x.UserId,
                        Name = _nameService.ConvertName(x.User.FirstName + " " + x.User.LastName),
                        ImgUrl = x.User.ImageUrl,
                    },
                    Post = new
                    {
                        Id = x.Id,
                        Title = x.Title,
                        Content = x.Content,
                        Date = x.PublishedDate,
                    },
                    Category = new
                    {
                        Id = x.CategoryId,
                        Name = x.Category.Name,
                        ParentId = x.Category.ParentId,
                        ParentName = x.Category.ParentCategory.Name,
                    },
                    Reaction = new
                    {
                        Vote = x.Votes.Count,
                        Comment = x.Comments.Count
                    }
                });

                return Ok(result);
            }
            catch (Exception ex)
            {
                return BadRequest("cook");
            }

        }

        [HttpGet]
        [Route("hook-content")]
        public async Task<IActionResult> Get()
        {
            var allUsers = await _context.Users.Include(user => user.Comments).ToListAsync();

            var topContributors = allUsers
              .Where(u => u.Comments != null)
              .OrderByDescending(u => u.Comments.Count)
              .Select(x => new TopContributorsModel
              {
                  Id = x.Id,
                  Name = x.FirstName + " " + x.LastName,
                  ImgUrl = x.ImageUrl,
                  Amount = x.Comments.Count,
                  Role = _userManager.GetRolesAsync(x).Result[0]
              })
              .Take(3)
              .ToList();

            var communityStaff = allUsers
                .Where(u => u.Comments != null && _userManager.IsInRoleAsync(u, "Staff").Result)
                .OrderByDescending(u => u.Comments.Count)
                .Take(3)
                .Select(x => new CommunityStaffModel
                {
                    Id = x.Id,
                    Name = _nameService.ConvertName(x.FirstName + " " + x.LastName),
                    ImgUrl = x.ImageUrl,
                    Amount = x.Comments.Count,
                    Role = _userManager.GetRolesAsync(x).Result[0]
                })
                .ToList();

            var mostDiscussionCategory = await GetMostDicussionCategory();

            return Ok(new
            {
                TopContributors = topContributors,
                CommunityStaff = communityStaff,
                MostDiscussionCategories = mostDiscussionCategory
            });
        }

        private async Task<List<MostDiscussionCategoriesDTO>> GetMostDicussionCategory()
        {
            var categories = await _context.Categories
                                              .Where(Categories => Categories.ParentId == null)
                                              .Include(x => x.ChildCategories)
                                              .Distinct()
                                              .ToListAsync();


            var results = categories
               .Select(c => new MostDiscussionCategoriesDTO
               {
                   Id = c.Id,
                   Category = c.Name,
                   Amount = _context.Post.Where(post => post.Category.ParentId == c.Id).ToList().Count
               })
               .ToList();

            return results.OrderByDescending(c => c.Amount).Take(3).ToList();
        }

        private async Task<List<Guid?>> GetExistingCatgoryId()
        {
            var posts = await _context.Post
                .Include(x => x.Category)
                .ToListAsync();

            return posts
              .Select(p => p.Category.ParentId)
              .Distinct()
              .ToList();
        }

        private async Task<List<ResponsePostPreviewDTO>> GetExistingPostById(Guid? id)
        {
            var posts = await _context.Post
                .Include(x => x.Votes)
                .Include(x => x.User)
                .Include(x => x.Category.ParentCategory)
                .Include(y => y.Category)
                .Include(z => z.Comments)
                .ToListAsync();

            return posts
                .Where(p => p.CategoryId == id || p.Category.ParentId == id && p.IsPublished)
                .OrderByDescending(x => x.PublishedDate)
                .Select(x => new ResponsePostPreviewDTO
                {
                    User = new UserModel
                    {
                        Id = x.UserId,
                        Name = _nameService.ConvertName(x.User.FirstName + " " + x.User.LastName),
                        ImgUrl = x.User.ImageUrl,
                        Role = _userManager.GetRolesAsync(x.User).Result[0]
                    },
                    Post = new PostModel
                    {
                        Id = x.Id,
                        Title = x.Title,
                        Content = x.Summary,
                        Date = x.PublishedDate,
                    },
                    Category = new CategoryModel
                    {
                        Id = x.CategoryId,
                        Name = x.Category.Name,
                        ParentId = x.Category.ParentId,
                        ParentName = x.Category.ParentCategory.Name
                    },
                    Reaction = new ReactionModel
                    {
                        Vote = x.Votes.Count,
                        Comment = x.Comments.Count
                    }
                })
                .ToList();
        }

        private async Task<string> GetCategoryName(Guid? id)
        {
            return await _context.Categories
                .Where(c => c.Id == id)
                .Select(c => c.Name)
                .FirstOrDefaultAsync();
        }

        //SEARCH BY KEYWORD
        [HttpGet("search")]
        public async Task<IActionResult> SearchPosts(
            [FromQuery] string keyword,
            [FromQuery] Guid? categoryId = null,
            [FromQuery] int page = 1,
            [FromQuery] int pageSize = 10,
            [FromQuery] string sortOrder = "desc")
        {
            try
            {
                if (string.IsNullOrWhiteSpace(keyword))
                {
                    return BadRequest("Please provide a non-empty search query.");
                }

                var searchResults = _context.Post
                    .Include(x => x.User)
                    .Include(x => x.Votes)
                    .Include(x => x.Category.ParentCategory)
                    .Include(y => y.Category)
                    .Include(z => z.Comments)
                    .Where(p => p.IsPublished && (p.Title.Contains(keyword) || p.Content.Contains(keyword)));

                if (categoryId.HasValue)
                {
                    searchResults = searchResults.Where(p => p.CategoryId == categoryId || p.Category.ParentId == categoryId);
                }

                searchResults = sortOrder.ToLower() == "asc" ? searchResults.OrderBy(p => p.PublishedDate) : searchResults.OrderByDescending(p => p.PublishedDate);

                // Paginate the results
                var totalResults = await searchResults.CountAsync();
                var totalPages = (int)Math.Ceiling((double)totalResults / pageSize);

                var paginatedResults = await searchResults
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var result = new
                {
                    Keyword = keyword,
                    TotalResults = totalResults,
                    TotalPages = totalPages,
                    CurrentPage = page,
                    PageSize = pageSize,
                    Results = paginatedResults.Select(p => new
                    {
                        User = new
                        {
                            Id = p.User?.Id,
                            Name = p.User != null ? _nameService.ConvertName($"{p.User.FirstName} {p.User.LastName}") : "Unknown User",
                            ImgUrl = p.User?.ImageUrl,
                        },
                        Post = new
                        {
                            Id = p.Id,
                            Title = p.Title,
                            Content = p.Content,
                            Date = p.PublishedDate,
                        },
                        Category = new
                        {
                            Id = p.CategoryId,
                            Name = p.Category?.Name,
                            ParentId = p.Category?.ParentId,
                            ParentName = p.Category?.ParentCategory?.Name,
                        },
                        Reaction = new
                        {
                            Vote = p.Votes.Count,
                            Comment = p.Comments.Count
                        }
                    })
                };

                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }



        // CREATE
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<IActionResult> CreatePost(PostRequestDTO post)
        {
            var existingUser = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == post.UserId);

            if (existingUser == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] { "User doesn't exist" }
                });

            }

            var existingCatgory = await _context.Categories.FirstOrDefaultAsync(x => x.Id == post.CategoryId);

            if (existingCatgory == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] { "Category doesn't exist" }
                });

            }

            var postDomainModel = _mapper.Map<Post>(post);

            if (postDomainModel.Content.Length > 100)
            {
                postDomainModel.Summary = postDomainModel.Content.Substring(0, 100) + "...";
            }
            else
            {
                postDomainModel.Summary = postDomainModel.Content;
            }

            existingUser.ForumScore = existingUser.ForumScore + 5;
            await _context.Post.AddAsync(postDomainModel);
            _context.SaveChanges();

            return Ok(new
            {
                Id = postDomainModel.Id,
                UserId = postDomainModel.UserId,
                Title = postDomainModel.Title,
                Content = postDomainModel.Content,
                Summary = postDomainModel.Summary,
                PublishedDate = postDomainModel.PublishedDate,
            });

        }

        [HttpPost]
        [Route("point/{id}")]
        public async Task<IActionResult> ConvertUsingPoint([FromRoute] string id)
        {
            var existingUser = await _userManager.FindByIdAsync(id);
            if (existingUser == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = "This user doesn't exist"
                });
            }
            existingUser.RemainingPostUploadQuantity = existingUser.RemainingPostUploadQuantity + 1;
            existingUser.ForumScore = existingUser.ForumScore - 100;
            await _context.SaveChangesAsync();
            return Ok(existingUser.MemberShipScore);
        }

        // UPDATE
        [HttpPost("update")]
        public async Task<IActionResult> UpdatePost([FromBody] PostUpdateDTO post)
        {

            if (string.IsNullOrEmpty(post.Title) && string.IsNullOrEmpty(post.Content))
            {
                return BadRequest("Title, Content, and Summary cannot be null.");
            }

            var existingPost = await _context.Post.FirstOrDefaultAsync(x => x.Id == post.Id);
            if (existingPost == null)
            {
                return BadRequest();
            }

            existingPost.Title = post.Title;
            existingPost.Content = post.Content;
            existingPost.CategoryId = post.Category;

            if (existingPost.Content.Length > 100)
            {
                existingPost.Summary = existingPost.Content.Substring(0, 100) + "...";
            }
            else
            {
                existingPost.Summary = existingPost.Content;
            }

            _context.Entry(existingPost).State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return Ok(new
            {
                Id = existingPost.Id,
                UserId = existingPost.UserId,
                Title = existingPost.Title,
                Content = existingPost.Content,
                Summary = existingPost.Summary,
                PublishedDate = existingPost.PublishedDate,
            });
        }

        [HttpGet("monthly")]
        public async Task<IActionResult> GetMonthlyReported()
        {
            int currentYear = DateTime.Now.Year;

            var reports = await _context.Post
                .Where(r => r.PublishedDate.Year == currentYear)
                .ToListAsync();

            var reportCounts = reports
                .GroupBy(r => r.PublishedDate.Month)
                .Select(g => new
                {
                    Name = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(g.Key),
                    Posts = g.Count()
                })
                .OrderBy(g => g.Name)
                .ToList();

            return Ok(reportCounts);
        }

        // DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePost(Guid id)
        {
            var post = await _context.Post.FindAsync(id);
            if (post == null)
            {
                return NotFound();
            }

            _context.Post.Remove(post);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}

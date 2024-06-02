using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using swp391_be.API.Data;
using swp391_be.API.Models.Domain;
using swp391_be.API.Models.Enum;
using swp391_be.API.Models.Request.TPosts;
using swp391_be.API.Models.Response.Post;
using swp391_be.API.Models.Response.TradingPost;
using swp391_be.API.Services.Name;
using System.Globalization;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace swp391_be.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TradingPostController : ControllerBase
    {
        private readonly DBUtils _context;
        private readonly UserManager<User> _userManager;
        private readonly INameService _nameService;
        private readonly IMapper _mapper;


        public TradingPostController(DBUtils context, UserManager<User> _userManager, INameService _nameService, IMapper _mapper)
        {
            _context = context;
            this._userManager = _userManager;
            this._nameService = _nameService;
            this._mapper = _mapper;
        }

        [HttpGet("monthly")]
        public async Task<IActionResult> GetMonthlyReported()
        {
            int currentYear = DateTime.Now.Year;

            var TPosts = await _context.TradingPosts
                .Where(r => r.CheckDate != null && r.CheckDate.Value.Year == currentYear)
                .ToListAsync();

            var TPostsCount = TPosts
                .GroupBy(r => r.CheckDate.Value.Month)
                .Select(g => new
                {
                    Name = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(g.Key),
                    TradingPosts = g.Count()
                })
                .OrderBy(g => g.Name)
                .ToList();

            return Ok(TPostsCount);
        }

        [HttpGet("membership/monthly")]
        public async Task<IActionResult> GetMonthlyMembership()
        {
            int currentYear = DateTime.Now.Year;

            var transactions = await _context.MemberShip_Transactions
                .Where(r => r.CreatedDate != null && r.CreatedDate.Year == currentYear)
                .ToListAsync();

            var transactionCount = transactions
                .GroupBy(r => r.CreatedDate.Month)
                .Select(g => new
                {
                    Name = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(g.Key),
                    Membership = g.Count()
                })
                .OrderBy(g => g.Name)
                .ToList();

            return Ok(transactionCount);
        }

        [HttpGet]
        [Route("trading-TradePost")]
        public async Task<IActionResult> GetTradingPost(int pageNumber = 1, int pageSize = 10, Guid? categoryId = null, string name = null, string order = "desc")
        {
            var query = _context.TradingPosts
               .Include(x => x.Category.ParentCategory)
               .Include(x => x.User)
               .Where(post => post.IsAccepted == true && post.IsSold == false);

            if (categoryId.HasValue)
            {
                query = query.Where(post => post.CategoryId == categoryId.Value || post.Category.ParentId == categoryId.Value);
            }

            if (!string.IsNullOrEmpty(name))
            {
                query = query.Where(post => post.Title.Contains(name));
            }

            if (order.ToLower() == "asc")
            {
                query = query.OrderBy(post => post.PublicDate);
            }
            else
            {
                query = query.OrderByDescending(post => post.PublicDate);
            }

            var result = await query
               .Skip((pageNumber - 1) * pageSize)
               .Take(pageSize)
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
                       Age = x.Age,
                       Location = x.Location,
                       Price = x.Price,
                       Description = x.Description,
                       PublicDate = x.PublicDate,
                       IsFree = x.IsFree,
                       ImageUrls = x.ImageUrls.FirstOrDefault().Url
                   },
                   Category = new
                   {
                       Id = x.CategoryId,
                       Name = x.Category.Name,
                       ParentId = x.Category.ParentId,
                       ParentName = x.Category.ParentCategory.Name,
                   },
               })
               .ToListAsync();
            return Ok(result);
        }


        [HttpGet]
        [Route("trading-TradePost-Count")]
        public async Task<IActionResult> GetTradingPostCount(Guid? categoryId = null, string title = null)
        {
            var query = _context.TradingPosts
                .Where(post => post.IsAccepted == true && post.IsSold == false);

            if (categoryId.HasValue)
            {
                query = query.Where(post => post.CategoryId == categoryId.Value || post.Category.ParentId == categoryId.Value);
            }
            if (!string.IsNullOrEmpty(title))
            {
                query = query.Where(post => post.Title.ToLower().Contains(title.ToLower().Trim()));
            }
            var count = await query.CountAsync();

            return Ok(count);
        }


        [HttpGet]
        [Route("trading-TradePost/details/{id:Guid}")]
        public async Task<IActionResult> GetTradingPostDetails([FromRoute] Guid id)
        {
            var TPostHistory = await _context.TradingPosts
                                                        .Include(x => x.User)
                                                        .ToListAsync();
            var existingTradingPost = await _context.TradingPosts
                                                        .Include(x => x.Category)
                                                        .Include(y => y.ImageUrls)
                                                        .FirstOrDefaultAsync(tradingPost => tradingPost.Id == id);
            if (existingTradingPost == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    error = "this TradePost doesn't exist"
                });
            }

            if (TPostHistory == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    error = "TPost history nows is empty"
                });
            }

            var TPostDomainModel = TPostHistory
                                            .FirstOrDefault(TPost => TPost.Id == existingTradingPost.Id);
            if (TPostDomainModel == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    error = "model doesn't exist in the TPost history"
                });
            }

            var notAllowedToShow = TPostDomainModel.IsSold;
            if (notAllowedToShow)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    error = "This TradePost is already been sold"
                });
            }

            var userDomainModel = await _context.Users.Include(x => x.Memberships).FirstOrDefaultAsync(x => x.Id == TPostDomainModel.UserId);
            if (userDomainModel == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    error = "failed to get this user"
                });
            }

            var result = new TradingPostDetailsResponseDTO
            {
                Category = new CategoryPostDetailsResponseDTO
                {
                    Id = existingTradingPost.CategoryId,
                    Name = existingTradingPost.Category.Name,
                },
                User = new PostSellerResponseDTO
                {
                    Id = userDomainModel.Id,
                    Name = _nameService.ConvertName(userDomainModel.FirstName + " " + userDomainModel.LastName),
                    ImgUrl = userDomainModel.ImageUrl,
                    Rank = ConvertPointToEnum(userDomainModel.MemberShipScore),
                    Email = userDomainModel.Email,
                    Phone = userDomainModel.PhoneNumber,
                },
                Id = existingTradingPost.Id,
                Title = existingTradingPost.Title,
                Age = ConvertAgeToEnum((int)existingTradingPost.Age),
                Location = existingTradingPost.Location,
                Price = existingTradingPost.Price,
                Description = existingTradingPost.Description,
                PublicDate = existingTradingPost.PublicDate,
                IsFree = existingTradingPost.IsFree,
                ImageUrls = existingTradingPost.ImageUrls.Select(x => x.Url).ToList(),
                IsSold = TPostDomainModel.IsSold,
                IsAccepted = TPostDomainModel.IsAccepted,
            };

            return Ok(result);
        }

        [HttpPost]
        [Route("trading-TradePost/upload")]
        public async Task<IActionResult> UploadPost([FromBody] TPostRequestDTO req)
        {
            // Find the user with the provided UserId
            var existingUser = await _userManager.FindByIdAsync(req.UserId);
            if (existingUser == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    error = "this user doesn't exist"
                });
            }

            var remainingPostUploadQuantity = existingUser.RemainingPostUploadQuantity;
            if (remainingPostUploadQuantity <= 0)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    error = "this user doens't have any remaining upload quantity left"
                });
            }
            var TradingPostDomainModel = _mapper.Map<TradingPost>(req);
            await _context.TradingPosts.AddAsync(TradingPostDomainModel);

            var tradingPostImages = req.Urls
                .Select(url => new TPost_ImageUrl
                {
                    TradingPostId = TradingPostDomainModel.Id,
                    Url = url,
                })
                .ToList();
            var tradingPostImagesDomainModel = _mapper.Map<List<TPost_ImageUrl>>(tradingPostImages);
            await _context.Trading_Post_ImageUrls.AddRangeAsync(tradingPostImagesDomainModel);
            await _userManager.Users
                    .Where(user => user.Id == req.UserId)
                    .ExecuteUpdateAsync(property =>
                        property.SetProperty(user => user.RemainingPostUploadQuantity, remainingPostUploadQuantity - 1));
            await _context.SaveChangesAsync();
            return Ok("Success");
        }
        [HttpPost]
        [Route("trading-TradePost/confirm/{id:Guid}")]
        public async Task<IActionResult> ConfirmTradingPost([FromRoute] Guid id)
        {
            var TPostHistory = await _context.TradingPosts
                .FirstOrDefaultAsync(TPost =>
                TPost.IsSold == false
                && TPost.Id == id
                && TPost.CheckDate == null);
            if (TPostHistory == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    error = "Trading post status was sold already or TPost date already up to date"
                });
            }

            var existingTradingPost = await _context.TradingPosts
                .FirstOrDefaultAsync(post => post.Id == id
                && post.CheckDate == null
                && post.IsAccepted == true);
            if (existingTradingPost == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    error = "Public date still not updated or TradePost can't be perform to show"
                });
            }
            var result = await _context.TradingPosts
                                        .Where(TPost => TPost.Id == id)
                                        .ExecuteUpdateAsync(property =>
                                            property.SetProperty(TPost => TPost.IsSold, true)
                                                    .SetProperty(TPost => TPost.CheckDate, DateTime.Now));
            if (result <= 0)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    error = "Failed to update"
                });
            }

            return Ok("success");
        }

        [HttpGet]
        [Route("trading-TradePost/remaining-quantity/{id}")]
        public async Task<IActionResult> GetRemainingUploadPost([FromRoute] string id)
        {
            var existingUser = await _userManager.FindByIdAsync(id);
            if (existingUser == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    error = "this user doesn't exist"
                });
            }
            return Ok(existingUser.RemainingPostUploadQuantity);
        }

        [HttpGet]
        [Route("trading-TradePost/processing")]
        public async Task<IActionResult> GetProcessingTradingPost()
        {
            var existingTradingPost = await _context.TradingPosts
                .Include(post => post.Category.ParentCategory)
                .Include(post => post.User)
                .Where(post => post.IsAccepted == false)
                .Select(post => new
                {
                    Id = post.Id,
                    Status = post.IsAccepted,
                    Title = post.Title,
                    Category = post.CategoryId,
                    Name = post.Category.Name,
                })
                .ToListAsync();
                return Ok(existingTradingPost);
        }

        [HttpPost]
        [Route("trading-TradePost/processing-action")]
        public async Task<IActionResult> ProcessingAction(TPostProcessingActionRequestDTO req)
        {
            var existingTradingPost = await _context.TradingPosts.Include(x => x.User).FirstOrDefaultAsync(post => post.Id == req.PostId);
            if (existingTradingPost == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    error = "This Post Doesn't exist anymore"
                });
            }
            if (req.IsAccepted)
            {
                existingTradingPost.IsAccepted = true;
                existingTradingPost.PublicDate = DateTime.Now;
            }
            else
            {
                _context.TradingPosts.Remove(existingTradingPost);
                await _context.Users.Where(user => user.Id == existingTradingPost.UserId).ExecuteUpdateAsync(property => property.SetProperty(user => user.RemainingPostUploadQuantity, user => (user.RemainingPostUploadQuantity + 1)));
            }
            await _context.SaveChangesAsync();
            return Ok();
        }

        private MemberShipRankingPoint ConvertPointToEnum(int point)
        {
            if (point <= 10) return MemberShipRankingPoint.IRON;
            if (point <= 30) return MemberShipRankingPoint.BRONZE;
            if (point <= 60) return MemberShipRankingPoint.SILVER;
            if (point >= 100) return MemberShipRankingPoint.GOLD;

            return MemberShipRankingPoint.IRON;
        }

        private PetAge ConvertAgeToEnum(int age)
        {
            if (age == (int)PetAge.LOWER_THAN_THREE_MONTH)
                return PetAge.LOWER_THAN_THREE_MONTH;
            if (age == (int)PetAge.LOWER_THAN_ONE_YEAR)
                return PetAge.LOWER_THAN_ONE_YEAR;
            if (age == (int)PetAge.GREATER_THAN_ONE_YEAR)
                return PetAge.GREATER_THAN_ONE_YEAR;

            return PetAge.OTHER;
        }
    }
}

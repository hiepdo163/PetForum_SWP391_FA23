using AutoMapper;
using MailKit;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using swp391_be.API.Data;
using swp391_be.API.Models.Domain;
using swp391_be.API.Models.Enum;
using swp391_be.API.Models.Request.User;
using swp391_be.API.Models.Response.Post;
using swp391_be.API.Models.Response.User;
using swp391_be.API.Services.Name;
using System.Globalization;

namespace swp391_be.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;
        private readonly INameService _nameService;
        private readonly DBUtils _dBUtils;


        public UserController(UserManager<User> _userManager, IMapper _mapper, INameService _nameService, DBUtils _dBUtils)
        {
            this._userManager = _userManager;
            this._mapper = _mapper;
            this._nameService = _nameService;
            this._dBUtils = _dBUtils;
        }

        [HttpGet]
        [Authorize(Roles = Roles.MEMBER)]
        [Route("Post/{id:Guid}")]
        public async Task<IActionResult> GetUserPostsHistory([FromRoute] Guid id)
        {
            var userDomainModel = await _userManager.Users
                    .Where(x => x.Id == id.ToString())
                    .Select(x => new
                    {
                        Posts = x.Posts
                    })
                    .FirstOrDefaultAsync();
            return Ok(userDomainModel);
        }

        [HttpGet]
        public async Task<IActionResult> GetUser()
        {
            Thread.Sleep(700);
            var userDomainList = await _userManager.Users.ToListAsync();
            var result = new List<ProfileResponseDTO>();
            foreach (var User in userDomainList)
            {
                var roles = await _userManager.GetRolesAsync(User);
                var ProfileResponseDTO = _mapper.Map<ProfileResponseDTO>(User);
                ProfileResponseDTO.Roles = roles.ToList();
                result.Add(ProfileResponseDTO);
            }
            return Ok(result);
        }

        [HttpGet]
        [Authorize(Roles = Roles.MEMBER)]
        [Route("Vote/{id:Guid}")]
        public async Task<IActionResult> GetUserVotesHistory([FromRoute] Guid id)
        {
            var voteDomainModel = await _userManager.Users
                    .Where(x => x.Id == id.ToString())
                    .Select(x => x.Votes.Select(y => y.Post))
                    .FirstOrDefaultAsync();
            return Ok(voteDomainModel);
        }

        [HttpGet]
        [Authorize(Roles = Roles.MEMBER)]
        [Route("Comment/{id:Guid}")]
        public async Task<IActionResult> GetUserCommentsHistory([FromRoute] Guid id)
        {
            var commentDomainModel = await _userManager.Users
                    .Where(x => x.Id == id.ToString())
                    .Select(x => new
                    {
                        Comment = x.Comments
                    })
                    .FirstOrDefaultAsync();
            return Ok(commentDomainModel);
        }

        [HttpGet]
        [Route("{id:Guid}")]
        //[Authorize(Roles = Roles.ADMIN)]
        public async Task<IActionResult> GetUserById([FromRoute] Guid id)
        {
            var userDomainModel = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == id.ToString());

            if (userDomainModel is null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = "The given user doesn't exist in our system."
                });
            }

            return Ok(_mapper.Map<ProfileResponseDTO>(userDomainModel));
        }

        [HttpPost]
        [Authorize(Roles = Roles.ADMIN)]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserRequestDTO createUserRequestDTO)
        {
            if (!(createUserRequestDTO.Roles == Roles.ADMIN
                || createUserRequestDTO.Roles == Roles.STAFF
                || createUserRequestDTO.Roles == Roles.MEMBER))
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = "The input role doesn't exist in our system"
                });
            }

            var identityUser = new User
            {
                UserName = createUserRequestDTO.EmailAddress,
                Email = createUserRequestDTO.EmailAddress,
                FirstName = createUserRequestDTO.FirstName,
                LastName = createUserRequestDTO.LastName,
                PhoneNumber = createUserRequestDTO.PhoneNumber,
                EmailConfirmed = true,
            };

            var identityResult = await _userManager.CreateAsync(identityUser, createUserRequestDTO.Password);

            if (identityResult.Succeeded)
            {
                identityResult = await _userManager.AddToRolesAsync(identityUser, new[] { createUserRequestDTO.Roles });

                if (identityResult.Succeeded)
                {
                    return Ok(identityResult);
                }
            }
            return BadRequest(identityResult);
        }

        [HttpPost]
        [Route("Update/{id:Guid}")]
        public async Task<IActionResult> UpdateUser([FromBody] UpdateUserRequestDTO updateUserRequestDTO, [FromRoute] Guid id)
        {
            //If all value is null then nothing to update
            if (string.IsNullOrEmpty(updateUserRequestDTO.FirstName)
                && string.IsNullOrEmpty(updateUserRequestDTO.LastName)
                && string.IsNullOrEmpty(updateUserRequestDTO.PhoneNumber)
                && string.IsNullOrEmpty(updateUserRequestDTO.Password)
                && updateUserRequestDTO.Gender != null
                && string.IsNullOrEmpty(updateUserRequestDTO.Bio))
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = "There is nothing to update."
                });
            }

            //Check if user is exist or not
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Id == id.ToString());
            var errors = new List<string>();
            if (user == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = "This user doesn't exist, so we can't update."
                });
            }

            //Update First Name - Last Name - Phone Number
            //If null then will not update the value
            try
            {
                int status = await _userManager.Users.AsQueryable()
                 .Where(u => u.Id == id.ToString())
                 .ExecuteUpdateAsync(property =>
                     property.SetProperty(e => e.FirstName, e => (e.FirstName != updateUserRequestDTO.FirstName && updateUserRequestDTO.FirstName != null)
                                 ? updateUserRequestDTO.FirstName
                                 : e.FirstName)
                             .SetProperty(e => e.LastName, e => (updateUserRequestDTO.LastName != null && user.LastName != updateUserRequestDTO.LastName)
                                 ? updateUserRequestDTO.LastName
                                 : e.LastName)
                             .SetProperty(e => e.PhoneNumber, e => (updateUserRequestDTO.PhoneNumber != null && user.PhoneNumber != updateUserRequestDTO.PhoneNumber)
                                 ? updateUserRequestDTO.PhoneNumber
                                 : e.PhoneNumber)
                             .SetProperty(e => e.Gender, e => (updateUserRequestDTO.Gender != null && user.Gender != updateUserRequestDTO.Gender)
                                 ? updateUserRequestDTO.Gender
                                 : e.Gender)
                             .SetProperty(e => e.Bio, e => (updateUserRequestDTO.Bio != null && user.Bio != updateUserRequestDTO.Bio)
                                 ? updateUserRequestDTO.Bio
                                 : e.Bio));
            }
            catch (Exception e)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = e.ToString()
                });
            }

            return Ok(new
            {
                succeeded = true
            });
        }

        [HttpPost]
        [Route("Update/role/{email}/{role}")]
        [Authorize(Roles = Roles.ADMIN)]
        public async Task<IActionResult> UpdateUserRole([FromRoute] string role, [FromRoute] string email)
        {
            var existingUser = await _userManager.FindByEmailAsync(email);
            if (existingUser == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] { "user doesn't exist" }
                });
            }
            var existingRole = await _userManager.GetRolesAsync(existingUser);


            await _userManager.RemoveFromRolesAsync(existingUser, existingRole);
            await _userManager.AddToRoleAsync(existingUser, role);
            try
            {
                var result = await _userManager.UpdateAsync(existingUser);
                return Ok(result);

            }
            catch (Exception e)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] { "failed to update" }
                });
            }
        }


        [HttpDelete]
        [Route("remove/{email}")]
        public async Task<IActionResult> RemoveUser([FromRoute] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] { "email is null or empty unable to delete" }
                });
            }

            var existingUser = await _userManager.FindByEmailAsync(email);

            if (existingUser == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] { "user doesn't exist" }
                });
            }

            var result = await _userManager.Users
                    .Where(user => user.Email == email)
                    .ExecuteUpdateAsync(property => property.SetProperty(user => user.IsBanned, true));

            if (result <= 0)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] { "failed to remove user from database" }
                });
            }

            return Ok(result);
        }

        [HttpGet("monthly")]
        public async Task<IActionResult> GetMonthlyReported()
        {
            int currentYear = DateTime.Now.Year;

            var users = await _userManager.Users
                .Where(r => r.CreatedDate.Year == currentYear)
                .ToListAsync();

            var userCount = users
                .GroupBy(r => r.CreatedDate.Month)
                .Select(g => new
                {
                    Name = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(g.Key),
                    Users = g.Count()
                })
                .OrderBy(g => g.Name)
                .ToList();

            return Ok(userCount);
        }

        [HttpPost]
        [Route("update/avatar")]
        public async Task<IActionResult> UploadUserImage([FromBody] UploadImageRequestDTO uploadImageRequest)
        {
            var result = await _userManager.Users
                            .Where(x => x.Id == uploadImageRequest.UserId)
                            .ExecuteUpdateAsync(property => property.SetProperty(e => e.ImageUrl, uploadImageRequest.ImgUrl));
            if (result != 1)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] { "Failed to update" }
                });
            }

            return Ok(result);
        }

        [HttpGet]
        [Route("avatar/{UserId}")]
        public async Task<IActionResult> GetUserAvatar([FromRoute] string UserId)
        {
            var existingUser = _userManager.FindByIdAsync(UserId);

            var imgUrl = existingUser.Result.ImageUrl;

            if (existingUser.Result == null) return Ok(null);


            return Ok(new
            {
                imageUrl = imgUrl
            });
        }

        [HttpGet]
        [Route("public/details/{id}")]
        public async Task<IActionResult> GetPublicUserProfileDetails([FromRoute] string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    error = "This user doesn't exist"
                });
            }

            var userRole = _userManager.GetRolesAsync(user).Result[0];

            var userProfile = new
            {
                Id = user.Id,
                FirstName = user.FirstName.Substring(0, 1).ToUpper() + user.FirstName.Substring(1),
                LastName = user.LastName.Substring(0, 1).ToUpper() + user.LastName.Substring(1),
                Gender = user.Gender,
                Email = user.Email,
                Phone = user.PhoneNumber,
                Bio = user.Bio,
                Name = _nameService.ConvertName(user.FirstName + " " + user.LastName),
                ImageUrl = user.ImageUrl,
                Role = userRole,
                CreatedDate = user.CreatedDate,
                ForumScore = user.ForumScore,
                UploadQuantity = user.RemainingPostUploadQuantity,
                MembershipScore = user.MemberShipScore
            };

            var trading = await _dBUtils.TradingPosts
                .Where(trading => trading.UserId == id)
                .OrderByDescending(trading => trading.CheckDate == null)
                .Include(trading => trading.User)
                .Select(trading => new
                {
                    Id = trading.Id,
                    Date = trading.CheckDate,
                    TradingPost = new
                    {
                        Id = trading.Id,
                        Title = trading.Title,
                        Age = ConvertAgeToEnum((int)trading.Age),
                        Location = trading.Location,
                        Price = trading.Price,
                        Description = trading.Description,
                        PublicDate = trading.PublicDate,
                        IsFree = trading.IsFree,
                        ImageUrls = trading.ImageUrls.Select(x => x.Url).ToList()
                    }
                })
                .ToListAsync();

            var membershipTransactions = await _dBUtils.MemberShip_Transactions
                .Where(transaction => transaction.UserId == id)
                .Select(transaction => new
                {
                    Id = transaction.Id,
                    Date = transaction.CreatedDate,
                    Amount = transaction.Amount,
                })
                .ToListAsync();

            var userPosts = await _dBUtils.Post
                .Where(post => post.UserId == id)
                .OrderByDescending(post => post.PublishedDate)
                .Select(post => new
                {
                    Post = new
                    {
                        Id = post.Id,
                        Title = post.Title,
                        Content = post.Summary,
                        Date = post.PublishedDate,
                    },
                    Category = new
                    {
                        Id = post.CategoryId,
                        Name = post.Category.Name,
                        ParentId = post.Category.ParentId,
                        ParentName = post.Category.ParentCategory.Name
                    },
                    Reactions = new
                    {
                        Vote = post.Votes.Count,
                        CommentCount = post.Comments.Count
                    }
                })
                .ToListAsync();

            var result = new
            {
                UserProfile = userProfile,
                TransactionHistory = trading,
                MembershipTransactionHistory = membershipTransactions,
                UserPosts = userPosts
            };

            return Ok(result);
        }

        private static PetAge ConvertAgeToEnum(int age)
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

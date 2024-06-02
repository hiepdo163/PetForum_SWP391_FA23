using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using swp391_be.API.Data;
using swp391_be.API.Models.Domain;
using swp391_be.API.Models.Request.Feedback;
using System;
using System.Threading.Tasks;

namespace swp391_be.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FeedbackController : ControllerBase
    {
        private readonly DBUtils _context;
        private readonly UserManager<User> _userManager;

        public FeedbackController(DBUtils context, UserManager<User> userManager)
        {
            _context = context;
            _userManager = userManager;
        }

        [HttpPost("submit-feedback")]
        public async Task<IActionResult> SubmitFeedback([FromBody] FeedbackRequestDTO feedbackRequest)
        {
            try
            {
           
                var targetUser = await _userManager.FindByIdAsync(feedbackRequest.TargetUserId);
                if (targetUser == null)
                {
                    return BadRequest(new
                    {
                        Succeeded = false,
                        Errors = new[] { "Target user doesn't exist" }
                    });
                }


                var userProvidingFeedback = await _userManager.FindByIdAsync(feedbackRequest.UserId);
                if (userProvidingFeedback == null)
                {
                    return BadRequest(new
                    {
                        Succeeded = false,
                        Errors = new[] { "User providing feedback doesn't exist" }
                    });
                }

                var feedback = new Feedback
                {
                    Id = Guid.NewGuid(),
                    Content = feedbackRequest.Content,
                    Stars = feedbackRequest.Stars,
                    UserId = feedbackRequest.UserId,
                    TargetUserId = feedbackRequest.TargetUserId,
                    PhotoUrl = feedbackRequest.PhotoUrl 
                };

                _context.Feedbacks.Add(feedback);
                await _context.SaveChangesAsync();

                return Ok(new { Succeeded = true, Errors = "" });
            }
            catch (Exception ex)
            {

                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine($"Inner Exception: {ex.InnerException?.Message}");


                return StatusCode(500, new { Succeeded = false, Errors = ex.Message });
            }
        }

        [HttpGet("get-feedbacks")]
        public async Task<IActionResult> GetFeedbacks([FromQuery] string targetUserId, [FromQuery] int page = 1, [FromQuery] int pageSize = 3)
        {
            try
            {
                var totalFeedbacks = await _context.Feedbacks
                    .Where(f => f.TargetUserId == targetUserId)
                    .CountAsync();

                var feedbacks = await _context.Feedbacks
                    .OrderByDescending(f => f.Id) // Order by the most recent feedbacks
                    .Include(f => f.User)
                    .Where(f => f.TargetUserId == targetUserId)
                    .Skip((page - 1) * pageSize)
                    .Take(pageSize)
                    .ToListAsync();

                var feedbackResponses = feedbacks.Select(f => new
                {
                    Id = f.Id,
                    Content = f.Content,
                    Stars = f.Stars,
                    UserId = f.UserId,
                    TargetUserId = f.TargetUserId,
                    PhotoUrl = f.PhotoUrl,
                    UserName = f.User.FirstName + " " + f.User.LastName,
                    UserAvatarUrl = f.User.ImageUrl
                }).ToList();

                var totalPages = (int)Math.Ceiling((double)totalFeedbacks / pageSize);

                var response = new
                {
                    TotalFeedbacks = totalFeedbacks,
                    TotalPages = totalPages,
                    CurrentPage = page,
                    PageSize = pageSize,
                    Feedbacks = feedbackResponses
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine($"Inner Exception: {ex.InnerException?.Message}");

                return StatusCode(500, new { Succeeded = false, Errors = ex.Message });
            }
        }


    }
}
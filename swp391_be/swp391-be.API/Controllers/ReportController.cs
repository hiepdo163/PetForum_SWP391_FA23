using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;
using swp391_be.API.Models.Domain;
using swp391_be.API.Data;
using swp391_be.API.Models.Request.Report;
using Microsoft.AspNetCore.Identity;
using System.Globalization;

namespace swp391_be.API.Controllers
{
    [ApiController]
    [Route("api/reports")]
    public class ReportController : ControllerBase
    {
        private readonly DBUtils _context;
        private readonly UserManager<User> _userManager;

        public ReportController(DBUtils context, UserManager<User> _userManager)
        {
            _context = context;
            this._userManager = _userManager;
        }

        [HttpPost("report-post")]
        public async Task<IActionResult> ReportPost([FromBody] ReportRequestDTO reportRequest)
        {
            try
            {
                // Validate user existence
                var existingUser = await _userManager.FindByIdAsync(reportRequest.UserId);
                if (existingUser == null)
                {
                    return BadRequest(new
                    {
                        Succeeded = false,
                        Errors = new[] { "User doesn't exist" }
                    });
                }

                // Check if the post exists
                var post = await _context.Post
                    .FirstOrDefaultAsync(p => p.Id == reportRequest.PostId);

                if (post == null)
                {
                    return NotFound(new { Succeeded = false, Errors = "Post not found." });
                }

                var report = new Report
                {
                    Id = Guid.NewGuid(),
                    PostId = reportRequest.PostId,
                    IsProcessing = true,
                    CreatedDate = DateTime.Now,
                    Reason = reportRequest.Reason,
                    UserId = reportRequest.UserId,
                    ProcessDate = null,
                    IsApproved = -1
                };            

                // Batch database operations
                _context.Report.Add(report);
                await _context.SaveChangesAsync();

                return Ok(new { Succeeded = true, Errors = "" });
            }
            catch (Exception ex)
            {
                // Log the exception details
                Console.WriteLine($"Error: {ex.Message}");
                Console.WriteLine($"Inner Exception: {ex.InnerException?.Message}");

                // Return a more detailed error response
                return StatusCode(500, new { Succeeded = false, Errors = ex.Message });
            }
        }

        [HttpGet("reported-posts")]
        public async Task<IActionResult> GetReportedPosts()
        {
            try
            {
                var reportedPosts = await _context.Report
                    .Include(r => r.Post)
                    .Where(r => r.IsProcessing == false)
                    .ToListAsync();

                return Ok(reportedPosts);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Succeeded = false, Errors = ex.Message });
            }
        }

        [HttpGet("reported-posts/monthly")]
        public async Task<IActionResult> GetMonthlyReported()
        {
            int currentYear = DateTime.Now.Year;

            var reports = await _context.Report
                .Where(r => r.CreatedDate.Year == currentYear)
                .ToListAsync();

            var reportCounts = reports
                .GroupBy(r => r.CreatedDate.Month)
                .Select(g => new
                {
                    Name = CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(g.Key),
                    Reports = g.Count()
                })
                .OrderBy(g => g.Name)
                .ToList();

            return Ok(reportCounts);
        }

        [HttpGet]
        [Route("reported-posts/processing")]
        public async Task<IActionResult> GetReportProcessingList()
        {
            var Report = await _context.Report
                                .Select(r => new
                                {
                                    ReportId = r.Id,
                                    PostId = r.PostId,
                                    Reason = r.Reason,
                                    ReportDate = r.CreatedDate,
                                    Status = r.IsApproved
                                }).ToListAsync();

            return Ok(Report);
        }

        [HttpPost]
        [Route("reported-posts/processing/{ReportedId:Guid}/{isAccepted:bool}")]
        public async Task<IActionResult> ProcessReport([FromRoute] Guid ReportedId, [FromRoute] bool IsAccepted)
        {
            var existingReport = await _context.Report.FirstOrDefaultAsync(x => x.Id == ReportedId);

            if(existingReport == null)
            {
                return BadRequest(new {
                    succeeded = false,
                    errors = new[] {"This report doesn't exist."}
                });
            }

            var existingReportHistory = await _context.Report.FirstOrDefaultAsync(x => x.Id == ReportedId && x.ProcessDate == null && x.IsApproved == -1);

            if(existingReportHistory == null)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = new[] { "This report is process by another one." }
                });
            }

            existingReportHistory.ProcessDate = DateTime.Now;
            existingReportHistory.IsApproved = IsAccepted ? 1 : 0;
            existingReport.IsProcessing = false;

            if (IsAccepted)
            {
                var postId = existingReport.PostId;
                var acceptedReport = await _context.Report
                    .Where(x => x.PostId == postId && x.ProcessDate == null && x.IsApproved == -1)
                    .ExecuteUpdateAsync(property => property
                        .SetProperty(report => report.ProcessDate, DateTime.Now)
                        .SetProperty(report => report.IsApproved, 1));

                var existingPost = await _context.Post.FirstOrDefaultAsync(post => post.Id == postId);
                existingPost.IsPublished = false;
            }


            await _context.SaveChangesAsync();

            return Ok(new
            {
                succeeded = true,
                message = "Report processed successfully."
            });
        }
    }
}

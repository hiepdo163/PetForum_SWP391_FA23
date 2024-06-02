using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using swp391_be.API.Data;
using swp391_be.API.Models.Domain;
using swp391_be.API.Models.Enum;
using System.Globalization;

namespace swp391_be.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ReportedStatisticsController : ControllerBase
    {
        private readonly DBUtils _context;
        private readonly UserManager<User> _userManager;

        public ReportedStatisticsController(DBUtils context, UserManager<User> _userManager)
        {
            _context = context;
            this._userManager = _userManager;
        }
        [HttpGet("this-week")]
        [Authorize(Roles = Roles.ADMIN)]
        public async Task<IActionResult> GetThisWeekCounts()
        {
            DateTime currentDate = DateTime.Now;
            int currentYear = currentDate.Year;
            int currentWeek = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(currentDate, CalendarWeekRule.FirstDay, DayOfWeek.Sunday);

            var users = await _userManager.Users.ToListAsync();
            var posts = await _context.Post.ToListAsync();
            var tradingPost = await _context.TradingPosts.Where(t => t.CheckDate != null).ToListAsync();
            var reports = await _context.Report.ToListAsync();
            var membershipTransaction = await _context.MemberShip_Transactions.ToListAsync();

            var usersCount = users.Count(u => u.CreatedDate.Year == currentYear && CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(u.CreatedDate, CalendarWeekRule.FirstDay, DayOfWeek.Sunday) == currentWeek);
            var postsCount = posts.Count(p => p.PublishedDate.Year == currentYear && CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(p.PublishedDate, CalendarWeekRule.FirstDay, DayOfWeek.Sunday) == currentWeek);
            var tradingPostsCount = tradingPost.Count(t => t.CheckDate.Value.Year == currentYear && CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(t.CheckDate.Value, CalendarWeekRule.FirstDay, DayOfWeek.Sunday) == currentWeek);
            var reportsCount = reports.Count(r => r.CreatedDate.Year == currentYear && CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(r.CreatedDate, CalendarWeekRule.FirstDay, DayOfWeek.Sunday) == currentWeek);
            var memberShipTransactionCount = membershipTransaction.Count(r => r.CreatedDate.Year == currentYear && CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(r.CreatedDate, CalendarWeekRule.FirstDay, DayOfWeek.Sunday) == currentWeek);

            var thisWeekCounts = new
            {
                Users = usersCount,
                Posts = postsCount,
                Transactions = tradingPostsCount,
                Reports = reportsCount,
                Membership = memberShipTransactionCount,
            };

            return Ok(thisWeekCounts);
        }

        [HttpGet("monthly")]
        [Authorize(Roles = Roles.ADMIN)]
        public async Task<IActionResult> GetMonthlyCounts()
        {
            DateTime currentDate = DateTime.Now;
            int currentYear = currentDate.Year;
            int currentMonth = currentDate.Month;

            var usersCount = await _userManager.Users
                .Where(u => u.CreatedDate.Year == currentYear && u.CreatedDate.Month == currentMonth)
                .CountAsync();

            var postsCount = await _context.Post
                .Where(p => p.PublishedDate.Year == currentYear && p.PublishedDate.Month == currentMonth)
                .CountAsync();

            var tradingPostsCount = await _context.TradingPosts
                .Where(t => t.CheckDate != null && t.CheckDate.Value.Year == currentYear && t.CheckDate.Value.Month == currentMonth)
                .CountAsync();

            var reportsCount = await _context.Report
                .Where(r => r.CreatedDate.Year == currentYear && r.CreatedDate.Month == currentMonth)
                .CountAsync();

            var membershipTransactionCount = await _context.MemberShip_Transactions
               .Where(r => r.CreatedDate.Year == currentYear && r.CreatedDate.Month == currentMonth)
               .CountAsync();

            var monthlyCounts = new
            {
                Users = usersCount,
                Posts = postsCount,
                Transactions = tradingPostsCount,
                Reports = reportsCount,
                Membership = membershipTransactionCount
            };

            return Ok(monthlyCounts);
        }

        [HttpGet("last-month")]
        [Authorize(Roles = Roles.ADMIN)]
        public async Task<IActionResult> GetLastMonthCounts()
        {
            DateTime currentDate = DateTime.Now;
            int currentYear = currentDate.Year;
            int currentMonth = currentDate.Month;

            int lastMonthYear = currentMonth == 1 ? currentYear - 1 : currentYear;
            int lastMonth = currentMonth == 1 ? 12 : currentMonth - 1;

            var usersCount = await _userManager.Users
                .Where(u => u.CreatedDate.Year == lastMonthYear && u.CreatedDate.Month == lastMonth)
                .CountAsync();

            var postsCount = await _context.Post
                .Where(p => p.PublishedDate.Year == lastMonthYear && p.PublishedDate.Month == lastMonth)
                .CountAsync();

            var tradingPostsCount = await _context.TradingPosts
                .Where(t => t.CheckDate != null && t.CheckDate.Value.Year == lastMonthYear && t.CheckDate.Value.Month == lastMonth)
                .CountAsync();

            var reportsCount = await _context.Report
                .Where(r => r.CreatedDate.Year == lastMonthYear && r.CreatedDate.Month == lastMonth)
                .CountAsync();

            var membershipTransactionCount = await _context.MemberShip_Transactions
               .Where(r => r.CreatedDate.Year == lastMonthYear && r.CreatedDate.Month == lastMonth)
               .CountAsync();

            var lastMonthCounts = new
            {
                Users = usersCount,
                Posts = postsCount,
                Transactions = tradingPostsCount,
                Reports = reportsCount,
                Membership = membershipTransactionCount,
            };

            return Ok(lastMonthCounts);
        }

        [HttpGet("today")]
        [Authorize(Roles = Roles.ADMIN)]
        public async Task<IActionResult> GetTodayCounts()
        {
            DateTime currentDate = DateTime.Now;
            int currentYear = currentDate.Year;
            int currentMonth = currentDate.Month;
            int currentDay = currentDate.Day;

            var usersCount = await _userManager.Users
                .Where(u => u.CreatedDate.Year == currentYear 
                    && u.CreatedDate.Month == currentMonth 
                    && u.CreatedDate.Day == currentDay)
                .CountAsync();

            var postsCount = await _context.Post
                .Where(p => p.PublishedDate.Year == currentYear 
                    && p.PublishedDate.Month == currentMonth 
                    && p.PublishedDate.Day == currentDay)
                .CountAsync();

            var tradingPostsCount = await _context.TradingPosts
                .Where(t => t.CheckDate != null 
                    && t.CheckDate.Value.Year == currentYear 
                    && t.CheckDate.Value.Month == currentMonth 
                    && t.CheckDate.Value.Day == currentDay)
                .CountAsync();

            var reportsCount = await _context.Report
                .Where(r => r.CreatedDate.Year == currentYear 
                    && r.CreatedDate.Month == currentMonth 
                    && r.CreatedDate.Day == currentDay)
                .CountAsync();

            var membershipTransactionCount = await _context.MemberShip_Transactions
                .Where(r => r.CreatedDate.Year == currentYear
                    && r.CreatedDate.Month == currentMonth
                    && r.CreatedDate.Day == currentDay)
                .CountAsync();

            var todayCounts = new
            {
                Users = usersCount,
                Posts = postsCount,
                TradingPosts = tradingPostsCount,
                Reports = reportsCount,
                Membership = membershipTransactionCount
            };

            return Ok(todayCounts);
        }
    }
}

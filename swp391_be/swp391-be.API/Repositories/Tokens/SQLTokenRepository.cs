using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using swp391_be.API.Data;
using swp391_be.API.Models.Domain;
using swp391_be.API.Models.Enum;
using swp391_be.API.Security;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace swp391_be.API.Repositories.Tokens
{
    public class SQLTokenRepository : ITokenRepository
    {
        private readonly IConfiguration _configuration;
        private readonly UserManager<User> _userManager;
        private readonly DBUtils dbContext;

        public SQLTokenRepository(IConfiguration _configuration, DBUtils dbContext, UserManager<User> _userManager)
        {
            this._configuration = _configuration;
            this.dbContext = dbContext;
            this._userManager = _userManager;
        }

        public async Task<bool> CheckConfimationEmailToken(string token)
        {
            var userToken = await dbContext.UserTokens.FirstOrDefaultAsync(t =>
                                        t.LoginProvider == ConfirmAction.CONFIRM &&
                                        t.Name == ConfirmAction.CONFIRM &&
                                        t.Value == token);

            if (userToken != null)
            {
                string emailConfirmationToken = userToken.Value;

                dbContext.UserTokens.Remove(userToken);
                await _userManager.Users.Where(x => x.Id == userToken.UserId).ExecuteUpdateAsync(property => property.SetProperty(x => x.EmailConfirmed, true));
                await dbContext.SaveChangesAsync();
                return true;

            }

            return false;
        }

        public string CreateJwtToken(User user, List<string> roles)
        {
            var claims = new List<Claim>();
            claims.Add(new Claim(ClaimTypes.Sid, user.Id));
            claims.Add(new Claim(ClaimTypes.Email, user.Email));

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));

            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _configuration["Jwt:Issuer"],
                _configuration["Jwt:Audience"],
                claims,
                null,
                DateTime.Now.AddMinutes(15),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}

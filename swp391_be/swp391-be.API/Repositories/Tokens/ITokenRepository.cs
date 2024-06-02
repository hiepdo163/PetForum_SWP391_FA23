using Microsoft.AspNetCore.Identity;
using swp391_be.API.Models.Domain;

namespace swp391_be.API.Repositories.Tokens
{
    public interface ITokenRepository
    {
        string CreateJwtToken(User user, List<string> roles);

        Task<bool> CheckConfimationEmailToken(string token);
    }
}

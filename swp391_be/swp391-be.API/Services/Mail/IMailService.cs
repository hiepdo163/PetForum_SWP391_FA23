using swp391_be.API.Models.Domain;

namespace swp391_be.API.Services.Mail
{
    public interface IMailService
    {
        public Task SendEmailConfirm(User user, string token,string action);
    }
}

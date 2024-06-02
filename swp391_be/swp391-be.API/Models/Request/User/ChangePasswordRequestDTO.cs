namespace swp391_be.API.Models.Request.User
{
    public class ChangePasswordRequestDTO
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public string NewPassword { get; set; }
    }
}

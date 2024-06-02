using System.ComponentModel.DataAnnotations;

namespace swp391_be.API.Models.Request.Authenticate
{
    public class SignInUserRequestDTO
    {
        [Required]
        [DataType(DataType.EmailAddress, ErrorMessage = "Please input a right email address")]
        public string EmailAddress { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}

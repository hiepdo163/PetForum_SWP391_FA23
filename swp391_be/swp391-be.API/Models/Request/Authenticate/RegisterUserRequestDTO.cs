using System.ComponentModel.DataAnnotations;

namespace swp391_be.API.Models.Request.Authenticate
{
    public class RegisterUserRequestDTO
    {
        [Required(ErrorMessage = "First name is required"), MinLength(2), MaxLength(30)]
        public string FirstName { get; set; }
        [Required(ErrorMessage = "Last name is required"), MinLength(2), MaxLength(30)]
        public string LastName { get; set; }
        [Required(ErrorMessage = "Phone number is required")]
        [DataType(DataType.PhoneNumber, ErrorMessage = "Please input a right phone number")]
        public string PhoneNumber { get; set; }
        [Required]
        [DataType(DataType.EmailAddress, ErrorMessage = "Please input a right email address")]
        public string EmailAddress { get; set; }
        [Required]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}

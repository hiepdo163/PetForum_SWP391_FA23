namespace swp391_be.API.Models.Response.User
{
    public class ProfileResponseDTO
    {
        public string id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string PhoneNumber { get; set; }
        public string Email { get; set; }
        public Boolean? Gender { get; set; }
        public string? Bio { get; set; }
        public String? ImageUrl { get; set; } = null;
        public List<string>? Roles { get; set; }
    }
}

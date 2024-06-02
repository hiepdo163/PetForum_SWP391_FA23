using swp391_be.API.Models.Domain;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using swp391_be.API.Models.Enum;

namespace swp391_be.API.Models.Response.TradingPost
{
    public class TradingPostDetailsResponseDTO
    {
        public Guid Id { get; set; }
        public CategoryPostDetailsResponseDTO Category { get; set; }
        public PostSellerResponseDTO User { get; set; }
        public string Title { get; set; }
        public PetAge Age { get; set; }
        public string Location { get; set; }
        public Double Price { get; set; }
        public string Description { get; set; }
        public DateTime? PublicDate { get; set; }
        public bool IsFree { get; set; }
        public List<string> ImageUrls { get; set; }
        public bool IsSold { get; set; }
        public bool IsAccepted { get; set; }
    }

    public class CategoryPostDetailsResponseDTO
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
    }

    public class PostSellerResponseDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string? ImgUrl { get; set; }
        public MemberShipRankingPoint Rank { get; set; }
        public string? Email { get; set; }
        public string? Phone { get; set; }
    }
}

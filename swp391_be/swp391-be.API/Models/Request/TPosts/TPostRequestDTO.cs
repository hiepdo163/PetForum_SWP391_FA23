using swp391_be.API.Models.Domain;
using swp391_be.API.Models.Enum;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace swp391_be.API.Models.Request.TPosts
{
    public class TPostRequestDTO
    {
        public string UserId { get; set; }
        public Guid CategoryId { get; set; }
        public string Title { get; set; }
        public PetAge Age { get; set; }
        public string Location { get; set; }
        public Double Price { get; set; }
        public string Description { get; set; }
        public bool IsFree { get; set; }
        public List<string> Urls { get; set; }
    }
    public class TradingPostImage
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid TradingPostId { get; set; }
        public string Url { get; set; }
    }
}

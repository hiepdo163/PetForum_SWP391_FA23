using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace swp391_be.API.Models.Domain
{
    public class TPost_ImageUrl
    {
        [Key]
        public Guid Id { get; set; }
        [ForeignKey("TradingPostId")]
        public Guid TradingPostId { get; set; }
        public TradingPost TradingPost { get; set; }
        public string Url { get; set; }
    }
}

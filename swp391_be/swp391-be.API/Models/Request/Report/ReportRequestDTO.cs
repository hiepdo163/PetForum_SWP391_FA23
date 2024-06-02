namespace swp391_be.API.Models.Request.Report
{
    public class ReportRequestDTO
    {
        public string UserId { get; set; }
        public Guid PostId { get; set; }
        public string Reason { get; set; }
    }
}

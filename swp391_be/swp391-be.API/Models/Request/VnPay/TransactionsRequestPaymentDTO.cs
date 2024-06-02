namespace swp391_be.API.Models.Request.VnPay
{
    public class TransactionsRequestPaymentDTO
    {
        public Guid UserId { get; set; }
        public int Amount { get; set; }
    }
}

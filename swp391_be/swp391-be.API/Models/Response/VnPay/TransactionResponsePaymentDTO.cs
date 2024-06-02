namespace swp391_be.API.Models.Response.VnPay
{
    public class TransactionResponsePaymentDTO
    {
        public Guid UserId { get; set; }
        public int Amount { get; set; }
        public bool Success { get; set; }
        public string OrderDescription { get; set; }
        public string TransactionId { get; set; }
        public string OrderId { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentId { get; set; }
        public string Token { get; set; }
        public string VnPayResponseCode { get; set; }
    }
}
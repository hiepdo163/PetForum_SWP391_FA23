using swp391_be.API.Models.Request.VnPay;
using swp391_be.API.Models.Response.VnPay;

namespace swp391_be.API.Services.VnPay
{
    public interface IVnPayService
    {
        public string CreatePaymentUrl(TransactionsRequestPaymentDTO model, HttpContext context);
        public TransactionResponsePaymentDTO PaymentExecute(IQueryCollection collections);
    }
}

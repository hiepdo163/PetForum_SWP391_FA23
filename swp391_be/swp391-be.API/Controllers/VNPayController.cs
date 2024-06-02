using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using swp391_be.API.Models.Request.VnPay;
using swp391_be.API.Services.VnPay;
using Microsoft.AspNetCore.Http;
using swp391_be.API.Data;
using swp391_be.API.Models.Response.MemberShip_Transaction;
using AutoMapper;
using swp391_be.API.Models.Domain;
using swp391_be.API.Models.Enum;
using Microsoft.EntityFrameworkCore;

namespace swp391_be.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class VNPayController : ControllerBase
    {
        private readonly IVnPayService _vnPayService;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly DBUtils _context;
        private readonly IMapper _mapper;

        public VNPayController(IVnPayService _vnPayService, IHttpContextAccessor httpContextAccessor, DBUtils _context, IMapper _mapper)
        {
            this._vnPayService = _vnPayService;
            _httpContextAccessor = httpContextAccessor;
            this._context = _context;
            this._mapper = _mapper;
        }

        [HttpPost]
        public IActionResult CreatePaymentUrl(TransactionsRequestPaymentDTO model)
        {
            var existingUser = _context.Users.FirstOrDefault(x => x.Id == model.UserId.ToString());
            if (existingUser == null)
            {
                return BadRequest(new
                {
                    success = false,
                    error = "This user doesn't exist"
                });
            }

            var url = _vnPayService.CreatePaymentUrl(model, _httpContextAccessor.HttpContext);

            return Ok(url);
        }

        [HttpGet]
        [Route("response")]
        public async Task<IActionResult> PaymentCallback()
        {
            var response = _vnPayService.PaymentExecute(Request.Query);
            if (response.Success == true && response.VnPayResponseCode == "00")
            {
                var existingUser = await _context.Users.Where(user => user.Id == response.UserId.ToString()).FirstOrDefaultAsync();
                if(existingUser == null)
                {
                    return BadRequest(new
                    {
                        success = false,
                        error = "This user id doesn't exist"
                    });
                }

                var numberOfIncreaseUploadQuantity = MemberShipPaymentTypeConvert(response.Amount/100);
                if(numberOfIncreaseUploadQuantity <= 0)
                {
                    return BadRequest(new
                    {
                        success = false,
                        error = "The increasing number doesn't fit with condition"
                    });
                }

                var memberShipTransaction = new MemberShipTransactionResponseDTO
                {
                    UserId = response.UserId.ToString(),
                    Amount = response.Amount/100,
                };
                var memberShipDomainModel = _mapper.Map<MemberShip_Transaction>(memberShipTransaction);
                await _context.MemberShip_Transactions.AddAsync(memberShipDomainModel);

                var result = await _context.Users.Where(user => user.Id == response.UserId.ToString())
                    .ExecuteUpdateAsync(property =>
                            property.SetProperty(user => user.RemainingPostUploadQuantity, user => user.RemainingPostUploadQuantity + numberOfIncreaseUploadQuantity)
                                    .SetProperty(user => user.MemberShipScore, user => user.MemberShipScore + (int)MemberShipScoreWithPaymentTypeConvert(numberOfIncreaseUploadQuantity)));
                if(result <= 0)
                {
                        return BadRequest(new
                        {
                            success = false,
                            error = "Failed to update into database"
                        });
                }

                await _context.SaveChangesAsync();
                return Redirect($"http://localhost:3000/membership/purchase?vnp_OrderInfo={response.UserId}&vnp_Amount={response.Amount}&vnp_ResponseCode={response.VnPayResponseCode}");
            }

            return BadRequest(response);
        }

        private int MemberShipPaymentTypeConvert(int amount)
        {
            if (amount == (int)MemberShipPaymentType.UPLOAD_AMOUNT_10)
                return 10;
            if (amount == (int)MemberShipPaymentType.UPLOAD_AMOUNT_30)
                return 30;
            if (amount == (int)MemberShipPaymentType.UPLOAD_AMOUNT_60)
                return 50;

            return 0;
        }

        private MemberShipScoreWithPaymentType MemberShipScoreWithPaymentTypeConvert(int amount)
        {
            if (amount == (int)MemberShipPaymentType.UPLOAD_AMOUNT_10)
                return MemberShipScoreWithPaymentType.UPLOAD_AMOUNT_10;
            if (amount == (int)MemberShipPaymentType.UPLOAD_AMOUNT_30)
                return MemberShipScoreWithPaymentType.UPLOAD_AMOUNT_30;
            if (amount == (int)MemberShipPaymentType.UPLOAD_AMOUNT_60)
                return MemberShipScoreWithPaymentType.UPLOAD_AMOUNT_60;
            return MemberShipScoreWithPaymentType.OTHER;
        }
    }
}

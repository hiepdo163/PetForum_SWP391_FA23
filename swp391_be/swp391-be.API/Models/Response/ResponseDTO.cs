using System.Net;

namespace swp391_be.API.Models.Response
{
    public class ResponseDTO<T>
    {
        public Boolean IsSuccess { get; set; }
        public HttpStatusCode StatusCode { get; set; }
        public string Message { get; set; }
        public T? Data { get; set; }
    }
}

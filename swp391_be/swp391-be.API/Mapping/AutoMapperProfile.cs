using AutoMapper;
using swp391_be.API.Models.Domain;
using swp391_be.API.Models.Request.Category;
using swp391_be.API.Models.Request.Comment;
using swp391_be.API.Models.Request.Post;
using swp391_be.API.Models.Request.Vote;
using swp391_be.API.Models.Request.TPosts;
using swp391_be.API.Models.Response.MemberShip_Transaction;
using swp391_be.API.Models.Response.User;

namespace swp391_be.API.Mapping
{
    public class AutoMapperProfile : Profile
    {
        public AutoMapperProfile()
        {
            //User Map
            CreateMap<User,ProfileResponseDTO>().ReverseMap();

            //Comment Map
            CreateMap<AddCommentRequestDTO, Comment>().ReverseMap();
            CreateMap<UpdateCommentRequestDTO, Comment>().ReverseMap();

            //Category Map
            CreateMap<AddCategoryRequestDTO, Category>().ReverseMap();


            //Post Map
            CreateMap<PostRequestDTO,Post>().ReverseMap();

            //Vote Map
            CreateMap<VoteDTO,Vote>().ReverseMap();

            //Trading post map
            CreateMap<TPostRequestDTO, TradingPost>().ReverseMap();
            CreateMap<TradingPostImage, TPost_ImageUrl>().ReverseMap();

            //Membership transaction
            CreateMap<MemberShipTransactionResponseDTO,MemberShip_Transaction>().ReverseMap();
        }

    }
}

using swp391_be.API.Data;
using swp391_be.API.Models.Domain;

namespace swp391_be.API.Repositories.Comments
{
    public interface ICommentRepository
    {
        public Task<Comment?> CreateAsync(Comment comment);

        public Task<Comment?> DeleteAsync(Comment comment);
    }
}

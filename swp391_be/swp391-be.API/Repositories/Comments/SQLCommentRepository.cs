using Microsoft.EntityFrameworkCore;
using swp391_be.API.Data;
using swp391_be.API.Models.Domain;

namespace swp391_be.API.Repositories.Comments
{
    public class SQLCommentRepository : ICommentRepository
    {
        private readonly DBUtils _db;
        public SQLCommentRepository(DBUtils _db)
        {
            this._db = _db;
        }
        public async Task<Comment?> CreateAsync(Comment comment)
        {
            try
            {
                await _db.Comments.AddAsync(comment);
                await _db.SaveChangesAsync();
                return comment;
            }
            catch (Exception ex)
            {

            }
            return null;
        }

        public async Task<Comment?> DeleteAsync(Comment comment)
        {
            var childComment = comment.ChildComments.ToList();
            try
            {
                if(childComment.Count > 0)
                {
                    foreach (var commentDomainModel in childComment)
                    {
                        _db.Comments.Remove(commentDomainModel);
                    }
                }
                _db.Comments.Remove(comment);
                await _db.SaveChangesAsync();
                return comment;
            }
            catch (Exception ex)
            {
                return null;
            }
        }

    }
}

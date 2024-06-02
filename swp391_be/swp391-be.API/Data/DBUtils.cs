using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using swp391_be.API.Models.Domain;
using System.Diagnostics;
using swp391_be.API.Models.Request.Post;

namespace swp391_be.API.Data
{
    public class DBUtils : IdentityDbContext<User>
    {
        public DBUtils()
        {
        }

        public DBUtils(DbContextOptions dbContextOptions) : base(dbContextOptions)
        { 

        }
        
        public DbSet<User> Users { get; set; }

        public DbSet<Vote> Votes { get; set; }

        public DbSet<Report> Report { get; set; }

        public DbSet<Category> Categories { get; set; }

        public DbSet<Comment> Comments { get; set; }
        public DbSet<Post> Post { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<TradingPost> TradingPosts { get; set; }
        public DbSet<MemberShip_Transaction> MemberShip_Transactions { get; set; }
        public DbSet<TPost_ImageUrl> Trading_Post_ImageUrls { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            builder.Entity<User>()
                .HasMany(u => u.Posts)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId);

            builder.Entity<User>()
                .HasMany(u => u.Memberships)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId);

            builder.Entity<Vote>(pv => pv.HasKey(pv => new { pv.UserId, pv.PostId }));

            builder.Entity<Vote>()
                .HasOne(u => u.User)
                .WithMany(p => p.Votes)
                .HasForeignKey(pv => pv.UserId);

            builder.Entity<Vote>()
                .HasOne(p => p.Post)
                .WithMany(u => u.Votes)
                .HasForeignKey(pv => pv.PostId);

            builder.Entity<Report>(r => r.HasKey(r => new { r.UserId, r.Id }));

            builder.Entity<Report>()
                .HasOne(u => u.User)
                .WithMany(r => r.Reports)
                .HasForeignKey(rh => rh.UserId);

            builder.Entity<Report>()
                .HasOne(r => r.Post)
                .WithMany(p => p.Reports);

            builder.Entity<Feedback>()
                .HasOne(f => f.TargetUser)
                .WithMany(u => u.Feedbacks)
                .HasForeignKey(f => f.TargetUserId);

            builder.Entity<Post>()
                .HasOne(c => c.Category)
                .WithMany(p => p.Posts)
                .HasForeignKey(c => c.CategoryId);

            builder.Entity<Category>()
                .HasMany(c => c.ChildCategories)
                .WithOne(c => c.ParentCategory)
                .HasForeignKey(c => c.ParentId);

            builder.Entity<Comment>()
                .HasOne(p => p.Post)
                .WithMany(c => c.Comments)
                .HasForeignKey(c => c.PostId);

            builder.Entity<Comment>()
                .HasOne(u => u.User)
                .WithMany(c => c.Comments)
                .HasForeignKey(u => u.UserId);

            builder.Entity<Comment>()
                .HasMany(c => c.ChildComments)
                .WithOne(c => c.ParentComment)
                .HasForeignKey(c => c.ParentId);

            builder.Entity<TradingPost>()
                .HasOne(u => u.User)
                .WithMany(t => t.TradingPosts)
                .HasForeignKey(t => t.UserId);

            builder.Entity<TradingPost>()
                .HasMany(post => post.ImageUrls)
                .WithOne(Image => Image.TradingPost)
                .HasForeignKey(k => k.TradingPostId);

            builder.Entity<IdentityRole>().HasData(new IdentityRole
            {
                Id = "b2fd82de-54b7-41dd-893f-429b49b4d457",
                Name = swp391_be.API.Models.Enum.Roles.ADMIN,
                NormalizedName = swp391_be.API.Models.Enum.Roles.ADMIN.ToUpper(),
                ConcurrencyStamp = swp391_be.API.Models.Enum.Roles.ADMIN.ToLower()
            }, new IdentityRole
            {
                Id = "c49f26d6-ef12-46bc-a746-0d4187274688",
                Name = swp391_be.API.Models.Enum.Roles.STAFF,
                NormalizedName = swp391_be.API.Models.Enum.Roles.STAFF.ToUpper(),
                ConcurrencyStamp = swp391_be.API.Models.Enum.Roles.STAFF.ToLower()
            }, new IdentityRole
            {
                Id = "5849968f-0561-41b5-a8de-3fe1966344a9",
                Name = swp391_be.API.Models.Enum.Roles.MEMBER,
                NormalizedName = swp391_be.API.Models.Enum.Roles.MEMBER.ToUpper(),
                ConcurrencyStamp = swp391_be.API.Models.Enum.Roles.MEMBER.ToLower()
            });
        }
    }
}

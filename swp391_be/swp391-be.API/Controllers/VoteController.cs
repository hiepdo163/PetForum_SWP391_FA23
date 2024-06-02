using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using swp391_be.API.Data;
using swp391_be.API.Models.Domain;
using swp391_be.API.Models.Request.Vote;
using System.Collections.Generic;

[Route("api/[controller]")]
[ApiController]
public class VoteController : ControllerBase
{
    private readonly DBUtils _db;
    private readonly IMapper _mapper;


    public VoteController(DBUtils _db, IMapper _mapper)
    {
        this._db = _db;
        this._mapper = _mapper;
    }
    [HttpPost]
    public async Task<IActionResult> ToggleVote([FromBody] VoteDTO vote)
    {
        if (string.IsNullOrEmpty(vote.PostId.ToString()) || string.IsNullOrEmpty(vote.UserId))
        {
            return BadRequest(new
            {
                succeeded = false,
                errors = new[] { "PostId or UserId can't null" }
            });
        }

        var userVote = await _db.Votes.FirstOrDefaultAsync(x => x.UserId == vote.UserId && x.PostId == vote.PostId);

        if (userVote != null)
        {
            try
            {
                _db.Votes.Remove(userVote);
                await _db.SaveChangesAsync();
                return Ok("Voting was removed successfully");
            }
            catch (Exception ex)
            {
                return BadRequest("Failed to remove vote");
            }
        }
        else
        {
            var userDomainModel = _mapper.Map<Vote>(vote);
            try
            {
                _db.Votes.Add(userDomainModel);
                await _db.SaveChangesAsync();
                return Ok("Vote was successful");
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    errors = new[] { "Failed to voting", ex.Message }
                });
            }
        }
    }

    [HttpGet("{postId}")]
    public async Task<IActionResult> GetVoteCount(Guid postId)
    {
        try
        {
            var voteCount = await _db.Votes.CountAsync(x => x.PostId == postId);
            return Ok(new { count = voteCount });
        }
        catch (Exception ex)
        {
            return BadRequest(new
            {
                errors = new[] { "Failed to get vote count", ex.Message }
            });
        }
    }

}
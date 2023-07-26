using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore.Metadata.Conventions;

namespace API.Controllers
{
    public class LikesController : BaseApiController
    {
        private readonly IUserRepository _userRepository;
        private readonly ILikesRepository _likesRepository;

        public LikesController(IUserRepository userRepository, ILikesRepository likesRepository)
        {
            _userRepository = userRepository;
            _likesRepository = likesRepository;
        }

        [HttpPost("{username}")]
        public async Task<ActionResult> AddLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var targetUser = await _userRepository.GetUserByUsernameAsync(username);
            var sourceUser = await _likesRepository.GetUserWithLikes(sourceUserId);

            if (targetUser == null) return NotFound();

            if (sourceUser == null) return BadRequest("You cannot like yourself.");

            var userLike = await _likesRepository.GetUserLike(sourceUserId, targetUser.Id);

            if (userLike != null) return BadRequest("You already like this user.");

            userLike = new UserLike
            {
                SourceUserId = sourceUserId,
                TargetUserId = targetUser.Id
            };

            sourceUser.LikedUsers.Add(userLike);

            if (await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to like user.");
        }

        [HttpDelete("delete/{username}")]
        public async Task<ActionResult> DeleteLike(string username)
        {
            var sourceUserId = User.GetUserId();
            var targetUser = await _userRepository.GetUserByUsernameAsync(username);
            var sourceUser = await _likesRepository.GetUserWithLikes(sourceUserId);

            if (targetUser == null) return NotFound();

            if (sourceUser == null) return BadRequest("You cannot unlike yourself.");

            var userLike = await _likesRepository.GetUserLike(sourceUserId, targetUser.Id);

            if (userLike == null) return BadRequest("You cannot unlike this user.");

            sourceUser.LikedUsers.Remove(userLike);

            if (await _userRepository.SaveAllAsync()) return Ok();

            return BadRequest("Failed to unlike user.");
        }

        [HttpGet]
        public async Task<ActionResult<PagedList<LikeDto>>> GetUserLikes([FromQuery] LikesParams likesParams)
        {
            likesParams.UserId = User.GetUserId();

            var users = await _likesRepository.GetUserLikes(likesParams);

            Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, users.PageSize, users.TotalCount, users.TotalPages));

            return Ok(users);
        }
    }
}

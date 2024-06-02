using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.DotNet.Scaffolding.Shared.CodeModifier.CodeChange;
using Microsoft.EntityFrameworkCore;
using NuGet.Common;
using Org.BouncyCastle.Ocsp;
using swp391_be.API.Data;
using swp391_be.API.Models.Domain;
using swp391_be.API.Models.DTO;
using swp391_be.API.Models.Enum;
using swp391_be.API.Models.Request.Authenticate;
using swp391_be.API.Models.Request.User;
using swp391_be.API.Models.Response.Jwt;
using swp391_be.API.Repositories.Tokens;
using swp391_be.API.Security;
using swp391_be.API.Services.Mail;
using swp391_be.API.Services.Token;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace swp391_be.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticateController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly ITokenRepository _tokenRepository;
        private readonly IMailService _mailService;
        private readonly ICheckToken _checkTokenService;
        private readonly DBUtils _dbContext;

        public AuthenticateController(
            UserManager<User> userManager,
            ITokenRepository tokenRepository,
            IMailService mailService,
            ICheckToken checkTokenService,
            DBUtils dbContext)
        {
            _userManager = userManager;
            _tokenRepository = tokenRepository;
            _mailService = mailService;
            _checkTokenService = checkTokenService;
            _dbContext = dbContext;
        }

        [HttpPost]
        [Route("Register")]
        public async Task<IActionResult> RegisterAsync([FromBody] RegisterUserRequestDTO registerUserRequestDTO)
        {
            Thread.Sleep(1000);
            var existingUser = await _userManager.FindByEmailAsync(registerUserRequestDTO.EmailAddress);
            if (existingUser != null)
            {
                return BadRequest(new { succeeded = false, errors = "Email already exists." });
            }

            var identityUser = CreateUserFromRequest(registerUserRequestDTO);
            var identityResult = await _userManager.CreateAsync(identityUser, registerUserRequestDTO.Password);

            if (!identityResult.Succeeded)
            {
                return BadRequest(identityResult);
            }

            identityResult = await _userManager.AddToRolesAsync(identityUser, new[] { Roles.MEMBER });

            if (!identityResult.Succeeded)
            {
                return BadRequest(identityResult);
            }

            var user = await _userManager.FindByEmailAsync(registerUserRequestDTO.EmailAddress);
            var confirmEmailToken = await GenerateConfirmEmailToken(user);

            if (confirmEmailToken == null)
            {
                return BadRequest(new { succeeded = false, errors = "Failed to generate email confirmation." });
            }

            await SaveUserToken(user, confirmEmailToken);
            await SendEmailConfirmation(user, confirmEmailToken);

            return Ok(new { succeeded = true, errors = "" });
        }

        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> LoginAsync([FromBody] SignInUserRequestDTO signInUserRequestDTO)
        {
            Thread.Sleep(1000);
            var user = await _userManager.FindByEmailAsync(signInUserRequestDTO.EmailAddress);
            if (user == null)
            {
                return BadRequest(new { succeeded = false, errors = "Email address doesn't exist." });
            }

            var checkPasswordResult = await _userManager.CheckPasswordAsync(user, signInUserRequestDTO.Password);
            if (!checkPasswordResult)
            {
                return BadRequest(new { succeeded = false, errors = "Password is incorrect." });
            }

            var isEmailConfirmed = await _userManager.IsEmailConfirmedAsync(user);
            if (!isEmailConfirmed)
            {
                var confirmEmailToken = await GenerateConfirmEmailToken(user);
                await SaveUserToken(user, confirmEmailToken);
                await SendEmailConfirmation(user, confirmEmailToken);

                return Unauthorized(new { succeeded = false, errors = "Please confirm your email." });
            }

            var isBanned = user.IsBanned;
            if (isBanned)
            {
                return BadRequest(new { succeeded = false, errors = "Your Account have been banned ." });
            }

            var roles = await _userManager.GetRolesAsync(user);
            if (roles == null)
            {
                return BadRequest(new { succeeded = false, errors = "This current user doesn't have a role." });
            }

            var identityUser = new User { Email = user.Email, Id = await _userManager.GetUserIdAsync(user) };
            var jwtToken = _tokenRepository.CreateJwtToken(identityUser, roles.ToList());

            if (jwtToken == null)
            {
                return BadRequest(new { succeeded = false, errors = "Failed to generate JWT token." });
            }

            return Ok(new JwtResponseDTo
            {
                Jwt = jwtToken,
                Role = roles[0],
                UserId = user.Id,
                UserEmail = user.Email
            });
        }

        [HttpPost]
        [Route("Confirm/Email")]
        public async Task<IActionResult> ConfirmationEmailAsync([FromBody] ConfirmEmailRequestDTO confirmEmailRequestDTO)
        {
            var domainToken = new TokenDecode(confirmEmailRequestDTO.Token);
            var isExpried = _checkTokenService.IsExpried(domainToken);
            if (isExpried)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = "This confirmation link have expried"
                });
            }

            var result = _tokenRepository.CheckConfimationEmailToken(domainToken.Value).Result;

            if (!result)
            {
                return BadRequest(new
                {
                    succeeded = false,
                    errors = "This confirmation link have expried"
                });
            }

            return Ok(result);
        }

        private User CreateUserFromRequest(RegisterUserRequestDTO registerUserRequestDTO)
        {
            return new User
            {
                UserName = registerUserRequestDTO.EmailAddress,
                Email = registerUserRequestDTO.EmailAddress,
                FirstName = registerUserRequestDTO.FirstName,
                LastName = registerUserRequestDTO.LastName,
                PhoneNumber = registerUserRequestDTO.PhoneNumber,
                EmailConfirmed = false
            };
        }

        private async Task<string> GenerateConfirmEmailToken(User user)
        {
            var confirmEmailToken = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            var userToken = await _dbContext.UserTokens.FirstOrDefaultAsync(t =>
                t.UserId == user.Id &&
                t.LoginProvider == ConfirmAction.CONFIRM &&
                t.Name == ConfirmAction.CONFIRM);

            if (userToken == null)
            {
                userToken = new IdentityUserToken<string>
                {
                    UserId = user.Id,
                    LoginProvider = ConfirmAction.CONFIRM,
                    Name = ConfirmAction.CONFIRM,
                    Value = ShieldGuardFtSHA256.EncodeToken(confirmEmailToken)
                };
                _dbContext.UserTokens.Add(userToken);
            }
            else
            {
                userToken.Value = ShieldGuardFtSHA256.EncodeToken(confirmEmailToken);
            }

            await _dbContext.SaveChangesAsync();

            return confirmEmailToken;
        }

        private async Task SaveUserToken(User user, string confirmEmailToken)
        {
            var userToken = await _dbContext.UserTokens.FirstOrDefaultAsync(t =>
                t.UserId == user.Id &&
                t.LoginProvider == ConfirmAction.CONFIRM &&
                t.Name == ConfirmAction.CONFIRM);

            if (userToken == null)
            {
                userToken = new IdentityUserToken<string>
                {
                    UserId = user.Id,
                    LoginProvider = ConfirmAction.CONFIRM,
                    Name = ConfirmAction.CONFIRM,
                    Value = ShieldGuardFtSHA256.EncodeToken(confirmEmailToken)
                };
                _dbContext.UserTokens.Add(userToken);
            }
            else
            {
                userToken.Value = ShieldGuardFtSHA256.EncodeToken(confirmEmailToken);
            }

            await _dbContext.SaveChangesAsync();
        }

        private async Task SendEmailConfirmation(User user, string confirmEmailToken)
        {
            try
            {
                _mailService.SendEmailConfirm(user, confirmEmailToken, EmailMessage.CONFIRM);
            }
            catch (Exception ex)
            {
                throw new Exception("Failed to send email confirmation.", ex);
            }
        }
    }
}
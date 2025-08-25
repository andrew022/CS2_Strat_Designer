using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace CS2_Strat_Designer.Server.Controllers
{
    [ApiController]
    [Route("auth")]
    public class SteamAuthController : Controller
    {
        [HttpGet("login")]
        public IActionResult Login()
        {
            return Challenge(new AuthenticationProperties
            {
                RedirectUri = "/auth/steam-callback"
            }, "Steam");
        }

        [HttpGet("steam-callback")]
        public IActionResult SteamCallback()
        {
            if (!User.Identity?.IsAuthenticated ?? false)
            {
                return Unauthorized("Login failed.");
            }

            var steamId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(steamId))
            {
                return BadRequest("Steam ID not found.");
            }

            var steamID = steamId.Split('/').Last(); // grabs steamid from url

            return Redirect($"https://localhost:52838/?steamid={Uri.EscapeDataString(steamID)}"); // redirects back to main page
        }
    }
}
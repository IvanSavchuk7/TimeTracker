using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using GraphQLParser;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using TimeTracker.Models;

namespace TimeTracker.Utils.Auth;

public class Authenticate
{
    private readonly IConfiguration _config;
    
    private readonly int _tokenExpiration = 120;
    public Authenticate(IConfiguration config)
    {
        _config = config;
    }
    
    public string GenerateToken(User user)
    {
        var claims = new List<Claim>()
        {
            new ("FirstName",user.FirstName),
            new (ClaimTypes.Email,user.Email),
            new ("LastName",user.LastName),
            new ("Id",user.Id.ToString()),
            new ("Permissions",Convert.ToInt32(user.Permissions).ToString()),
            new ("WorkType",user.WorkType.ToString()),
            new ("VacationDays",user.VacationDays.ToString()),
            new("IsTwoStepAuthEnabled",$"{user.IsTwoStepAuthEnabled}")
        };
        
        var key = Encoding.UTF8.GetBytes(_config["Jwt:Key"]!);
    
            
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddMinutes(_tokenExpiration),
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha512Signature)

        };
       
        var tokenHandler = new JwtSecurityTokenHandler();

        var token = tokenHandler.CreateToken(tokenDescriptor);
        
        return tokenHandler.WriteToken(token);
    }

    public RefreshToken GenerateRefreshToken()
    {
        return new RefreshToken
        {
            Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
            Expiration = DateTime.Now.AddYears(1)
        };
    }

    public string RefreshToken(User user)
    {
        return user.RefreshTokenExpiration < DateTime.Now ? "refresh token expires" : GenerateToken(user);
    }
}
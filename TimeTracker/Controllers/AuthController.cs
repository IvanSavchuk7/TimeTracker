using System.Net.Http.Headers;
using System.Text.Json.Nodes;
using Microsoft.AspNetCore.Mvc;
using TimeTracker.Utils.OAuth;


namespace TimeTracker.Controllers;

public class AuthController:Controller
{
    private readonly AuthFactory _authFactory;
    
    private  readonly HttpClient _httpClient = new();
    
    public AuthController(AuthFactory factory)
    {
        _authFactory = factory;
    }
    
    [HttpGet("to-external-auth")]
    public IActionResult RedirectToAuth(string authType)
    {

        var auth = _authFactory.GetInstance(authType);
        var redirectUrl = auth.GetRedirectUrl();
        return Redirect(redirectUrl);
    }
    
    [HttpPost("access-token")]
    public async Task<IActionResult> GetAccessToken(string code,string authType)
    {
        
        var auth = _authFactory.GetInstance(authType);
        
        
        _httpClient.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var accessTokenUrl = auth.GetAccessTokenUrl(code);
        var response = await _httpClient.PostAsync(accessTokenUrl,null);
        

        if (!response.IsSuccessStatusCode)
        {
            throw new Exception($"An error occured: {response.ReasonPhrase}, status:{response.StatusCode}");
        }

        var responseContent = await response.Content.ReadAsStringAsync();

        var json = JsonNode.Parse(responseContent);

        return Ok(json);
    }
    
}
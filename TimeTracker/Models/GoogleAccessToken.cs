namespace TimeTracker.Models;

public class GoogleAccessToken
{
    public string AccessToken { get; set; } = string.Empty;

    public string ExpiresIn { get; set; } = string.Empty;
    
    public string Scope { get; set; } = string.Empty;

    public string TokenType { get; set; } = string.Empty;
}
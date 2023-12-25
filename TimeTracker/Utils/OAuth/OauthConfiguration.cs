namespace TimeTracker.Utils.OAuth;

public class OauthConfiguration
{
    public string AuthApi { get; set; } = string.Empty;
    public string RedirectUrl { get; set; } = string.Empty;
    public string AppUrl { get; set; } = string.Empty;

    public string AccessTokenUrl { get; set; } = string.Empty;

    public  Dictionary<string, string> OptionalParameters { get; } = new ();

    public  Dictionary<string, string> OptionalAccessTokenUrlParameters { get; } = new();
}
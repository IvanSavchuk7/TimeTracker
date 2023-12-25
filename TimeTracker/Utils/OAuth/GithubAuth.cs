namespace TimeTracker.Utils.OAuth;

public class GithubAuth:OauthBase
{
    public GithubAuth(OauthConfiguration configuration,IConfiguration config) : base(configuration)
    {
        ClientId = config["Authentication:Github:ClientId"]!;
        ClientSecret = config["Authentication:Github:ClientSecret"]!;
    }

    public override string ClientId { get; }
    public override string ClientSecret { get; }
}
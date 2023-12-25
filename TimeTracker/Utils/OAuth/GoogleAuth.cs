namespace TimeTracker.Utils.OAuth;

public class GoogleAuth:OauthBase
{
    
    public GoogleAuth(OauthConfiguration configuration,IConfiguration config) : base(configuration)
    {
        ClientId = config["Authentication:Google:ClientId"]!;
        ClientSecret = config["Authentication:Google:ClientSecret"]!;
    }

    public override string ClientId { get; }
    public override string ClientSecret { get; }
}
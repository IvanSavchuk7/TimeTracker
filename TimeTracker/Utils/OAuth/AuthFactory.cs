namespace TimeTracker.Utils.OAuth;

public class AuthFactory
{

    private readonly IServiceProvider _services;

    private readonly Dictionary<string, OauthBase> _authInstances = new ();
    
    public AuthFactory(IServiceProvider serivices)
    {
        _services = serivices;
    }
    
    public OauthBase GetInstance(string authType)
    {
        if (_authInstances.TryGetValue(authType, out var instance))
        {
            return instance;
        }

        switch (authType)
        {
            case "google":
            {
                _authInstances[authType] = _services.GetRequiredService<GoogleAuth>();
                return _authInstances[authType];
            }
            case "github":
            {
                _authInstances[authType] = _services.GetRequiredService<GithubAuth>();
                return _authInstances[authType];
            }
            default: throw new Exception("This auth type not available");
        }

    }
    
}
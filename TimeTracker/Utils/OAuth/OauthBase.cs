using System.Text;

namespace TimeTracker.Utils.OAuth;

public abstract class OauthBase
{
    public OauthConfiguration Configuration { get; }

    public abstract string ClientId {get;}
	
    public abstract string ClientSecret {get;}
	 
    public OauthBase(OauthConfiguration configuration)
    {
        Configuration = configuration;
    }
	

    public string GetRedirectUrl()
    {
        
        var optionalParams = GetOptionalUrlParams(Configuration.OptionalParameters);
		
        return $"{Configuration.AuthApi}?redirect_uri={Configuration.AppUrl}/{Configuration.RedirectUrl}&client_id={ClientId}{optionalParams}";
    }

    public string GetAccessTokenUrl(string code)
    {
        var optionalParams = GetOptionalUrlParams(Configuration.OptionalAccessTokenUrlParameters);
        
        return $"{Configuration.AccessTokenUrl}?client_id={ClientId}&client_secret={ClientSecret}&code={code}{optionalParams}";
    }
    
    private string GetOptionalUrlParams(Dictionary<string,string> parameters)
    {
        var strBuilder = new StringBuilder();

        if (parameters.Count == 0)
        {
            return "";
        }

        foreach (var parameter in parameters)
        {
            strBuilder.Append($"&{parameter.Key}={parameter.Value}");
        }

        return strBuilder.ToString();
    }
}
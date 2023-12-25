using TimeTracker.Utils.OAuth;

namespace TimeTracker.Extensions;

public static class ServicesExtensions
{
    public static void AddGoogleAuth(this IServiceCollection collection,Func<OauthConfiguration,OauthConfiguration> config)
    {
        collection.AddScoped<GoogleAuth>(s =>
        {
            return new GoogleAuth(config(new OauthConfiguration()),s.GetRequiredService<IConfiguration>());
        });
    }

    public static void AddGithubAuth(this IServiceCollection collection,
        Func<OauthConfiguration, OauthConfiguration> config)
    {

        collection.AddScoped<GithubAuth>(s =>
        {
            return new GithubAuth(config(new OauthConfiguration()), s.GetRequiredService<IConfiguration>());
        });
    }
}
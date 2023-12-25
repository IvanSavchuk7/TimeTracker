
namespace TimeTracker.Utils.Environment;

public static class HostingEnvironmentExtensions
{
    private const string GraphQlEnvironment = "GraphQL";

    public static bool IsGraphQl(this IHostEnvironment hostingEnvironment)
    {
        return hostingEnvironment.IsEnvironment(GraphQlEnvironment);    
    }
}
using GraphQL.Types;
using TimeTracker.GraphQL.Types;
using TimeTracker.Models;
using TimeTracker.Utils.Filters;
using TimeTracker.Utils.Filters.ExpressionTypes;
using TimeTracker.Utils.Filters.ExpressionTypes.GraphTypes;


namespace TimeTracker.GraphQL.Schemes;

public class AppSchema:Schema
{
    public AppSchema(IServiceProvider provider):base(provider)
    {
        Query = provider.GetRequiredService<RootQuery>();
        Mutation = provider.GetRequiredService<RootMutation>();
    }
}
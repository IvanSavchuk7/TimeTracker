using GraphQL.Builders;
using GraphQL.Types;
using TimeTracker.Utils.Filters.ExpressionTypes.GraphTypes;


namespace TimeTracker.Utils.Filters;

public static class GraphQlBuilderExtensions
{
    public static FieldBuilder<T, V> UseFiltering<T, V>(this FieldBuilder<T, V> builder)
    {
        builder
            .Argument<WhereGraphType>("where",
                configure: c =>c.DefaultValue = null)
            .Argument<ListGraphType<WhereGraphType>>("group");

        return builder;
    }

    public static FieldBuilder<T, V>  UsePaging<T, V>(this FieldBuilder<T, V> builder)
    {
        builder.Argument<int>("take", nullable: true,configure:c=>c.DefaultValue=null)
            .Argument<int>("skip", nullable: true,configure:c=>c.DefaultValue=null);

        return builder;
    }

    public static FieldBuilder<T, V> UseOrdering<T,V>(this FieldBuilder<T, V> builder)
    {
        builder
            .Argument<OrderByGraphType>("orderBy")
            .Argument<ListGraphType<OrderByGraphType>>("orderGroup");
        
        return builder;
    }
}



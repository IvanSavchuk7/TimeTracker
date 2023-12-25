using GraphQL.Types;

namespace TimeTracker.Utils.Filters.ExpressionTypes.GraphTypes;

public sealed class OrderByGraphType:InputObjectGraphType<OrderByExpression>
{
    public OrderByGraphType()
    {
        Field(x => x.PropertyName).Name("property");
        
        Field(x => x.Direction);
        
        Field(x => x.CompareValue,nullable:true).Name("value");
    }
}
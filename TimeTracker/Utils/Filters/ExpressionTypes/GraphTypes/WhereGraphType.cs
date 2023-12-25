using GraphQL.Types;

namespace TimeTracker.Utils.Filters.ExpressionTypes.GraphTypes;

public sealed class WhereGraphType : InputObjectGraphType<WhereExpression>
{
    public WhereGraphType()
    {
        
        Field(x => x.PropertyName).Name("property");
        Field(x => x.Operator).Name("operator");
        Field(x => x.CompareValue).Name("value");
        Field(x => x.Connector,nullable:true)
            .DefaultValue(null)
            .Name("connector");
    }
}

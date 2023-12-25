namespace TimeTracker.Utils.Filters.ExpressionTypes;

public class WhereExpression:BaseExpression
{
    public string Operator { get; set; } = string.Empty;
    
    public override string CompareValue { get; set; } = string.Empty;

    public string Connector { get; set; } = string.Empty;
 
}
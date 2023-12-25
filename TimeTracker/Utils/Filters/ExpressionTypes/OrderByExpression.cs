namespace TimeTracker.Utils.Filters.ExpressionTypes;

public class OrderByExpression:BaseExpression
{
    public string Direction { get; set; }=string.Empty;
    
    public override string? CompareValue { get; set; }
}
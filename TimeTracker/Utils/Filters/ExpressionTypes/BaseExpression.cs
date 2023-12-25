namespace TimeTracker.Utils.Filters.ExpressionTypes;

public abstract class BaseExpression
{
    public abstract string CompareValue { get; set; }

    public string PropertyName { get; set; } = string.Empty;
}
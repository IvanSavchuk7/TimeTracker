using System.Linq.Expressions;

namespace TimeTracker.Utils.Filters;

public class ParameterReplacer : ExpressionVisitor
{
    private readonly ParameterExpression _parameter;
    private readonly Expression _replacement;

    public ParameterReplacer(ParameterExpression parameter, Expression replacement)
    {
        _parameter = parameter ?? throw new ArgumentNullException(nameof(parameter));
        _replacement = replacement ?? throw new ArgumentNullException(nameof(replacement));
    }

    protected override Expression VisitParameter(ParameterExpression node)
    {
        return node == _parameter ? _replacement : base.VisitParameter(node);
    }
}

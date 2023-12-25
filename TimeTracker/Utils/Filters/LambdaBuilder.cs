using System.Linq.Expressions;
using Microsoft.IdentityModel.Tokens;
using TimeTracker.Utils.Filters.ExpressionTypes;

namespace TimeTracker.Utils.Filters;

public class LambdaBuilder
{
  

    public static Expression<Func<T, bool>> BuildLambda<T>(BaseExpression expression,string oprt,ParameterExpression parameter)
    {
        Expression body = null;
        var props = expression.PropertyName.Split
            (new char[] { '.' }, StringSplitOptions.RemoveEmptyEntries);
        
        MemberExpression property = Expression.Property(parameter, props[0]);
        
        for(var i=1;i<props.Length;i++)
        {
           property = Expression.Property(property, props[i]);
        }

        
        var converted = EntityFiledTypeConverter.ConvertToFieldType(property.Type,expression.CompareValue,oprt);
        var constant =Expression.Constant(converted);

        body = ApplyOperator(oprt,property, constant);

        return Expression.Lambda<Func<T, bool>>(body!, parameter);
    }
    public static ConstantExpression GetConvertedConstantExpression<T>(string propertyName,string compareValue)
    {
        var converted = EntityFiledTypeConverter.ConvertToFieldType<T>(propertyName, compareValue);
        
        return Expression.Constant(converted);
    }

    private static Expression ApplyOperator(string oprt,MemberExpression property, ConstantExpression constant)
    {
        
        
        switch (oprt)
        {
            case "eq":return Expression.Equal(property, constant);
            case "leq": return Expression.LessThanOrEqual(property, constant);
            case "geq": return Expression.GreaterThanOrEqual(property, constant);
            case "neq":return Expression.NotEqual(property, constant);
            case "gt":return Expression.GreaterThan(property, constant);
            case "contains":
            {
                var method = typeof(string).GetMethod("Contains",new[] { typeof(string) });
                
                if (property.Type != typeof(DateTime))
                {
                    return Expression.Call(property, method, constant);
                }
                var toString = typeof(object).GetMethod("ToString");
                return Expression.Call(Expression.Call(property, toString), method, constant);
            }
            case "lt":return Expression.LessThan(property, constant);
            default: throw new Exception("operator not specified");
        }

    }
}
using System.Linq.Expressions;
using System.Reflection;
using GraphQL;
using TimeTracker.Utils.Filters.ExpressionTypes;

namespace TimeTracker.Utils.Filters;

public static class IQueryableExtensions
{
    public static IQueryable<T> ApplyGroupFilters<T>(this IQueryable<T> q,List<WhereExpression> groupExpression)
    {
        var parameter = Expression.Parameter(typeof(T), "f");
        
        var combinedExpression = LambdaBuilder.BuildLambda<T>(groupExpression[0],
            groupExpression[0].Operator, parameter);

        foreach (var exp in groupExpression.Skip(1))
        {
            var lambda = LambdaBuilder.BuildLambda<T>(exp, exp.Operator, parameter);
            
            if (exp.Connector == "")
            {
                continue;
            }

            var resultingExpression = exp.Connector switch
            {
                "and" => Expression.AndAlso(combinedExpression.Body, lambda.Body),
                "or" => Expression.Or(combinedExpression.Body, lambda.Body),
                _ => null
            };

            combinedExpression = Expression.Lambda<Func<T, bool>>(resultingExpression!, parameter);
        }


        return q.Where(combinedExpression!);
    }

    public static IQueryable<T> ApplyWhereFilter<T>(this IQueryable<T> q, WhereExpression expression)
    {
        var parameter = Expression.Parameter(typeof(T), "f");
        var lambda = LambdaBuilder.BuildLambda<T>(expression, expression.Operator, parameter);
        return q.Where(lambda);
    }

    public static IQueryable<T> ApplyGraphQlOrdering<T>(this IQueryable<T> q, OrderByExpression orderBy)
    {
        var parameter = Expression.Parameter(typeof(T), "f");
        
        Expression property = Expression.Property(parameter, orderBy.PropertyName);
        
        
        var lambda = orderBy.CompareValue==null?Expression.Lambda(property, parameter)
            :LambdaBuilder.BuildLambda<T>(orderBy,"eq",parameter);

        var propertyType = orderBy.CompareValue == null ? property.Type:typeof(bool);
     
        var orderedQuery = Expression.Call(
            typeof(Queryable),
            orderBy.Direction == "ASC" ? "OrderBy" : "OrderByDescending",
            new[] { typeof(T), propertyType },
            q.Expression,
            lambda
        );

        return q.Provider.CreateQuery<T>(orderedQuery);
    }


    public static IQueryable<T> ApplyGraphQlPaging<T>(this IQueryable<T> q, int take, int skip)
    {
        return q.Take(take).Skip(skip);
    }

    private static MethodCallExpression BuildOrderedQuery<T>(string methodName, OrderByExpression order,
        ParameterExpression parameter, Expression parameters)
    {
        var property = Expression.Property(parameter, order.PropertyName);

        var lambda = Expression.Lambda(property, parameter);

        return Expression.Call(
            typeof(Queryable),
            methodName,
            new[] { typeof(T), property.Type },
            parameters,
            Expression.Quote(lambda)
        );
    }


    public static IQueryable<T> ApplyGraphQlOrderingGroup<T>(this IQueryable<T> q, List<OrderByExpression> orderGroup)
    {
        var parameter = Expression.Parameter(typeof(T), "f");

        MethodInfo orderByMethod = null;
        MethodCallExpression? orderedQuery = null;
        if (orderGroup[0].Direction == "ASC")
        {
            orderedQuery = BuildOrderedQuery<T>("OrderBy", orderGroup[0], parameter, q.Expression);
        }
        else
        {
            orderedQuery = BuildOrderedQuery<T>("OrderByDescending", orderGroup[0], parameter, q.Expression);
        }


        foreach (var thenBy in orderGroup.Skip(1))
        {
            if (thenBy.Direction == "ASC")
            {
                orderedQuery = BuildOrderedQuery<T>("ThenBy", thenBy, parameter, orderedQuery);
            }
            else
            {
                orderedQuery = BuildOrderedQuery<T>("ThenByDescending", thenBy, parameter, orderedQuery);
            }
        }

        return q.Provider.CreateQuery<T>(orderedQuery);
    }
}
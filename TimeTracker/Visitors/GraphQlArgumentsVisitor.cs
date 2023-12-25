using GraphQL;
using TimeTracker.Utils.Filters;
using TimeTracker.Utils.Filters.ExpressionTypes;

namespace TimeTracker.Visitors;

public class GraphQlArgumentsVisitor:IGraphQlArgumentVisitor
{
    public IQueryable<TEntity> Visit<TEntity>(IQueryable<TEntity> entities,
        IResolveFieldContext context,bool withExtraInfo=true)
    {

        entities=VisitFiltering(entities,context);
        entities=VisitOrdering(entities,context);
        if (withExtraInfo)
        {
            var filteredCount = entities.Count();
            context.OutputExtensions.Add("count", filteredCount);
        }
        entities=VisitPaging(entities, context);
        return entities;
    }

    public IQueryable<TEntity> VisitFiltering<TEntity>(IQueryable<TEntity> entities, IResolveFieldContext context, bool withExtraInfo = true)
    {
        var expression = context.GetArgument<WhereExpression?>("where");
        var groupExpression = context.GetArgument<List<WhereExpression>?>("group");

        if (groupExpression != null && groupExpression.Any())
        {
            entities=entities.ApplyGroupFilters(groupExpression);
        }

        if (expression != null)
        {
            entities=entities.ApplyWhereFilter(expression);
        }

        return entities;
    }

    public IQueryable<TEntity> VisitOrdering<TEntity>(IQueryable<TEntity> entities, IResolveFieldContext context)
    {
        var orderBy = context.GetArgument<OrderByExpression?>("orderBy");
        var orderGroup = context.GetArgument<List<OrderByExpression>?>("orderGroup");
        if (orderBy != null)
        {
            entities=entities.ApplyGraphQlOrdering(orderBy);
        }

        if (orderGroup != null)
        {
            entities = entities.ApplyGraphQlOrderingGroup(orderGroup);
        }

        return entities;
    }

    public IQueryable<TEntity> VisitPaging<TEntity>(IQueryable<TEntity> entities, IResolveFieldContext context)
    {
        var take = context.GetArgument<int?>("take");
        var skip = context.GetArgument<int?>("skip");
        
        if (take != null)
        {
            skip ??= 0;
            entities=entities.ApplyGraphQlPaging((int)take, (int)skip);
        }

        return entities;
    }
}
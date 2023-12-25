using GraphQL;

namespace TimeTracker.Visitors;

public interface IGraphQlArgumentVisitor
{
    public IQueryable<TEntity> Visit<TEntity>(IQueryable<TEntity> entities,
        IResolveFieldContext context,bool withExtraInfo=true);
    
    public IQueryable<TEntity> VisitFiltering<TEntity>(IQueryable<TEntity> entities,
        IResolveFieldContext context,bool withExtraInfo=true);
    
    public IQueryable<TEntity> VisitOrdering<TEntity>(IQueryable<TEntity> entities,
        IResolveFieldContext context);
    
    public IQueryable<TEntity> VisitPaging<TEntity>(IQueryable<TEntity> entities,
        IResolveFieldContext context);
}
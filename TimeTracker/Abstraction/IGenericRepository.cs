using System.Linq.Expressions;

namespace TimeTracker.Absctration;

public interface IGenericRepository<TEntity> where TEntity:class
{
    public Task<IQueryable<TEntity>> GetAsync(Expression<Func<TEntity, bool>>? filter = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
        int? take=null,int? skip=null,string includeProperties="");

    public ValueTask<TEntity> CreateAsync(TEntity entity);
    
    public Task<TEntity?> FindAsync(Expression<Func<TEntity, bool>> func,
        string? relatedData = null,bool asNoTracking=false);

    public Task<bool> DeleteAsync(TEntity entity);

    public ValueTask<TEntity> UpdateAsync(TEntity entity);
    public ValueTask<bool> AddRangeAsync(IEnumerable<TEntity> entities);
    public ValueTask<int> GetRecordsCount();
}
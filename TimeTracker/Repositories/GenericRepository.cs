using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using TimeTracker.Absctration;
using TimeTracker.AppContext;

namespace TimeTracker.Repositories;

public class GenericRepository<TEntity> : IGenericRepository<TEntity> where TEntity:class
{
    private readonly DbSet<TEntity> _dbSet;

    private readonly TimeTrackerContext _context;
    
    public GenericRepository(TimeTrackerContext context)
    {
        _context = context;

        _dbSet = context.Set<TEntity>();
    }
    
    public async Task<IQueryable<TEntity>> GetAsync(Expression<Func<TEntity, bool>>? filter = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null, int? take = null, int? skip = null,
        string includeProperties = "")
    {
        IQueryable<TEntity> query = _dbSet;
        try
        {
            if (filter != null)
            {
                query = query.Where(filter);
            }
            foreach (var includeProperty in includeProperties.Split
                         (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProperty);
            }
            

            if (orderBy != null)
            {
                query = orderBy(query);
            }
            if (skip != null)
            {
                query = query.Skip((int)skip);
            }

            if (take != null)
            {
                query = query.Take((int)take);
            }
            
            return query;
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public ValueTask<TEntity> CreateAsync(TEntity entity)
    {
        try
        {
            var md = _dbSet.Add(entity);
            return new ValueTask<TEntity>(md.Entity);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public ValueTask<bool> AddRangeAsync(IEnumerable<TEntity> entities)
    {
        try
        {
            _dbSet.AddRange(entities);
            return new ValueTask<bool>(true);
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    

    public async Task<TEntity?> FindAsync(Expression<Func<TEntity, bool>> func, string? relatedData = null,
        bool asNoTracking=false)
    {
        try
        {
            IQueryable<TEntity> query = _dbSet;

            if (relatedData != null)
            {
                foreach (var includeProperty in relatedData.Split
                             (new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
                {
                    query = query.Include(includeProperty);
                }
            }

            if (asNoTracking)
            {
                query = query.AsNoTracking();
            }
            
            return await query.FirstOrDefaultAsync(func);
        }
        catch (Exception e)
        {
            throw new Exception(e.Message);
        }
    }

    public Task<bool> DeleteAsync(TEntity entity)
    {
        if (_context.Entry(entity).State == EntityState.Detached)
        {
            _dbSet.Attach(entity);
        }
        
        _dbSet.Remove(entity);
        return Task.FromResult(true);
    }

    public ValueTask<int> GetRecordsCount()
    {
        return new ValueTask<int>(_dbSet.Count());
    }
    public ValueTask<TEntity> UpdateAsync(TEntity model)
    {
        var entity = _dbSet.Update(model);
        _context.Entry(model).State = EntityState.Modified;
        return new ValueTask<TEntity>(entity.Entity);
    }
    
}
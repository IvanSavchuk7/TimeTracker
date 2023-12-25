using TimeTracker.Absctration;
using TimeTracker.AppContext;

namespace TimeTracker.Repositories;

public class UnitOfWorkRepository:IUnitOfWorkRepository, IDisposable
{
    private readonly TimeTrackerContext _context;

    private readonly IRepositoryFactory _factory;

    public UnitOfWorkRepository(IRepositoryFactory factory,TimeTrackerContext context)
    {
        _factory = factory;
        _context = context;
    }
    public IGenericRepository<T> GenericRepository<T>() where T : class
    {
        return _factory.Instance<T>(_context);
    }

    public Task SaveAsync()
    {
        try
        {
            return _context.SaveChangesAsync();
        }
        catch (Exception e)
        {
            Console.WriteLine(e);
            throw;
        }
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
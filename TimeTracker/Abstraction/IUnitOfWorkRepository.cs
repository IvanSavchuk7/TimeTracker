namespace TimeTracker.Absctration;

public interface IUnitOfWorkRepository
{
    public IGenericRepository<T> GenericRepository<T>() where T : class;

    public Task SaveAsync();
}
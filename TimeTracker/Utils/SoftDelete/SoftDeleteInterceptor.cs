using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace TimeTracker.Utils.SoftDelete;

public class SoftDeleteInterceptor:SaveChangesInterceptor
{
  

    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result,
        CancellationToken cancellationToken = new CancellationToken())
    {
        if (eventData.Context is null) return new ValueTask<InterceptionResult<int>>(result);
        
        foreach (var entry in eventData.Context.ChangeTracker.Entries())
        {
            if (entry is not { State: EntityState.Deleted, Entity: SoftDeleteBase delete }) continue;
            entry.State = EntityState.Modified;
            delete.IsDeleted = true;
            delete.DeletedAt = DateTime.Now;
        }

        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }
}
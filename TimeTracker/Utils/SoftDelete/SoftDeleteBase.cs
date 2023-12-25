namespace TimeTracker.Utils.SoftDelete;

public abstract class SoftDeleteBase:ISoftDelete
{
   
    public virtual void Undo()
    {
        IsDeleted = false;
        DeletedAt = null;
    }

    public bool IsDeleted { get; set; }
    public DateTime? DeletedAt { get; set; }
}
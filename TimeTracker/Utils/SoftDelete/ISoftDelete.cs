namespace TimeTracker.Utils.SoftDelete;

public interface ISoftDelete
{
    public bool IsDeleted { get; set; }
    
    public DateTime? DeletedAt { get; set; }
    
}


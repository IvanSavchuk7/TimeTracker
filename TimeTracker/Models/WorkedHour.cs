namespace TimeTracker.Models;

public class WorkedHour
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public User User { get; set; } = null!;

    public DateTime StartDate { get; set; }
    
    public DateTime EndDate { get; set; }
    
    public int TotalTime { get; set; }
}
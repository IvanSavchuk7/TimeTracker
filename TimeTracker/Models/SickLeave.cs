namespace TimeTracker.Models;

public class SickLeave
{
    public int Id { get; set; }
    
    public DateOnly StartDate { get; set; }
    
    public DateOnly EndDate { get; set; }
    
    public int UserId { get; set; }

    public User User { get; set; } = null!;
    public string? Message { get; set; } = string.Empty;
}
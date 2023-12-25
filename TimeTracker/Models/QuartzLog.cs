using TimeTracker.Enums;

namespace TimeTracker.Models;

public class QuartzLog
{
    public int Id { get; set; }
    public DateOnly Date { get; set; }
    
    public Log Type { get; set; }
    
    public string? Description { get; set; }
}
namespace TimeTracker.Models;

public class HoursWorked
{
    public string ActuallyWorked { get; set; }= string.Empty;

    public string ActuallyWorkedHours { get; set; } = string.Empty;
    public string NeedToWork { get; set; }= string.Empty;

    public string NeedToWorkToday { get; set; } = string.Empty;

    public string ActuallyWorkedToday { get; set; } = string.Empty;
}

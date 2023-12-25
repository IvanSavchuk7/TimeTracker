namespace TimeTracker.Models.Dtos;

public class WorkedHourUpdateDto
{
    public int Id { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }
    
    public int TotalTime { get; set; }
}
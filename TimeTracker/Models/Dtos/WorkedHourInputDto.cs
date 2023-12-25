namespace TimeTracker.Models.Dtos;

public class WorkedHourInputDto
{
    public int UserId { get; set; }

    public DateTime StartDate { get; set; }

    public DateTime EndDate { get; set; }
    
    public int TotalTime { get; set; }
}

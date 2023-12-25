namespace TimeTracker.Models.Dtos;

public class ApproverVacationUpdateDto
{
    public int ApproverId { get; set; }
    
    public int VacationId { get; set; }
    
    public bool IsApproved { get; set; }
    
    public string? Message { get; set; }
}
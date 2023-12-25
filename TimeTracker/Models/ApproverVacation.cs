using TimeTracker.Utils.SoftDelete;

namespace TimeTracker.Models;

public class ApproverVacation:SoftDeleteBase
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public User Approver { get; set; } = null!;

    public int VacationId { get; set; }

    public Vacation Vacation { get; set; } = null!;
    
    public bool? IsApproved { get; set; }

    public string? Message { get; set; } = string.Empty;
}
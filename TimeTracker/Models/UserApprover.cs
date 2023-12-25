using System.ComponentModel.DataAnnotations.Schema;

namespace TimeTracker.Models;

public class UserApprover
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    public User User { get; set; } = null!;

    public int ApproverId { get; set; }
    public User Approver { get; set; } = null!;
    
}
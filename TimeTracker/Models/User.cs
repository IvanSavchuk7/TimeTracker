using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TimeTracker.Enums;
using TimeTracker.Utils.SoftDelete;

namespace TimeTracker.Models;

public class User:SoftDeleteBase
{
    public int Id { get; set; }
    
    public static int FullTimeValue => 100;

    [Required] public string FirstName { get; set; } = string.Empty;
    
    [Required] public string LastName { get; set; } = string.Empty;
    
    [Required] public string Email { get; set; } = string.Empty;
    
    [Required] public string Password { get; set; } = string.Empty;
    
    [Required] public WorkType WorkType { get; set; }
    
    public bool? IsTwoStepAuthEnabled { get; set; }
    
    public string? PathId { get; set; }
    
    public string? PathSid { get; set; }
    
    public int AvailableVacationDays { get; set; }
    
    public string? RefreshToken { get; set; }
    
    public DateTime? RefreshTokenExpiration { get; set; }
    
    public bool IsEmailActivated { get; set; }
    
    [Column(TypeName = "int")]
    [EnumDataType(typeof(Permissions))]
    public Permissions Permissions { get; set; }
    
    public int HoursPerMonth { get; set; }
    public int VacationDays { get; set; }
    
    public DateOnly EmploymentDate { get; set; }
    
    public List<Vacation> Vacations { get; } = new();
    
    public List<UserApprover> Approvers { get; } = new();
    
    public List<UserApprover> Senders { get; } = new();

    public List<ApproverVacation> ApproverVacations { get; } = new();

    public List<WorkedHour> WorkedHours { get; } = new();

    public List<WorkPlan> WorkPlans { get; } = new();

    public List<SickLeave> SickLeaves { get; } = new();

    public User()
    {
        VacationDays = 30;
        IsDeleted = false;
        EmploymentDate = DateOnly.FromDateTime(DateTime.Now);
    }
}
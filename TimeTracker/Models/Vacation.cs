using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using TimeTracker.Enums;
using TimeTracker.Models.Dtos;
using TimeTracker.Utils.SoftDelete;


namespace TimeTracker.Models;

public class Vacation:SoftDeleteBase
{
    public int Id { get; set; }
     
    public int UserId { get; set; }

    public User User { get; set; } = null!;

    [Column(TypeName = "int")] public VacationState VacationState { get; set; }
    
    [Required]
    public DateTime StartDate { get; set; }

    public string Message { get; set; } = string.Empty;
    
    [Required]
    public DateTime EndDate { get; set; }
    
    public string? ApproverMessage { get; set; } 

    public List<ApproverVacation> ApproverVacations { get; set; } = new();


}
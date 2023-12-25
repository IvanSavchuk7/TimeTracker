using System.ComponentModel.DataAnnotations;
using TimeTracker.Enums;

namespace TimeTracker.Models.Dtos;

public class UserInputDto
{
     public string FirstName { get; set; } = string.Empty;
    
     public string LastName { get; set; } = string.Empty;
     
     public string Email { get; set; } = string.Empty;

     public int Permissions { get; set; }
     
     public int HoursPerMonth { get; set; }

     public int VacationDays { get; set; }
}
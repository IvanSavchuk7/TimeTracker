namespace TimeTracker.Models;

public class PasswordVerify
{
    public int Id { get; set; }

    public string Code { get; set; } = string.Empty;
    
    public DateTime RequestDate { get; set; }
    
    public bool IsRecovered { get; set; }
    
    public int UserId { get; set; }

    public User User { get; set; } = null!;
}
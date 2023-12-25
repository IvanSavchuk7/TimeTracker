using System.Text.RegularExpressions;

namespace TimeTracker.Utils.Email;

public class EmailValidation
{
    public static bool IsValidEmail(string email)
    {
        var reg = @"^[a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$";
            
        var regex = new Regex(reg);
        
        return regex.IsMatch(email);
    }
}
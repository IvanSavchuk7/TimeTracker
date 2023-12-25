using System.Net;
using System.Net.Mail;
using System.Text;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using TimeTracker.Absctration;
using TimeTracker.Models;

namespace TimeTracker.Utils.Email;

public class EmailService
{
    private readonly EmailTokenService _tokenService;
    
    private readonly IUnitOfWorkRepository _uow;
    
    private readonly EmailMessageBuilder _emailMessageBuilder;
    public EmailService(EmailTokenService tokenService, IUnitOfWorkRepository uow,EmailMessageBuilder emailMessageBuilder)
    {
        _tokenService = tokenService;
        _uow = uow;
        _emailMessageBuilder = emailMessageBuilder;
    }
  
    public void SendEmail(string to,string body,string subject)
    {
        _emailMessageBuilder
            .BuildEmailMessage(subject,body)
            .AddReceiver(to)
            .SendEmailMessage(isAsync:true);
    }
    

    public async Task SendAccountRegistrationAsync(int userId, string userEmail)
    {
        var confirmationLink = await _tokenService.GenerateUserEmailTokenAsync(userId);

        var body = $@"
        <div style='width: 100%; font-family: Arial, Helvetica, sans-serif;font-size:22px; margin: 40px auto; text-align:center;'>
            <h2 style='width:fit-content; margin: 15px auto;'>Your account is almost ready!</h2>
            <p style='width:fit-content; margin: 15px auto; '>Pass additional verification:</p>
            <a style='display:block; width:fit-content; margin: auto; padding:10px 15px; background-color:#8ecae6; border-radius:5px; text-decoration:none; color:#14213d;'
                href='https://timetrackerproject.azurewebsites.net/userVerify?verify={confirmationLink}'>Confirm</a>
        </div>";

        SendEmail(userEmail, body, "Account actions required.");
    }

    public async Task SendEmailConfirmationAsync(User user)
    {
        var confirmationLink = await _tokenService.GenerateUserEmailTokenAsync(user.Id);

        var body = $@"
        <div style='width: 100%; font-family: Arial, Helvetica, sans-serif;font-size:22px; margin: 40px auto; text-align:center;'>
            <h2 style='width:fit-content; margin: 15px auto;'>Your email was changed!</h2>
            <p style='width:fit-content; margin: 15px auto; '>Dear {user.FirstName} {user.LastName}, you need to confirm your new email:</p>
            <a style='display:block; width:fit-content; margin: auto; padding:10px 15px; background-color:#8ecae6; border-radius:5px; text-decoration:none; color:#14213d;'
                href='https://timetrackerproject.azurewebsites.net/emailConfirm?confirm={confirmationLink}'>Confirm</a>
        </div>";

        SendEmail(user.Email, body, "Account credentials changed.");
    }
}
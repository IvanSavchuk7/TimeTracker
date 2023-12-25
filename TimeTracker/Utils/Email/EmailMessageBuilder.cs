using System.Net;
using System.Net.Mail;

namespace TimeTracker.Utils.Email;

public class EmailMessageBuilder
{
    private MailMessage _mailMessage;

    private SmtpClient _smtpClient;

    private readonly List<string> _emails = new ();

    public EmailMessageBuilder()
    {
        _smtpClient = new SmtpClient
        {
            Host = "smtp.gmail.com",
            Port = 587,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            UseDefaultCredentials = false,
            EnableSsl = true,
            Credentials = new NetworkCredential("time.tackerproj@gmail.com","qyeskibiiegkgili")
        };
    }
    
    public EmailMessageBuilder BuildSmtClient(string host,int port,NetworkCredential credential)
    {
        _smtpClient = new SmtpClient
        {
            Host = host,
            Port = port,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            UseDefaultCredentials = false,
            EnableSsl = true,
            Credentials = credential
        };

        return this;
    }

    public EmailMessageBuilder BuildEmailMessage(string subject,string body)
    {
        _mailMessage = new MailMessage
        {
            From = new MailAddress("time.tackerproj@gmail.com"),
            Subject = subject,
            Body = body,
            IsBodyHtml = true,
        };
       
        return this;
    }

    
    public EmailMessageBuilder AddReceiver(string receiverEmail)
    {
        _emails.Add(receiverEmail);
        
        return this;
    }

    public void SendEmailMessage(bool isAsync)
    {
        if (!Validate()) return;
        
        AddReceivers();
        
        if (isAsync)
        {
            _smtpClient.SendAsync(_mailMessage,null);
            return;
        }
        
        _smtpClient.Send(_mailMessage);
    }
    

    private void AddReceivers()
    {
        foreach (var email in _emails)
        {
            _mailMessage.To.Add(email);
        }
    }
    private bool Validate()
    {
        return _emails.Count != 0 || _mailMessage == null;
    }
    
    
}
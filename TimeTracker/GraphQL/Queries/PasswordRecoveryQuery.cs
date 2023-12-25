using DocumentFormat.OpenXml.InkML;
using GraphQL;
using GraphQL.Types;
using TimeTracker.Absctration;
using TimeTracker.Models;
using TimeTracker.Utils.Email;

namespace TimeTracker.GraphQL.Queries;

public sealed class PasswordRecoveryQuery:ObjectGraphType
{
    private IUnitOfWorkRepository _uow;
    public PasswordRecoveryQuery(IUnitOfWorkRepository uow)
    {
        _uow = uow;
        Field<int>("passwordRecovery")
            .Argument<string>("email")
            .ResolveAsync(async context =>
            {
                var email = context.GetArgument<string>("email");

                var user = await uow.GenericRepository<User>()
                    .FindAsync(u => u.Email == email)??throw new ArgumentException("user not exist");

                
                
                var emailService = context.RequestServices!.GetRequiredService<EmailService>();
                
                var code = Guid.NewGuid();

                await CreatePasswordRecoveryRequestAsync(code.ToString(), user);
                
                emailService.SendEmail(email,$"<div>{code}</div>","Password recovery");

                await uow.SaveAsync();
                
                return user.Id;
            });

        Field<bool>("verifyCode")
            .Argument<int>("userId")
            .Argument<string>("code")
            .ResolveAsync(async context =>
            {
                var email = context.GetArgument<int>("userId");
                
                var verify = await uow.GenericRepository<PasswordVerify>()
                    .FindAsync(u => u.UserId == email) ?? throw new ArgumentException("user not found");

                if ((DateTime.Now-verify.RequestDate).TotalSeconds > 300)
                {
                    throw new ArgumentException("Code expired");
                }
                
                
                var code = context.GetArgument<string>("code");
                
                var isRecovered = BCrypt.Net.BCrypt.Verify(code, verify.Code);
                
                verify.IsRecovered = isRecovered;

                await uow.GenericRepository<PasswordVerify>().UpdateAsync(verify);

                await uow.SaveAsync();
                
                return isRecovered;
            });

        Field<string>("createNewPassword")
            .Argument<string>("password")
            .Argument<int>("userId")
            .ResolveAsync(async context =>
            {
                
                var id = context.GetArgument<int>("userId");
                
                var user = await uow.GenericRepository<User>()
                    .FindAsync(u => u.Id == id) ?? throw new ArgumentException("user not found");

                var verify = await uow.GenericRepository<PasswordVerify>()
                    .FindAsync(u => u.UserId == id);


                if (!verify.IsRecovered)
                {
                    throw new ArgumentException("Password not verified,try again");
                }
                
                var newPassword = context.GetArgument<string>("password");

                user.Password = BCrypt.Net.BCrypt.HashPassword(newPassword);
                
                
                await uow.SaveAsync();
                
                return "Password reset successfully";
            });
    }
    
    private async Task CreatePasswordRecoveryRequestAsync(string code,User user)
    {
        var encrypted = BCrypt.Net.BCrypt.HashPassword(code);

        var passwordVerify = await _uow.GenericRepository<PasswordVerify>()
            .FindAsync(pw => pw.UserId == user.Id);

        if (passwordVerify != null)
        {
            passwordVerify.Code = encrypted;
            passwordVerify.IsRecovered = false;
            passwordVerify.RequestDate=DateTime.Now;
            
            await _uow.GenericRepository<PasswordVerify>()
                .UpdateAsync(passwordVerify);
            
            return;
        }
        
        await _uow.GenericRepository<PasswordVerify>().CreateAsync(new PasswordVerify()
        {
            Code = encrypted,
            RequestDate = DateTime.Now,
            UserId = user.Id,
            User = user
        });
        
    }
}
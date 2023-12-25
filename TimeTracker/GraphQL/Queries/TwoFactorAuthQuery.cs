using System.Text;
using System.Text.Json.Nodes;
using GraphQL;
using GraphQL.Types;
using TimeTracker.Absctration;
using TimeTracker.Models;
using TimeTracker.Utils.Auth;
using Twilio;
using Twilio.Rest.Verify.V2.Service.Entity;

namespace TimeTracker.GraphQL.Queries;

public sealed class TwoFactorAuthQuery : ObjectGraphType
{
    public TwoFactorAuthQuery(IConfiguration config,IUnitOfWorkRepository uow)
    {
        var accountSid = config["Authentication:Twilio:ClientSid"]!;
        var authToken = config["Authentication:Twilio:AuthToken"]!;
        var serviceSid = config["Authentication:Twilio:ServiceSid"]!;
        
        Field<string>("getQrCode")
            .Argument<string>("accountName")
            .Argument<int>("id")
            .ResolveAsync(async ctx =>
            {
                var accName = ctx.GetArgument<string>("accountName");

                var id = ctx.GetArgument<int>("id");

                var user =  await uow.GenericRepository<User>()
                    .FindAsync(u => u.Id == id);
                
                TwilioClient.Init(accountSid, authToken);

                var pathId = Guid.NewGuid().ToString();
        
                var factor = NewFactorResource.Create(
                    friendlyName:accName,
                    factorType:NewFactorResource.FactorTypesEnum.Totp,
                    pathServiceSid:serviceSid,
                    pathIdentity:pathId
                );

                var json = JsonNode.Parse(factor.Binding.ToString());

                user.PathId = pathId;
                user.PathSid = factor.Sid;

                await uow.SaveAsync();
               
                return $"https://api.qrserver.com/v1/create-qr-code/?data={json["uri"]}&amp";
            });

        Field<string>("verify")
            .Argument<int>("id")
            .Argument<string>("code")
            .ResolveAsync(async ctx =>
            {
                var id = ctx.GetArgument<int>("id");
                var code = ctx.GetArgument<string>("code");
                
                var user =  await uow.GenericRepository<User>()
                    .FindAsync(u => u.Id == id)??throw new Exception("not found");
                
                TwilioClient.Init(accountSid, authToken);

                var factor = FactorResource.Update(
                    friendlyName:user.FirstName,
                    authPayload: code,
                    pathServiceSid: serviceSid,
                    pathIdentity: user.PathId,
                    pathSid: user.PathSid
                );
                    
                return factor.Status.ToString();
            });


        Field<string>("verifyLogin")
            .Argument<string>("code")
            .Argument<int>("id")
            .ResolveAsync(async ctx =>
            {
                var id = ctx.GetArgument<int>("id");
                var code = ctx.GetArgument<string>("code");
                
                var user =  await uow.GenericRepository<User>()
                    .FindAsync(u => u.Id == id)??throw new Exception("not found");
                
                TwilioClient.Init(accountSid, authToken);

                var challenge = ChallengeResource.Create(
                    authPayload: code,
                    factorSid: user.PathSid,
                    pathServiceSid: serviceSid,
                    pathIdentity: user.PathId
                );
                if (challenge.Status == ChallengeResource.ChallengeStatusesEnum.Denied ||
                    challenge.Status == ChallengeResource.ChallengeStatusesEnum.Expired)
                {
                    throw new Exception("Invalid code");
                }

                if (challenge.Status == ChallengeResource.ChallengeStatusesEnum.Pending)
                {
                    throw new Exception("Invalid code, try again");
                }
                
                var authenticate = ctx.RequestServices!.GetRequiredService<Authenticate>();
                
                var token = authenticate.GenerateToken(user);
                var refToken = authenticate.GenerateRefreshToken();
                user.RefreshToken = refToken.Token;
                user.RefreshTokenExpiration = refToken.Expiration;
                await uow.SaveAsync();
        
                return token;
            });

        /*Field<string>("list")
            .Resolve(ctx =>
            {

                TwilioClient.Init(accountSid, authToken);

                var factors = FactorResource.Read(
                    pathServiceSid: serviceSid,
                    pathIdentity: "963e6ace-5799-4583-b8af-2cd1a58d1dee",
                    limit: 20
                );
                var str = new StringBuilder();

                foreach (var record in factors)
                {
                    str.Append($"Sid:{record.Sid}, Identity:{record.Identity}, Status:{record.Status}");
                    str.Append('\n');
                }

                return str.ToString();
            });*/


    }
}
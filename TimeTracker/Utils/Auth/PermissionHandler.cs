using Microsoft.AspNetCore.Authorization;
using TimeTracker.Enums;

namespace TimeTracker.Utils.Auth;

public class PermissionHandler:AuthorizationHandler<PermissionRequirement>
{

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
    {
        var permissions = context.User.Claims.FirstOrDefault(c => c.Type == "Permissions");

        if (permissions == null)
        {
            return Task.CompletedTask;
        }

        var intPermission = Convert.ToInt32(permissions.Value);
        var intRequirement = Convert.ToInt32(requirement.Permissions);

        if ((intPermission & intRequirement) == intRequirement)
        {
            context.Succeed(requirement);
        }
                
        return Task.CompletedTask;
    }
}
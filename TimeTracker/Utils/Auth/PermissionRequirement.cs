using Microsoft.AspNetCore.Authorization;
using TimeTracker.Enums;

namespace TimeTracker.Utils.Auth;

public class PermissionRequirement:IAuthorizationRequirement
{
    public PermissionRequirement(Permissions permission)
    {
        Permissions = permission;
    }
    
    public Permissions Permissions { get; }
}

using GraphQL.Types;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Types.InputTypes;

public sealed class UserLoginInputType : InputObjectGraphType<User>
{
    public UserLoginInputType()
    {
        Field<string>(x => x.Email).Description("user email");

        Field<string>(x => x.Password).Description("user password");
    }
}
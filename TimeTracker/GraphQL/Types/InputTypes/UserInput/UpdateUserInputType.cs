using GraphQL.Types;
using TimeTracker.Models.Dtos;

namespace TimeTracker.GraphQL.Types.InputTypes;

public sealed class UpdateUserInputType:InputObjectGraphType<UserUpdateDto>
{
    public UpdateUserInputType()
    {
        Field(x => x.Id).Description("user id");
        
        Field(x => x.Email).Description("user email");
        
        Field(x => x.FirstName).Description("user first name");

        Field(x => x.LastName).Description("user last name");

        Field(x => x.Permissions).Description("user permissions");

        Field(x => x.HoursPerMonth).Description("hours per month");
    }
}
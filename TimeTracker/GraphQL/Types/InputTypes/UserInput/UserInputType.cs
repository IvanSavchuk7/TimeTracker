using GraphQL.Types;
using TimeTracker.Models.Dtos;

namespace TimeTracker.GraphQL.Types.InputTypes;

public sealed class UserInputType:InputObjectGraphType<UserInputDto>
{
    public UserInputType()
    {
        Field(x => x.Email).Description("user email");

        Field(x => x.FirstName).Description("user first name");

        Field(x => x.LastName).Description("user last name");

        Field(x => x.Permissions).Description("user permissions");

        Field(x => x.VacationDays).Description("user vacation days");

        Field(x => x.HoursPerMonth).Description("hours per month");
        
    }
}
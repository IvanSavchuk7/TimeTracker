using GraphQL.Types;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Types.InputTypes.SickLeaveInput;

public sealed class SickLeaveInputGraphType:InputObjectGraphType<SickLeave>
{
    public SickLeaveInputGraphType()
    {
        Field(x => x.StartDate);

        Field(x => x.EndDate);

        Field(x => x.Message, nullable: true);
        
        Field(x => x.UserId);
    }
}
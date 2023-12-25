using GraphQL.Types;
using TimeTracker.Models;
using TimeTracker.Models.Dtos;

namespace TimeTracker.GraphQL.Types.InputTypes.WorkedHourInput;

public sealed class WorkedHourInputType: InputObjectGraphType<WorkedHourInputDto>
{
    public WorkedHourInputType()
    {
        Field(v => v.UserId).Description("user id");

        Field(x => x.StartDate).Description("start date");

        Field(x => x.EndDate).Description("end date");
    }
}
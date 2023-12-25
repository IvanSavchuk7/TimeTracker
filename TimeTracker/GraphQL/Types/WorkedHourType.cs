using GraphQL.Types;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Types;

public sealed class WorkedHourType: ObjectGraphType<WorkedHour>
{
    public WorkedHourType()
    {
        Field(x => x.Id).Description("id");

        Field(x=>x.UserId).Description("user id");

        Field(x => x.StartDate).Description("date of start");

        Field(x => x.EndDate).Description("date of end");

        Field(x => x.TotalTime).Description("user's total worked time");
    }
}
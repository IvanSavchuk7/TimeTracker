using GraphQL.Types;
using TimeTracker.Models;
using TimeTracker.Models.Dtos;


namespace TimeTracker.GraphQL.Types.InputTypes.WorkPlanInput;

public sealed class WorkPlanInputType:InputObjectGraphType<WorkPlan>
{
    public WorkPlanInputType()
    {
        Field(x => x.Id, nullable: true, type: typeof(IntGraphType)).Description("id");

        Field(x => x.UserId).Description("user id");

        Field(x => x.Date).Description("working date");

        Field(x => x.StartTime).Description("start time");

        Field(x => x.EndTime).Description("end time");

    }
}
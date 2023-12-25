using GraphQL.Types;
using TimeTracker.Models;
using TimeTracker.Models.Dtos;


namespace TimeTracker.GraphQL.Types;

public sealed class WorkPlanType:ObjectGraphType<WorkPlan>
{
    public WorkPlanType()
    {
        Field(x => x.Id, nullable: true).Description("Id");

        Field(x => x.UserId).Description("user id");

        Field(x => x.User.FirstName).Description("user's first name");
        
        Field(x => x.User.LastName).Description("user's last name");

        Field(x => x.Date).Description("date");

        Field(x => x.StartTime).Description("start time");

        Field(x => x.EndTime).Description("end time");

    }
}
using DocumentFormat.OpenXml.Drawing;
using GraphQL.Types;
using TimeTracker.Models;
using TimeTracker.Models.Dtos;


namespace TimeTracker.GraphQL.Types;

public sealed class UserType:ObjectGraphType<User>
{
    public UserType()
    {
        Field(x => x.Id).Description("Id");

        Field(x => x.Email).Description("user email");

        Field(x => x.FirstName).Description("user first name");

        Field(x => x.LastName).Description("");

        Field<int>("permissions")
            .Resolve(context => (int)context.Source.Permissions)
            .Description("");
        
        Field(x => x.IsTwoStepAuthEnabled,nullable:true);

        Field(x => x.VacationDays).Description("");

        Field(x => x.WorkType).Description("");

        Field(x => x.HoursPerMonth).Description("");

        Field(x => x.IsEmailActivated).Description("");
        
        Field(x => x.Approvers).Description("user vacation approved requests");

        Field(x => x.Senders).Description("user vacation requests");

        Field(x => x.Vacations).Description("user vacations");

        Field(x=>x.DeletedAt,nullable:true).Description("user deleted at");
        
        Field(x=>x.IsDeleted,nullable:true).Description("user deleted");

        Field(x => x.ApproverVacations,nullable:true).Description("user request");

        Field(x => x.WorkPlans).Description("user work plans");

    }
}
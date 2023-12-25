using GraphQL.Types;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Types;

public sealed class VacationType: ObjectGraphType<Vacation>
{
    public VacationType()
    {
        Field(x => x.Id).Description("Id");

        Field(x => x.StartDate).Description("vacation start date");
        
        Field(x=>x.UserId).Description("user id");

        Field(x => x.EndDate).Description("vacation end date");

        Field(x => x.VacationState,nullable:true).Description("vacation state");

        Field(x => x.Message).Description("vacation desc");
        
        Field(x=>x.User).Description("user");
        
        Field(x=>x.ApproverMessage,nullable:true).Description("approver message");

        Field(x => x.ApproverVacations).Description("ApproverVacation");

        Field(x => x.IsDeleted);
        
        Field(x => x.DeletedAt,nullable:true);
    }
}
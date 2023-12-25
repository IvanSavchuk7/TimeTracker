using GraphQL.Types;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Types;

public sealed class ApproverVacationType:ObjectGraphType<ApproverVacation>
{
    public ApproverVacationType()
    {
        Field(x => x.Vacation).Description("requested vacation");
        
        Field(x => x.VacationId).Description("requested vacation id");

        Field(x => x.Approver).Description("vacation approver");
        
        Field(x => x.UserId).Description("vacation approver id");

        Field(x => x.Id).Description("vacation id");
        
        Field(x => x.IsApproved,nullable:true).Description("vacation state");
        
        Field(x=>x.Message,nullable:true).Description("message");

        Field(x => x.IsDeleted);
    }
}
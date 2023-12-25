using GraphQL.Types;
using TimeTracker.Models;
using TimeTracker.Models.Dtos;

namespace TimeTracker.GraphQL.Types.InputTypes.ApproveInput;

public sealed class ApproverVacationUpdateType:InputObjectGraphType<ApproverVacationUpdateDto>
{
    public ApproverVacationUpdateType()
    {
        Field<int>("approverId").Description("approver id");
        
        Field(x => x.Message,nullable:true).Description("explanation");

        Field(x => x.IsApproved,nullable:true).Description("state");
        
        Field(x=>x.VacationId).Description("vacation id");
    }
}
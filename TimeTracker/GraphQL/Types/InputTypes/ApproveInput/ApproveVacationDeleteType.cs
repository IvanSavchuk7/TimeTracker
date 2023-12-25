using GraphQL.Types;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Types.InputTypes.ApproveInput;

public sealed class ApproveVacationDeleteType:InputObjectGraphType<ApproverVacation>
{
    public ApproveVacationDeleteType()
    {
        Field(x => x.Id);
        
        Field(x => x.Message);
        
        Field(x => x.IsApproved,nullable:true);
        
        Field(x => x.IsDeleted);
        
        Field(x => x.DeletedAt,nullable:true);
    }
}
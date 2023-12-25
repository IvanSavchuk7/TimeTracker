using GraphQL.Types;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Types;

public sealed class SickLeaveType:ObjectGraphType<SickLeave>
{
    public SickLeaveType()
    {
        Field(x => x.Id);
        
        Field(x => x.StartDate);
        
        Field(x => x.EndDate);
        
        Field(x => x.Message,nullable:true);

        Field(x => x.User);

        Field(x => x.UserId);
    }    
}
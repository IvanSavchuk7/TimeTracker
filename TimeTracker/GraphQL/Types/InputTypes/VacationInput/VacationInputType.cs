using GraphQL.Types;
using TimeTracker.Enums;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Types.InputTypes.VacationInput;

public sealed class VacationInputType: InputObjectGraphType<Vacation>
{
    public VacationInputType()
    {
        Field(x=>x.Id,nullable:true).Description("vacation id");
        Field(x=>x.UserId).Description("vacation user id");
        Field(v => v.StartDate)
            .Type(new DateGraphType())
            .Description("vacation start date");

        Field(v => v.EndDate)
            .Type(new DateGraphType())
            .Description("vacation end date");
        
        Field(v=>v.Message,nullable:true).Description("vacation message");

        Field(v => v.VacationState, nullable: true)
            .DefaultValue(VacationState.Pending)
            .Description("vacation state");
        
        Field(x => x.ApproverMessage, nullable: true);
        Field(x => x.IsDeleted,nullable:true);
        Field(x => x.DeletedAt,nullable:true);
    }
}
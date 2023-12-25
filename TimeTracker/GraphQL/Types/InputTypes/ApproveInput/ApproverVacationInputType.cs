using GraphQL.Types;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Types.InputTypes.ApproveInput;

public sealed class ApproverVacationInputType:InputObjectGraphType<ApproverVacation>
{
    public ApproverVacationInputType()
    {
        Field(x => x.UserId).Description("approver id");

        Field(x => x.VacationId).Description("vacation id");
    }
}
using GraphQL.Types;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Types.InputTypes.ApproveInput;

public sealed class ApproveInputType:InputObjectGraphType<UserApprover>
{
    public ApproveInputType()
    {
        Field(x => x.ApproverId);

        Field(x => x.UserId);
    }
}
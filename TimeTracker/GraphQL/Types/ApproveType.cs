using GraphQL.Types;
using GraphQLParser.AST;
using TimeTracker.MapperProfiles;
using TimeTracker.Models;
using TimeTracker.Models.Dtos;

namespace TimeTracker.GraphQL.Types;

public sealed class ApproveType:ObjectGraphType<UserApprover>
{
    public ApproveType()
    {
        Field(x => x.Id).Description("approve id");

        Field(x => x.Approver,nullable:true).Description("user approver");

        Field(x => x.User,nullable:true).Description("user sender");
    }
}
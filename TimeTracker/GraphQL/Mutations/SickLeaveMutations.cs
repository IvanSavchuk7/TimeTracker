using GraphQL;
using GraphQL.Types;
using TimeTracker.Absctration;
using TimeTracker.GraphQL.Types;
using TimeTracker.GraphQL.Types.InputTypes.SickLeaveInput;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Mutations;

public sealed class SickLeaveMutations:ObjectGraphType
{
    private readonly IGenericRepository<SickLeave> _repos;
    
    public SickLeaveMutations(IUnitOfWorkRepository uow)
    {
        _repos = uow.GenericRepository<SickLeave>();
        Field<SickLeaveType>("create")
            .Argument<SickLeaveInputGraphType>("sickLeave")
            .ResolveAsync(async _ =>
            {
                var sickLeave = _.GetArgument<SickLeave>("sickLeave");

                var created = await _repos.CreateAsync(sickLeave);
                await uow.SaveAsync();
                return created;
            });
    }
}
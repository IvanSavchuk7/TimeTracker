using GraphQL.Types;
using TimeTracker.Absctration;
using TimeTracker.GraphQL.Types;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Queries;

public sealed class SickLeaveQuery:ObjectGraphType
{
    public SickLeaveQuery(IUnitOfWorkRepository uow)
    {
        Field<ListGraphType<SickLeaveType>>("sickLeaves")
            .ResolveAsync(async _ => await uow.GenericRepository<SickLeave>().GetAsync());
    }
    
}
using GraphQL;
using GraphQL.Types;
using TimeTracker.Absctration;
using TimeTracker.Enums;
using TimeTracker.GraphQL.Types;
using TimeTracker.Models;
using TimeTracker.Utils.Filters;
using TimeTracker.Visitors;

namespace TimeTracker.GraphQL.Queries;

public sealed class VacationsQuery:ObjectGraphType
{
    public VacationsQuery(IUnitOfWorkRepository uow,IGraphQlArgumentVisitor visitor)
    {
        Field<ListGraphType<VacationType>>("userVacations")
            .Argument<int>("userId")
            .ResolveAsync(async _ =>
            {
                var id = _.GetArgument<int>("userId");
                
                var vacations  =  await uow.GenericRepository<Vacation>()
                    .GetAsync(x => x.UserId == id);
                
                return visitor.Visit(vacations, _);
            })
            .UseFiltering()
            .UsePaging()
            .UseOrdering();

        Field<VacationType>("vacation")
            .Argument<int>("id")
            .ResolveAsync(async _ =>
            {
                var id = _.GetArgument<int>("id");
                return await uow.GenericRepository<Vacation>()
                    .FindAsync(v => v.Id == id,relatedData:"User");
            });
    }
}
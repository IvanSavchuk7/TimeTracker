using GraphQL;
using GraphQL.Types;
using TimeTracker.Absctration;
using TimeTracker.GraphQL.Types;
using TimeTracker.Models;
using TimeTracker.Utils.Filters;
using TimeTracker.Visitors;


namespace TimeTracker.GraphQL.Queries;

public sealed class ApproverVacationQuery:ObjectGraphType
{
    public ApproverVacationQuery(IUnitOfWorkRepository uow,IGraphQlArgumentVisitor visitor)
    {
        Field<ListGraphType<ApproverVacationType>>("requests")
            .Argument<int>("userId")
            .ResolveAsync(async context =>
            {
                var id = context.GetArgument<int>("userId");
                
                
                var req =  await uow.GenericRepository<ApproverVacation>()
                        .GetAsync(
                            includeProperties:"Vacation.User",
                            filter:a=>a.UserId==id);
                req = req.OrderByDescending(av => av.IsApproved == null);

                return visitor.Visit(req,context);
            }).UsePaging()
            .UseFiltering();

        Field<ApproverVacationType>("approverVacation")
            .Argument<int>("id")
            .ResolveAsync(async context =>
            {
                var id = context.GetArgument<int>("id");

                return await uow.GenericRepository<ApproverVacation>()
                    .FindAsync(a => a.Id == id,relatedData:"Vacation.User");
            });
    }
}
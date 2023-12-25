using AutoMapper;
using GraphQL;
using GraphQL.Types;
using TimeTracker.Absctration;
using GraphQL.Validation;
using TimeTracker.Models;
using TimeTracker.Models.Dtos;
using TimeTracker.Utils.Errors;
using TimeTracker.Enums;
using TimeTracker.GraphQL.Types.InputTypes.WorkPlanInput;
using TimeTracker.Extensions;

namespace TimeTracker.GraphQL.Mutations;

public sealed class WorkPlanMutations : ObjectGraphType
{
    public WorkPlanMutations(IUnitOfWorkRepository uow)
    {
        Field<WorkPlan>("set")
            .Argument<WorkPlanInputType>("workPlan")
            .ResolveAsync(async ctx =>
            {
                var wp = ctx.GetArgument<WorkPlan>("workPlan");


                var exists = await uow.GenericRepository<WorkPlan>()
                            .FindAsync(p => p.Date.Equals(wp.Date) 
                                        && p.UserId == wp.UserId 
                                        && p.Id != wp.Id 
                                        && p.StartTime < wp.EndTime 
                                        && wp.StartTime < p.EndTime);

                if (exists is not null)
                    throw new ValidationError("Work plans intersect");

                var set = (wp.Id is null)
                    ? await uow.GenericRepository<WorkPlan>().CreateAsync(wp)
                    : await uow.GenericRepository<WorkPlan>().UpdateAsync(wp);

                await uow.SaveAsync();

                return set;
            });

        Field<WorkPlan?>("delete")
            .Argument<WorkPlanInputType>("workPlan")
            .ResolveAsync(async ctx =>
            {
                var wp = ctx.GetArgument<WorkPlan>("workPlan");

                var deleted = await uow.GenericRepository<WorkPlan>().DeleteAsync(wp);

                await uow.SaveAsync();

                return deleted ? wp : null;
            });
    }
}
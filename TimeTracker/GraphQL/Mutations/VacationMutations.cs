using GraphQL;
using GraphQL.Types;
using GraphQL.Validation;
using TimeTracker.Absctration;
using TimeTracker.Enums;
using TimeTracker.GraphQL.Types;
using TimeTracker.GraphQL.Types.InputTypes.VacationInput;
using TimeTracker.Models;
using TimeTracker.Utils.Errors;

namespace TimeTracker.GraphQL.Mutations;

public sealed class VacationMutations:ObjectGraphType
{
    private readonly IGenericRepository<Vacation> _repos;
    public VacationMutations(IUnitOfWorkRepository uow)
    {
        _repos = uow.GenericRepository<Vacation>();
        Field<VacationType>("create")
            .Argument<VacationInputType>("vacation")
            .ResolveAsync(async _ =>
            {
                var vacation = _.GetArgument<Vacation>("vacation");
                if(vacation.EndDate.Date<vacation.StartDate.Date)
                {
                    throw new ValidationError("Vacation period invalid");
                }
                if (vacation.StartDate.Date<DateTime.Now.Date)
                {
                    throw new ValidationError("Vacation start date invalid");
                }

                var res = await uow.GenericRepository<Vacation>()
                    .CreateAsync(vacation);
                
                await uow.SaveAsync();
                return res;
            });

        Field<VacationType>("updateState")
            .Argument<int>("vacationId")
            .ResolveAsync(async _ =>
            {
                var id = _.GetArgument<int>("vacationId");
                
                var vacation = await uow.GenericRepository<Vacation>()
                    .FindAsync(v => v.Id == id,relatedData:"ApproverVacations")
                               ??throw new ValidationError("Vacation not found");
                
                vacation.VacationState = GetVacationState(vacation.ApproverVacations);
                await uow.SaveAsync();
                
                return vacation;
            });


        Field<VacationType>("update")
            .Argument<VacationInputType>("vacation")
            .Argument<bool>("validate",nullable:true)
            .ResolveAsync(async ctx =>
            {
                var validate = ctx.GetArgument<bool>("validate");
                var vacation = ctx.GetArgument<Vacation>("vacation");
                if (!validate)
                {
                    var vac = await uow.GenericRepository<Vacation>().UpdateAsync(vacation);
                    await uow.SaveAsync();
                    return vac;
                }
                
                if (vacation.StartDate.Date<=DateTime.Now.Date)
                {
                    throw new ValidationError("Vacation start date invalid");
                }

                var currentVacation = await uow.GenericRepository<Vacation>()
                    .FindAsync(v => v.Id == vacation.Id,asNoTracking:true);

                if (currentVacation!.StartDate.Date<=DateTime.Now.Date
                    &&vacation.StartDate.Date>currentVacation.StartDate.Date
                    &&currentVacation.VacationState==VacationState.Approved)
                {
                    throw new ValidationError("Vacation days have already begun");
                }

                
                var updated = await uow.GenericRepository<Vacation>().UpdateAsync(vacation);
                await uow.SaveAsync();
                return updated;
            });

        Field<VacationType>("changeState")
            .Argument<int>("vacationId")
            .Argument<VacationState>("state")
            .ResolveAsync(async _ =>
            {
                var id = _.GetArgument<int>("vacationId");
                var state = _.GetArgument<VacationState>("state");
                
                var vacation = await uow.GenericRepository<Vacation>()
                    .FindAsync(v => v.Id == id);
                
                if (vacation == null) { return null; }
                
                if (vacation.VacationState==VacationState.Approved)
                {
                    if (vacation.StartDate.Date <= DateTime.Now.Date)
                    {
                        throw new ValidationError("Vacation days have already begun");
                    }
                }
                vacation.VacationState = state;
                await uow.SaveAsync();
                return vacation;
            });

        Field<VacationType>("deleteById")
            .Argument<int>("vacationId")
            .ResolveAsync(async _ =>
            {
                var id = _.GetArgument<int>("vacationId");
                var vacation = await _repos.FindAsync(v => v.Id == id);
                if (vacation == null)
                {
                    return null;
                }
                await _repos.DeleteAsync(vacation);
                
                await uow.SaveAsync();
                
                return vacation;
            });

        Field<VacationType>("delete")
            .Argument<VacationInputType>("vacation")
            .ResolveAsync(async _ =>
            {
                var vacation = _.GetArgument<Vacation>("vacation");
                
                await _repos.DeleteAsync(vacation);

                await uow.SaveAsync();

                return vacation;
            });
    }


    private VacationState GetVacationState(List<ApproverVacation> avs)
    {
        var approvals=0;
        
        foreach (var av in avs)
        {
            if (av.IsApproved == false)
                return VacationState.Declined;
            
            if (av.IsApproved == true)
                approvals++;
        }
        
        return approvals == avs.Count ? VacationState.Approved : VacationState.Pending;
    }
} 
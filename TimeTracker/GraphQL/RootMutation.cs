using GraphQL.Types;
using TimeTracker.GraphQL.Mutations;

namespace TimeTracker.GraphQL;

public sealed class RootMutation:ObjectGraphType
{
    public RootMutation()
    {
        Field<UserMutations>("userMutation")
            .Resolve(_ => new { });

        Field<ApproverMutations>("approverMutation")
            .Resolve(_=>new { });

        Field<VacationMutations>("vacationMutation")
            .Resolve(_ => new { });
        
        Field<ApproverVacationMutations>("approverVacationMutation")
            .Resolve(_ => new { });
        
        Field<WorkedHourMutations>("workedHourMutations")
            .Resolve(_ => new { });

        Field<WorkPlanMutations>("workPlanMutations")
            .Resolve(_ => new { });

        Field<CalendarEventMutations>("calendarEventMutations")
            .Resolve(_ => new { });

        Field<SickLeaveMutations>("sickLeaveMutations")
            .Resolve(_ => new { });
    }
}
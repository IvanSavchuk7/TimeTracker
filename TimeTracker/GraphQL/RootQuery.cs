using GraphQL.Types;
using TimeTracker.GraphQL.Queries;

namespace TimeTracker.GraphQL;

public sealed class RootQuery:ObjectGraphType
{
    public RootQuery()
    {
        
        Field<UserQuery>("userQuery")
            .Resolve(_ => new { });
        
        Field<ApproverVacationQuery>("approverVacationQuery")
            .Resolve(_ => new { });
        
        Field<VacationsQuery>("vacationQuery")
            .Resolve(_ => new { });
        
        Field<WorkedHourQuery>("workedHourQuery")
            .Resolve(_ => new { });
            
        Field<WorkPlanQuery>("workPlanQuery")
            .Resolve(_ => new { });
            
        Field<CalendarEventQuery>("calendarEventQuery")
            .Resolve(_ => new { });

        Field<SickLeaveQuery>("sickLeavesQuery")
            .Resolve(_ => new { });

        Field<PasswordRecoveryQuery>("passwordRecoveryQuery")
            .Resolve(_ => new { });
        
        Field<TwoFactorAuthQuery>("twoFactorAuthQuery")
            .Resolve(_ => new { });
    }
}
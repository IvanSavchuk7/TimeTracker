using GraphQL.Types;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Types;

public sealed class HoursWorkedGraphType:ObjectGraphType<HoursWorked>
{
    public HoursWorkedGraphType()
    {
        Field(x => x.ActuallyWorked);
        Field(x => x.NeedToWork);
        Field(x => x.ActuallyWorkedHours);
        Field(x => x.NeedToWorkToday);
        Field(x => x.ActuallyWorkedToday);
    }
}
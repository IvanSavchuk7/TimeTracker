using GraphQL.Types;
using TimeTracker.Models.Dtos;

namespace TimeTracker.GraphQL.Types.InputTypes.CalendarEventInput;

public sealed class DateRangeInputType: InputObjectGraphType<DateRangeInputDto>
{
    public DateRangeInputType()
    {
        Field(d => d.StartDate).Description("start date");

        Field(d => d.EndDate).Description("end date");
    }
}
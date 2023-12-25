using AutoMapper;
using GraphQL;
using GraphQL.Execution;
using GraphQL.Types;
using GraphQL.Validation;
using TimeTracker.Absctration;
using TimeTracker.Enums;
using TimeTracker.GraphQL.Types;
using TimeTracker.GraphQL.Types.InputTypes;
using TimeTracker.Models;
using TimeTracker.Models.Dtos;
using TimeTracker.GraphQL.Types.InputTypes.CalendarEventInput;


namespace TimeTracker.GraphQL.Queries;

public sealed class CalendarEventQuery : ObjectGraphType
{
    public CalendarEventQuery(IUnitOfWorkRepository uow, IMapper mapper)
    {
        Field<ListGraphType<CalendarEventType>>("calendarEvents")
            .Argument<DateRangeInputType>("dateRange")
            .ResolveAsync(async ctx =>
            {
                var dateRange = ctx.GetArgument<DateRangeInputDto>("dateRange");

                var calendarEvents = await uow.GenericRepository<CalendarEvent>()
                                    .GetAsync(c => c.Date >= DateOnly.FromDateTime(dateRange.StartDate)
                                                && c.Date <= DateOnly.FromDateTime(dateRange.EndDate));

                return calendarEvents;
            })
            .Description("gets all calendar events");
    }
}
using GraphQL.Types;
using TimeTracker.Models;
using TimeTracker.Models.Dtos;


namespace TimeTracker.GraphQL.Types.InputTypes.CalendarEventInput;

public sealed class CalendarEventInputType : InputObjectGraphType<CalendarEvent>
{
    public CalendarEventInputType()
    {
        Field(x => x.Id, nullable: true).Description("Id");

        Field(x => x.Date).Description("working date");

        Field(x => x.Title).Description("title");

        Field<int>("eventType").Description("event type");
    }
}
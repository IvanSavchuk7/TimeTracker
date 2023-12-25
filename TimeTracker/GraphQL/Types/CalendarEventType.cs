using GraphQL.Types;
using TimeTracker.Models;
using TimeTracker.Models.Dtos;


namespace TimeTracker.GraphQL.Types;

public sealed class CalendarEventType : ObjectGraphType<CalendarEvent>
{
    public CalendarEventType()
    {
        Field(x => x.Id, nullable: true).Description("Id");

        Field(x => x.Date).Description("working date");

        Field(x => x.Title).Description("title");

        Field<int>("eventType")
            .Resolve(context => (int)context.Source.EventType)
            .Description("");
            
    }
}
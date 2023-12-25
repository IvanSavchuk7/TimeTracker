using AutoMapper;
using GraphQL;
using GraphQL.Types;
using TimeTracker.Absctration;
using GraphQL.Validation;
using TimeTracker.GraphQL.Types.InputTypes.CalendarEventInput;
using TimeTracker.Models;
using TimeTracker.Models.Dtos;
using TimeTracker.Utils.Errors;
using TimeTracker.Enums;

namespace TimeTracker.GraphQL.Mutations;

public sealed class CalendarEventMutations : ObjectGraphType
{
    public CalendarEventMutations(IUnitOfWorkRepository uow, IMapper mapper)
    {
        Field<CalendarEvent>("set")
            .Argument<CalendarEventInputType>("calendarEvent")
            .ResolveAsync(async ctx =>
            {
                var evt = ctx.GetArgument<CalendarEvent>("calendarEvent");

                var repository = uow.GenericRepository<CalendarEvent>();
                var existingEvent = await repository.FindAsync(c => c.Date == evt.Date);

                var set = evt.Id is not null
                    ? await repository.UpdateAsync(evt)
                    : existingEvent is not null
                        ? throw new ValidationError("Event on this date already exists!")
                        : await repository.CreateAsync(evt);

                await uow.SaveAsync();

                return set;
            });

        Field<CalendarEvent?>("delete")
            .Argument<CalendarEventInputType>("calendarEvent")
            .ResolveAsync(async ctx =>
            {
                var evt = ctx.GetArgument<CalendarEvent>("calendarEvent");

                var deleted = await uow.GenericRepository<CalendarEvent>().DeleteAsync(evt);

                await uow.SaveAsync();

                return deleted ? evt : null;
            });
    }
}
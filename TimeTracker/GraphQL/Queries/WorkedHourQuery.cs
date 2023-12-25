using AutoMapper;
using GraphQL;
using GraphQL.Execution;
using GraphQL.MicrosoftDI;
using GraphQL.Types;
using GraphQL.Validation;
using TimeTracker.Absctration;
using TimeTracker.Enums;
using TimeTracker.GraphQL.Types;
using TimeTracker.GraphQL.Types.InputTypes;
using TimeTracker.Models;
using TimeTracker.Models.Dtos;
using TimeTracker.Repositories;
using TimeTracker.Utils.Auth;
using TimeTracker.Utils.Email;
using TimeTracker.Utils.Errors;
using TimeTracker.Utils.Filters;
using TimeTracker.Visitors;
using TimeTracker.GraphQL.Types.InputTypes.CalendarEventInput;
using TimeTracker.Utils.WorkedHoursCalculation;

namespace TimeTracker.GraphQL.Queries;

public sealed class WorkedHourQuery : ObjectGraphType
{
    private readonly IGenericRepository<WorkedHour> _repos;
    private readonly WorkedHoursHelpers _hoursHelpers;
    public WorkedHourQuery(IUnitOfWorkRepository uow, IGraphQlArgumentVisitor visitor, WorkedHoursHelpers helpers)
    {
        _repos = uow.GenericRepository<WorkedHour>();
        _hoursHelpers = helpers;
        Field<ListGraphType<WorkedHourType>>("workedHours")
            .Argument<int>("userId")
            .Argument<DateRangeInputType>("dateRange")
            .ResolveAsync(async ctx =>
            {
                var userId = ctx.GetArgument<int>("userId");
                var dateRange = ctx.GetArgument<DateRangeInputDto>("dateRange");

                var workedHours = await uow.GenericRepository<WorkedHour>()
                                    .GetAsync(w => w.UserId == userId
                                                && w.StartDate.Date >= dateRange.StartDate.Date
                                                && w.EndDate.Date <= dateRange.EndDate.Date);

                workedHours = workedHours.OrderByDescending(w => w.StartDate);

                return visitor.VisitPaging(workedHours, ctx);
            })
            .Description("gets all user's worked hours");

        Field<int>("getWorkedHoursInMonth")
                .Argument<DateOnlyGraphType>("date")
                .ResolveAsync(async c =>
                {
                    var date = c.GetArgument<DateOnly>("date");
                    var workedDays = await _hoursHelpers.GetWorkedDaysInMonthAsync(date.Year, date.Month);
                    return 8 * workedDays;
                });



        Field<HoursWorkedGraphType>("getYearStatistic")
            .Argument<int>("userId")
            .Argument<DateOnlyGraphType>("date")
            .ResolveAsync(async _ =>
            {
                var id = _.GetArgument<int>("userId");
                var date = _.GetArgument<DateOnly>("date");
                var user = await uow.GenericRepository<User>()
                    .FindAsync(u => u.Id == id, relatedData: "WorkedHours,WorkPlans") ?? throw new Exception("not found");

                var workedDays = await _hoursHelpers.GetWorkedDaysInMonthAsync(date.Year, date.Month);

                var needToWork = _hoursHelpers.GetWorkedHoursInCurrentMonth(user, workedDays);

                var actuallyWorked = _hoursHelpers.GetActuallyWorkedHoursInCurrentMonth(user);

                var plans = user.WorkPlans
                    .FindAll(w => w.Date == DateOnly.FromDateTime(DateTime.Now));


                var needToWorkToday = TimeSpan.Zero;


                var actuallyWorkedToday = user
                    .WorkedHours
                    .FindAll(wh => wh.StartDate.Date == DateTime.Now.Date && wh.EndDate.Date == DateTime.Now.Date)
                    .Aggregate(TimeSpan.Zero, (current, next) => current + TimeSpan.FromSeconds(next.TotalTime));

                if (plans.Any())
                {
                    needToWorkToday = plans
                        .Aggregate(TimeSpan.Zero, (current, wh) => current + (wh.EndTime - wh.StartTime));
                }

                return new HoursWorked()
                {
                    ActuallyWorked = (actuallyWorked.TotalHours * 100 / needToWork).ToString("F2"),
                    ActuallyWorkedHours = actuallyWorked.TotalHours.ToString("F2"),
                    NeedToWork = needToWork.ToString("F2"),
                    NeedToWorkToday = needToWorkToday.TotalHours.ToString("F2"),
                    ActuallyWorkedToday = actuallyWorkedToday.TotalHours.ToString("F2")
                };
            });

    }


}
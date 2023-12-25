using TimeTracker.Absctration;
using TimeTracker.Enums;
using TimeTracker.Models;

namespace TimeTracker.Utils.WorkedHoursCalculation;

public class WorkedHoursHelpers
{
    private readonly IUnitOfWorkRepository _uow;
    
    public WorkedHoursHelpers(IUnitOfWorkRepository repository)
    {
        _uow = repository;
    }
    
    public async Task<int> GetWorkedDaysInMonthAsync(int year, int month)
    {
        
        var currentDate = DateTime.Now;
        
        var firstDayOfMonth = new DateTime(currentDate.Year, currentDate.Month, 1);
        
        var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

        var calendarEvents = await _uow.GenericRepository<CalendarEvent>()
            .GetAsync(filter:ce=>ce.Date>=DateOnly.FromDateTime(firstDayOfMonth.Date)
                                 &&ce.Date<=DateOnly.FromDateTime(lastDayOfMonth.Date)
                                 && ce.EventType == EventType.Holiday);

      
        
        var workDays = 0;
        var daysInMonth = DateTime.DaysInMonth(year, month);
        for (var day = 1; day <= daysInMonth; day++)
        {
            var currentDay = new DateTime(year, month, day);
            if (currentDay.DayOfWeek is DayOfWeek.Saturday or DayOfWeek.Sunday)
            {
                continue;
            }
            workDays++;
        }

        return workDays-calendarEvents.Count();
    }

    public int GetWorkedHoursInCurrentMonth(User user,int workedDays)
    {
        return user.HoursPerMonth* 8 * workedDays/100;
    }

    public TimeSpan GetActuallyWorkedHoursInCurrentMonth(User user)
    {
        return user.WorkedHours.FindAll(wh => wh.StartDate.Month == DateTime.Now.Month && wh.StartDate.Year == DateTime.Now.Year)
            .Aggregate(TimeSpan.Zero, (current, wh) => current + TimeSpan.FromSeconds(wh.TotalTime));
    }
}
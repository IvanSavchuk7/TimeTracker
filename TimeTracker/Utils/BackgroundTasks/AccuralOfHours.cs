using Quartz;
using TimeTracker.Absctration;
using TimeTracker.Enums;
using TimeTracker.Models;

namespace TimeTracker.Utils.BackgroundTasks;

public class AccuralOfHours:IJob
{
    private readonly IUnitOfWorkRepository _uow;
    public AccuralOfHours(IUnitOfWorkRepository repos)
    {
        _uow = repos;
    }
    public async Task Execute(IJobExecutionContext context)
    {
        var fullTimers = await _uow.GenericRepository<User>()
            .GetAsync(u => u.WorkType == WorkType.FullTime
                ,includeProperties:"Vacations");

        /*
        var logs = await _uow.GenericRepository<QuartzLog>()
            .GetAsync(orderBy:q=>q.OrderByDescending(e=>e.Id));
        var lastLog = logs.FirstOrDefault(l=>l.Type==Log.AccuralOfHours);

        if (lastLog == null)
        {
            throw new Exception("at least one log must be present in table");
        }

        var hoursCount = (DateTime.Now - lastLog.Date.ToDateTime(new TimeOnly())).Days*8;

        var workedHours = new List<WorkedHour>();

        foreach (var fullTimer in fullTimers)
        {
            workedHours.Add(new WorkedHour()
            {
                User = fullTimer,
                UserId = fullTimer.Id,
                Date = DateTime.Now,
                StartTime = new TimeOnly(),
                EndTime = new TimeOnly(),
                TotalTime = new TimeOnly(hoursCount,0,0)
            });
        }
        */
        
        
        await _uow.SaveAsync();
    }
}
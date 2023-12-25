using Quartz;
using TimeTracker.Absctration;
using TimeTracker.Extensions;
using TimeTracker.Models;
using TimeTracker.Utils.Email;
using TimeTracker.Utils.WorkedHoursCalculation;

namespace TimeTracker.Utils.BackgroundTasks;

public class CheckWorkedHoursPerMonth:IJob
{
    private readonly IUnitOfWorkRepository _uow;
    
    private readonly EmailMessageBuilder _emailMessageBuilder;
    
    private readonly WorkedHoursHelpers _workedHoursHelpers;
    
    public CheckWorkedHoursPerMonth(IUnitOfWorkRepository uow,
        EmailMessageBuilder emailMessageBuilder,
        WorkedHoursHelpers workedHoursHelpers)
    {
        _uow = uow;
        _emailMessageBuilder = emailMessageBuilder;
        _workedHoursHelpers = workedHoursHelpers;
    }
    
    public async Task Execute(IJobExecutionContext context)
    {
  
        var users = await _uow.GenericRepository<User>()
            .GetAsync(includeProperties:"WorkedHours");
        
        var workedDays = await _workedHoursHelpers.GetWorkedDaysInMonthAsync(DateTime.Now.Year,DateTime.Now.Month);

        var needToSend = false;
        
        foreach (var user in users)
        {
            var needToWork = _workedHoursHelpers.GetWorkedHoursInCurrentMonth(user,workedDays);

            var actuallyWorked = _workedHoursHelpers.GetActuallyWorkedHoursInCurrentMonth(user);

            if (actuallyWorked.TotalHours>=needToWork) continue;
            
            _emailMessageBuilder.AddReceiver(user.Email);
            
            needToSend = true;
        }

        if (needToSend)
        {
            _emailMessageBuilder.BuildEmailMessage("Work statistic",
                "<div>Please note that you have not worked the promised number of hours per month</div>")
                .SendEmailMessage(isAsync:true);
        }
    }
}
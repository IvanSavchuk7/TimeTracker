using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TimeTracker.Enums;
using TimeTracker.Models;
using TimeTracker.Utils.SoftDelete;

namespace TimeTracker.AppContext;

public class TimeTrackerContext:DbContext
{
    public TimeTrackerContext(DbContextOptions<TimeTrackerContext> options) : base(options)
    {
    }
    
    public DbSet<User> Users { get; set; }
    
    public DbSet<Vacation> Vacations { get; set; }
    
    public DbSet<UserApprover> Approvers { get; set; }

    public DbSet<ApproverVacation> ApproversVacation { get; set; }

    public DbSet<WorkedHour> WorkedHours { get; set; }

    public DbSet<WorkPlan> WorkPlans { get; set; }
    
    public DbSet<SickLeave> SickLeaves { get; set; }
    
    public DbSet<CalendarEvent> CalendarEvents { get; set; }
    
    public DbSet<QuartzLog> QuartzLogs { get; set; }
    
    public DbSet<PasswordVerify> PasswordRecoveries { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserApprover>()
            .HasOne(a => a.Approver)
            .WithMany(u => u.Senders)
            .HasForeignKey(a => a.ApproverId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<UserApprover>()
            .HasOne(a => a.User)
            .WithMany(u => u.Approvers)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.NoAction);
        
        modelBuilder.Entity<WorkPlan>()
            .Property(a => a.StartTime)
            .HasConversion(
                v => v.ToTimeSpan(),
                v => TimeOnly.FromTimeSpan(v)
            );
        
        modelBuilder.Entity<WorkPlan>()
            .Property(a => a.EndTime)
            .HasConversion(
                v => v.ToTimeSpan(),
                v => TimeOnly.FromTimeSpan(v)
            );

        modelBuilder.Entity<WorkPlan>()
            .Property(w => w.Date)
            .HasConversion(w => w.ToDateTime(new TimeOnly()),
                w=>DateOnly.FromDateTime(w));
        
        modelBuilder.Entity<CalendarEvent>()
            .Property(w => w.Date)
            .HasConversion(w => w.ToDateTime(new TimeOnly()),
                w=>DateOnly.FromDateTime(w));

        modelBuilder.Entity<SickLeave>()
            .Property(s => s.StartDate)
            .HasConversion(s => s.ToDateTime(new TimeOnly()),
                s=>DateOnly.FromDateTime(s));
        
        modelBuilder.Entity<SickLeave>()
            .Property(s => s.EndDate)
            .HasConversion(s => s.ToDateTime(new TimeOnly()),
                s=>DateOnly.FromDateTime(s));
        
        modelBuilder.Entity<QuartzLog>()
            .Property(s => s.Date)
            .HasConversion(s => s.ToDateTime(new TimeOnly()),
                s=>DateOnly.FromDateTime(s));
        
        modelBuilder.Entity<User>()
            .Property(s => s.EmploymentDate)
            .HasConversion(s => s.ToDateTime(new TimeOnly()),
                s=>DateOnly.FromDateTime(s));
        
        base.OnModelCreating(modelBuilder);
    }


    
}
namespace TimeTracker.Extensions;

public static class DateOnlyExtensions
{
    public static bool IsBetween(this DateOnly subject, DateOnly startDate, DateOnly endDate)
    {
        return startDate.CompareTo(subject) < 1 && subject.CompareTo(endDate) < 1;
    }
}
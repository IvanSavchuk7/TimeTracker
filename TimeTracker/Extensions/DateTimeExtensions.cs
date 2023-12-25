namespace TimeTracker.Extensions;

public static class DateTimeExtensions
{
    public static bool IsBetween(this DateTime subject, DateTime startDate, DateTime endDate)
    {
        return startDate.CompareDateTo(subject.Date) < 1 && subject.CompareDateTo(endDate.Date) < 1;
    }

    public static int CompareDateTo(this DateTime subject, DateTime target)
    {
        return subject.Date.CompareTo(target.Date);
    }

    public static bool DateEquals(this DateTime subject, DateTime target)
    {
        return subject.Date.Equals(target.Date);
    }
}
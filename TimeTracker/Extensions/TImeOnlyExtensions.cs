namespace TimeTracker.Extensions;

public static class TimeOnlyExtensions
{
    public static bool IsTimeBetween(this TimeOnly subject, TimeOnly startTime, TimeOnly endTime)
    {
        return subject >= startTime && subject <= endTime;
    }
}
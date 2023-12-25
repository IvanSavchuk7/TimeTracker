namespace TimeTracker.Enums;

[Flags]
public enum VacationState
{
    Approved=1,
    Declined=2,
    Pending=4,
    Canceled=8,
    Edited=16
}
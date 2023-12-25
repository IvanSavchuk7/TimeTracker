namespace TimeTracker.Enums;

[Flags]
public enum Permissions
{
    None = 0b_0000,
    Create = 0b_0001,
    Update = 0b_0010,
    Delete = 0b_0100,
    Read = 0b_1000,
}
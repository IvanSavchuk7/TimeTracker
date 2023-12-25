using GraphQL;
using TimeTracker.Enums; 
namespace TimeTracker.Utils.Errors;

public class QueryError : ExecutionError {
    public QueryError(System.Enum message) : base(message.ToString()) { }

    public QueryError(System.Enum message, string[] fields) : base(message.ToString())
    {
        Extensions ??= new Dictionary<string, object?>();

        for(int i = 0; i < fields.Length; i++)
        {
            Extensions[$"{i}"] = $"{fields[i]}";
        }
    }
}

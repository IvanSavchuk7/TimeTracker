using GraphQL.Types;
using TimeTracker.Models;

namespace TimeTracker.GraphQL.Types;

public sealed class GoogleAccessTokenType:ObjectGraphType<GoogleAccessToken>
{
    public GoogleAccessTokenType()
    {
        Field(x => x.AccessToken);
        
        Field(x => x.ExpiresIn);
        
        Field(x => x.Scope);
        
        
        Field(x => x.TokenType);
    }
}
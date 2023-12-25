import {ajax} from "rxjs/ajax";
import {
    AccessTokenType,
    ExternalAuthTokenType,
    ExternalAuthType,
    getUserInfoUrl,
    UserInfoResponse
} from "@redux/types/authTypes.ts";
import {AjaxQuery} from "@redux/queries/query.ts";


export function GetAccessTokenQuery(auth:ExternalAuthType){
    return ajax.post<AccessTokenType>(`https://timetrackerproject.azurewebsites.net/access-token?code=${auth.code}&authType=${auth.authType}`,)
}

export function GetUserFromAccessTokenQuery(auth:ExternalAuthTokenType){

    const userInfoUrl = getUserInfoUrl(auth.authType);

    return ajax.get<UserInfoResponse>(userInfoUrl,{
        "Accept":"application/json",
        "Authorization":`Bearer ${auth.token}`
    });
}

export function AuthorizeWithEmailQuery(email:string){

    return AjaxQuery<{userQuery:{externalAuth:string}}>(
        `query GetAccessToken($email:String!){
              userQuery{
                externalAuth(email:$email)
              }
            }`,
        {email:email}
    )
}
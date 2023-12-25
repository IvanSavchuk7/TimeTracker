

export interface AccessTokenType{
    access_token:string,
    scope:string,
    token_type:string
}

export interface ExternalAuthType{
    code:string,
    authType:string
}

export interface ExternalAuthTokenType{
    token:string,
    authType:string,
}

export interface UserInfoResponse{
    email:string;
}
export interface QrCodeGenerateInput{
    id:number,
    accountName:string
}

export interface VerifyTwoStepInput{
    id:number,
    code:string
}


export function getUserInfoUrl(authType:string){
    switch (authType){
        case "google":return "https://www.googleapis.com/oauth2/v3/userinfo"
        case "github":return "https://api.github.com/user"
        default:throw new Error("auth type not available");
    }
}
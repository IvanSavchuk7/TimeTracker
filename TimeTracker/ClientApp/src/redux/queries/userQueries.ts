import { AjaxQuery } from './query';
import { User } from '../intrerfaces';
import {UserAddType, FetchUsersType, UpdateTwoStepAuth, UserLoginType, TwoStepInput, TwoStepLoginInput} from '../types'
import { ReadCookie } from '../../utils';
import {user} from "@redux/slices";
import {CodeVerifyInput, CreatePasswordInput} from "@redux/types/passwordVerifyTypes.ts";
import {QrCodeGenerateInput, VerifyTwoStepInput} from "@redux/types/authTypes.ts";

export function UserLoginQuery(userData: { email: string, password: string }) {
  return AjaxQuery<{ userQuery: { login: string } }>(
    "query Login($user: UserLoginInputType!) {userQuery {login(user: $user)}}",
    { user: userData }
  );
}

export function AddUserQuery(userData: UserAddType) {
  const token = ReadCookie('user');

  return AjaxQuery<{ userMutation: { create: User } }>(
    `mutation AddUser($user: UserInputType!) {
          userMutation {
            create(user: $user) {
              id
              email
              firstName
              lastName
              permissions
              vacationDays
              workType
              hoursPerMonth
            } 
          }
        }`,
    { user: userData },
    token
  )
}

export function PasswordConfirmQuery(data: { token: string, password: string }) {
  const { token, password } = data;
  return AjaxQuery<{ userMutation: { verifyUser: boolean } }>(
    `mutation Verify($token: String!, $password: String!) {
            userMutation {
              verifyUser(token: $token, password: $password)
            }
          }`,
    {
      token: token,
      password: password
    },
  )
}

export function FetchUsersQuery(data: FetchUsersType) {
  const { take, skip, group,orderBy,userId } = data;
  return AjaxQuery<{ userQuery: { users: User[] } }>(
    `query GetUsers($take: Int, $skip: Int,$group:[Where]!,$orderBy:OrderBy){
      userQuery{
          users(group:$group,
                take:$take,skip:$skip,orderBy:$orderBy){
               id
                email
                workType
                firstName
                lastName
                isEmailActivated
                vacationDays
                hoursPerMonth
        }
      }
    }`,
    {
      take: take,
      skip: skip,
      group:[...group,{property:"Id",operator:"neq",value:userId.toString(),connector:"and"}],
      orderBy:orderBy.property!==""?orderBy:null
    },
  );
}


export function FetchUserQuery(userId: number) {
  return AjaxQuery<{ userQuery: { user: User } }>(
    `query GetUser($userId: Int!) {
            userQuery {
              user(id: $userId) {
                id
                email
                workType
                firstName
                lastName
                isEmailActivated
                vacationDays
                hoursPerMonth
                permissions
              }
            }
          }`,
    {
      userId: userId
    },
  );
}

export function EditUserQuery(user: User) {
  const token = ReadCookie('user');

  return AjaxQuery<{ userMutation: { update: boolean } }>(
    `mutation EditUser($user: UpdateUserInputType!) {
        userMutation {
          update(user: $user) 
        }
      }`,
    { user: user },
    token
  )
}

export function FetchUserVacationDays(id:number){
    return AjaxQuery<{ userQuery:{user:{vacationDays:number}} }>(
        'query FetchUserVacationDays($id:Int!){userQuery{user(id:$id){vacationDays}}}',
        {id:id}
    )
}

export function DeleteUser(id:number){
    return AjaxQuery<{ userMutation:{deleteById:number} }>(
        'mutation DeleteUser($id:Int!){userMutation{deleteById(id:$id)}}',
        {id:id}
    )
}

export function EmailConfirmQuery(token: string) {
  return AjaxQuery<{ userMutation: { verifyUser: boolean } }>(
    `mutation emailVerify($token: String!) {
            userMutation {
              verifyEmail(token: $token)
            }
          }`,
    {
      token: token
    },
  )
}

export function RefreshTokenQuery(userId:number){
    return AjaxQuery<{userQuery:{refreshToken:string}}>(
        `
            query RefreshToken($userId:Int){
              userQuery{
                refreshToken(userId:$userId)
              }
            }
        `,
        {
            userId:userId
        }
    )
}

export function ResetPasswordQuery(email:string){
    return AjaxQuery<{passwordRecoveryQuery:{passwordRecovery:number}}>(
        `
            query PasswordRecovery($email:String!){
              passwordRecoveryQuery{
                passwordRecovery(email:$email)
              }
            }
        `,
        {email:email}
    )
}

export function CodeVerifyQuery({code,userId}:CodeVerifyInput){
    return AjaxQuery<{passwordRecoveryQuery:{verifyCode:boolean}}>(
        `
            query PasswordRecovery($code:String!,$userId:Int!){
              passwordRecoveryQuery{
                verifyCode(code:$code,userId:$userId)
              }
            }
        `,
        {code:code,userId:userId}
    )
}

export function CreatePasswordQuery({password,userId}:CreatePasswordInput){
    return AjaxQuery<{passwordRecoveryQuery:{createNewPassword:string}}>(
        `
            query CreatePassword($pass:String!,$userId:Int!){
              passwordRecoveryQuery{
                createNewPassword(password:$pass,userId:$userId)
              }
            }
        `,
        {pass:password,userId:userId}
    )
}

export function UpdateTwoStepAuthQuery({isEnabled,userId}:UpdateTwoStepAuth){
    return AjaxQuery<{userMutation:{updateTwoStepAuth:boolean}}>(
        `mutation Update($isEnabled:Boolean!,$userId:Int!){
              userMutation{
                updateTwoStepAuth(isEnabled:$isEnabled,userId:$userId)
              }
            }`,
        {
            isEnabled:isEnabled,
            userId:userId,
        }
    )
}

export function VerifyUserLoginQuery(input:UserLoginType){
    return AjaxQuery<{userQuery:{verifyUserLogin:User}}>(
        `query Verify($user: UserLoginInputType!){
            userQuery{
                verifyUserLogin(user:$user){
                    email,
                    isTwoStepAuthEnabled,
                    firstName,
                    id
                }
            }
        }`,
        {
            user:input
        }
    )
}


export function SendTwoFactorCodeQuery({to,authType}:TwoStepInput){
    return AjaxQuery<{twoFactorAuthQuery:{sendCode:string}}>(
        `query Send($to:String!,$authType:String!){
            twoFactorAuthQuery{
                sendCode(to:$to,authType:$authType)
            }
        }`,
        {
            to:to,
            authType:authType
        }
    )
}

export function TwoFactorLoginQuery({id,code}:TwoStepLoginInput){
    return AjaxQuery<{twoFactorAuthQuery:{verifyLogin:string}}>(
        `query Login($code:String!,$id:Int!){
             twoFactorAuthQuery{
                verifyLogin(id:$id,code:$code)
            }
        }`,
        {
            id:id,
            code:code,
        }
    )
}

export function GetQrCodeQuery({accountName,id}:QrCodeGenerateInput){
    return AjaxQuery<{twoFactorAuthQuery:{getQrCode:string}}>(
        `query GetQrCode($acc:String!,$id:Int!){
          twoFactorAuthQuery{
            getQrCode(accountName:$acc,id:$id)
          }
        }`,
        {
            acc:accountName,
            id:id
        }
    )
}

export function VerifyEnableTwoStepQuery({code,id}:VerifyTwoStepInput){
    return AjaxQuery<{twoFactorAuthQuery:{verify:string}}>(
        `query GetQrCode($code:String!,$id:Int!){
          twoFactorAuthQuery{
            verify(code:$code,id:$id)
          }
        }`,
        {
            code:code,
            id:id
        }
    )
}
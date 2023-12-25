import {User} from "../intrerfaces";


export enum VacationStateEnum{
    Approved='APPROVED',
    Declined='DECLINED',
    Pending='PENDING',
    Canceled='CANCELED',
    Edited='EDITED'
}

export interface Vacation{
    id:number,
    startDate:Date,
    endDate:Date,
    message?:string,
    user:User,
    vacationState:VacationStateEnum,
    userId:number,
    haveAnswer:boolean,
    approverMessage?:string
}

export interface VacationInputType{
    userId:number,
    startDate:Date,
    endDate:Date,
    message?:string
}

export interface VacationChangeType{
    id:number,
    state:VacationStateEnum
}


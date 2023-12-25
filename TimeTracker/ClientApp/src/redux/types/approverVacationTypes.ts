import {User} from "../intrerfaces";
import {Vacation} from "./vacationTypes";

export interface ApproverVacation{
    id:number,
    approver:User[],
    vacation:Vacation,
    isApproved?:boolean|null,
    isDeleted:boolean,
    deletedAt:Date|null
}

export interface ApproverVacationUpdate{
    approverId:number,
    isApproved:boolean,
    vacationId:number,
    message?:string
}

export interface VacationApproverInput{
    vacationId:number,
    userId:number,
}

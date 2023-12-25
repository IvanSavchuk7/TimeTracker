import {Vacation, VacationChangeType, VacationInputType} from "../types";
import {AjaxQuery} from "./query";
import {ReadCookie} from "../../utils";
import {ApproverVacation, WorkedFetchType} from "../types";
import moment from "moment";
import {WhereFilter} from "@redux/types/filterTypes.ts";

export function AddVacationQuery(vacation:VacationInputType) {

    const token = ReadCookie('user');

    return AjaxQuery<{ vacationMutation: { create: Vacation } }>(
        'mutation CreateVacations($vacation:VacationInputType!){vacationMutation{create(vacation:$vacation){id,startDate,endDate,message,vacationState,approverMessage,userId}}}',
        { vacation:vacation},
        token
    )
}

export function FetchVacationsRequest(id:number,take:number,skip:number,group:WhereFilter[]){
    return AjaxQuery<{ approverVacationQuery: { requests:ApproverVacation[]}}>(
        'query GetRequests($userId:Int!,$take:Int,$skip:Int,$group:[Where]!){approverVacationQuery{requests(userId:$userId,take:$take,skip:$skip,group:$group){id,isApproved,isDeleted,vacation{vacationState,id,endDate,message,startDate,user{firstName,lastName,email}}}}}',
        {userId:id,take:take,skip:skip,group:group}
    )
}

export function UpdateVacationState(id:number){

    return AjaxQuery<{ vacationMutation:{updateState:{id:number}  } }>(
        'mutation UpdateState($id:Int!){vacationMutation{updateState(vacationId:$id){id}}}',
        {id:id},
    )
}

export function FetchUserVacations(input:WorkedFetchType){

    return AjaxQuery<{ vacationQuery:{userVacations:Vacation[]} }>(
        'query GetUserVacations($id:Int!,$take:Int,$skip:Int,$group:[Where!],$orderBy:OrderBy){vacationQuery{userVacations(userId:$id,take:$take,skip:$skip,group:$group,orderBy:$orderBy){id,vacationState,deletedAt,isDeleted,endDate,startDate,message,approverMessage}}}',
        {id:input.userId,take:input.take,skip:input.skip,group:input.group,orderBy:input.orderBy}
    )
}

export function ChangeVacationState(vac:VacationChangeType){
    return AjaxQuery<{ vacationMutation:{changeState:Vacation} }>(
        'mutation ChangeState($id:Int!,$state:VacationState!){vacationMutation{changeState(vacationId:$id,state:$state){id,startDate,endDate,vacationState}}}',
        {id:vac.id,state:vac.state}
    )
}

export function UpdateVacation(vacation:Vacation){
    return AjaxQuery<{ vacationMutation:{update:Vacation} }>(
        'mutation UpdateVacation($vacation:VacationInputType!){vacationMutation{update(vacation:$vacation){id,startDate,endDate,vacationState}}}',
        {vacation:{...vacation,
                startDate:moment(vacation.startDate).format("YYYY-MM-DD"),
                endDate:moment(vacation.endDate).format("YYYY-MM-DD")},
                validate:vacation.approverMessage===null}
    )
}

export function DeleteVacation(vacation:Vacation){
    return AjaxQuery<{ vacationMutation:{delete:Vacation} }>(
        'mutation ArchiveVacation($vacation:VacationInputType!){vacationMutation{delete(vacation:$vacation){id}}}',
        {vacation:vacation}
    )
}

export function FetchVacationById(id:number){
    return AjaxQuery<{ vacationQuery:{vacation:Vacation} }>(
        'query VacationById($id:Int!){vacationQuery{vacation(id:$id){id,startDate,endDate,vacationState,message,user{firstName,lastName,email,vacationDays}}}}',
        {id:id}
    )
}
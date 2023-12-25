import {AjaxQuery} from "./query";
import {QueryStructure} from "../intrerfaces";
import {ApproverVacation, ApproverVacationUpdate, Vacation, VacationApproverInput} from "../types";








export function CreateApproverVacation(approverVacation:VacationApproverInput){

    return AjaxQuery<{ approverVacationMutation: { createApproverVacation:VacationApproverInput}}>(
        'mutation CreateApproverVacation($approverVacation:ApproverVacationInputType!){approverVacationMutation{createApproverVacation(approverVacation:$approverVacation){id,userId}}}',
        {approverVacation:approverVacation}
    )
}

export function UpdateApproverVacations(input:VacationApproverInput){

    return AjaxQuery<any>(
        'mutation UpdateApproversVacations($av:ApproverVacationInputType!){approverVacationMutation{updateApproversVacations(approverVacation:$av)}}',
        {av:input}
    )
}

export function DeleteApproverVacationByVacationId(id:number){
    return AjaxQuery<{approverVacationMutation:{deleteByVacationId:ApproverVacation}}>(
        `mutation DeleteByVacationId($id:Int!){approverVacationMutation{deleteByVacationId(id:$id)}}`,
        {id:id}
    )
}

export function FetchApproverVacationById(id:number){
    return AjaxQuery<{approverVacationQuery:{approverVacation:ApproverVacation}}>(
        'query FetchById($id:Int!){approverVacationQuery{approverVacation(id:$id){isApproved,isDeleted,id,vacation{id,vacationState,startDate,message,endDate,user{firstName,lastName,employmentDate,email,vacationDays}}}}}',
        {id:id}
    )
}

export function UpdateApproverVacationToDefault(vacationId:number){
    return AjaxQuery<{approverVacationMutation:{stateToDefault:boolean}}>(
        'mutation StateToDefault($id:Int!){approverVacationMutation{stateToDefault(vacationId:$id)}}',
        {id:vacationId}
    )
}

export function UpdateApproverVacationState(av:ApproverVacationUpdate){
    return AjaxQuery<{ approverVacationMutation: { updateState:ApproverVacation}}>(
        `mutation UpdateState(
              $state: Boolean!
              $vacationId: Int!
              $approverId: Int!
              $message: String
            ) {
              approverVacationMutation {
                updateState(
                  state: $state
                  vacationId: $vacationId
                  approverId: $approverId
                  message: $message
                ) {
                  id
                  vacationId
                  isApproved,
                  vacation{
                    id
                    vacationState,
                    message,
                    userId
                    user{
                      firstName,
                      lastName,
                      email,
                      vacationDays,
                      employmentDate
                     }
                  }
                }
              }
            }
        `        ,
        {vacationId:av.vacationId,state:av.isApproved,approverId:av.approverId,message:av.message})
}
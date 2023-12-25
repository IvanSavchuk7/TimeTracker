import {Vacation, VacationStateEnum} from "@redux/types";
import moment from "moment";

export function getStringVacationState(state:VacationStateEnum):string{
    const str = state.toLowerCase();

    return str.charAt(0).toUpperCase() + str.slice(1);
}

export function isVacationAnswered(state:VacationStateEnum):boolean{
    return state===VacationStateEnum.Approved
        ||state===VacationStateEnum.Declined
}

export function vacationNotEqual(state:VacationStateEnum,vacationState:VacationStateEnum){
    return vacationState!==state;
}

export function getApproverVacationString(isApproved:boolean|null,defaultValue:string,capitalize=false):string{

    const res = isApproved!==null?isApproved?'approved':'declined':defaultValue;

    if(capitalize){
        return res.charAt(0).toUpperCase() + res.slice(1);
    }

    return res;
}

export function hasWarning(employmentDate:string){
    const diff = moment(new Date()).diff(moment(employmentDate),'months');
    return diff<6;
}
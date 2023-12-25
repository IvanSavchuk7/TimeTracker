import {Vacation} from "../types";


export interface User{
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    workType: number;
    permissions: number;
    vacationDays: number;
    hoursPerMonth: number;
    vacations?:Vacation[],
    employmentDate:Date,
    isTwoStepAuthEnabled:boolean,
}


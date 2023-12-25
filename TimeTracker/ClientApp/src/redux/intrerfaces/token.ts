import { WorkType } from "../enums"

export interface TokenStructure {
    Id: string,
    Email: string,
    FirstName: string,
    LastName: string,
    Permissions: string,
    VacationDays: string,
    WorkType: WorkType,
    IsTwoStepAuthEnabled:boolean
    exp: string 
}
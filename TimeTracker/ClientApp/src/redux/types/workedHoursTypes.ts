import { Moment } from "moment"
import { DateRangeType } from "."
import {FiltersType, OrderingType, PagingInputType} from "./filterTypes"

export interface WorkedHour {
    id: number,
    userId: number,
    startDate: Moment,
    endDate: Moment,
    totalTime: any,
}

export interface WorkedFetchType extends PagingInputType, FiltersType,OrderingType {
    userId: number,
    dateRange: DateRangeType
}

export interface WorkedTime {
    hours: number,
    minutes: number,
    seconds: number
}

export interface CreateWorkedHourType {
    userId: number,
    startDate: string,
    endDate: string,
}

export interface UpdateWorkedHourType {
    id: number,
    startDate: string,
    endDate: string,
}

export interface WorkedHoursStatistic{
    actuallyWorked:string,
    actuallyWorkedHours:string,
    needToWork:string,
    needToWorkToday:string,
    actuallyWorkedToday:string
}

export interface WorkedHoursStatisticInput {
    userId: number,
    date: Date
}
import { SortedCalendarArr } from ".."

export interface CalendarType {
    previousDates: CalendarCell[],
    currentDates: CalendarCell[],
    nextDates: CalendarCell[],
}

export interface WorkPlan {
    id: number,
    userId: number,
    firstName: string,
    lastName: string,
    date: Date,
    startTime: string,
    endTime: string,
}

export interface CalendarEvent {
    id: number,
    date: Date,
    title: string,
    eventType: number
}

export interface CalendarCell {
    date: Date,
    events: CalendarEvent[],
    workPlans: SortedCalendarArr[],
    isHoliday: boolean
}

export interface SetCalendarEventType {
    id?: number,
    date: string,
    title: string,
    eventType: number,
}

export interface SetWorkPlanType {
    id?: number,
    startTime: string,
    endTime: string,
    date: string
}

export interface DateRangeType {
    startDate: string,
    endDate: string
}

export interface SchedulerWorkPlan {
    id: number,
    startTime: string;
    endTime: string;
    totalTime: string;
    date: Date;
    user: string;
    userId: number
}

export interface DeleteWorkPlanType {
    id: number,
    startTime: string,
    endTime: string,
    date: string
    userId: number
}

export interface SchedulerWorkedHour {
    userId: number;
    workPlans: SchedulerWorkPlan[];
}

export interface FetchUsersPlansType {
    dateRange: DateRangeType,
    userIds: number[]
}

export interface FetchUsersPlansSuccessType {
    workPlans: WorkPlan[],
    userIds: number[]
}
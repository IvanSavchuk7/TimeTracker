export * from './DayPlanForm'
import { CalendarEvent, SchedulerWorkPlan } from '@redux/types'


export interface EventFormProps {
    date: Date,
    setIsOpen: (val: Date | null) => void,
    event?: CalendarEvent
}

export interface WorkPlanFormProps {
    date: Date,
    setIsOpen: (val: Date | null) => void,
    workPlan?: SchedulerWorkPlan
}

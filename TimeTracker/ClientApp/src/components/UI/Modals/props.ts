import { CalendarEvent, SchedulerWorkPlan } from '@redux/types'


export interface CalendarModalProps {
    isHidden: Date | null,
    setIsHidden: (val: Date | null) => void,
    event?: CalendarEvent
}

export interface SchedulerModalModalProps {
    isHidden: SchedulerWorkPlan | null,
    setIsHidden: (val: SchedulerWorkPlan | null) => void,
}

export interface DashboardSchedulerModalProps {
    isHidden: boolean,
    setIsHidden: (val: boolean) => void,
}
import { PickerDateRange } from "@components/UI/DateRangePicker/DateRangePicker";
import { TimerSliceState } from "@redux/index";
import { CalendarEvent, CreateWorkedHourType, DateRangeType, WorkPlan, WorkedHour, WorkedTime } from "@redux/types";
import moment, { Moment } from "moment";

export const GetFormattedUTCTimeString = (time: string, date: string): string => {
    return moment(`${date} ${time}`).utc().format("HH:mm:ss");
}

export const GetFormattedDateString = (date: Date): string => {
    return moment(date).format("YYYY-MM-DD")
}

export const GetFormattedTimeString = (time: WorkedTime | string): string => {
    let result = "";

    if (typeof (time) === 'string')
        time = GetTimeFromString(time);

    result = result.concat(time.hours > 9 ? `${time.hours}:` : `0${time.hours}:`)
    result = result.concat(time.minutes > 9 ? `${time.minutes}` : `0${time.minutes}`)
    result = result.concat(time.seconds > 9 ? `:${time.seconds}` : `:0${time.seconds}`)

    return result;
}

export const GetMomentFromTime = (time: string): Moment => {
    const [hours, minutes, seconds] = time.split(':').map(Number)
    return moment().set({ 'hours': hours, 'minutes': minutes, 'seconds': seconds ?? 0 })
}

export const GetInputUtcDateTimeString = (moment: Moment): string => {
    return moment.utc().format("YYYY-MM-DDTHH:mm:ss")
}

export const GetTimeFromString = (time: string): WorkedTime => {
    const values = time.split(':')
    return {
        hours: parseInt(values[0]) ?? 0,
        minutes: parseInt(values[1]) ?? 0,
        seconds: parseInt(values[2]) ?? 0,
    } as WorkedTime
}

export const GetLocalDateFromUtc = (utc: Date): Date => {
    const dateStr = moment(utc).format("YYYY-MM-DD HH:mm:ss")
    return new Date(`${dateStr} UTC`);
}

export const GetLocalMomentFromUtc = (utc: Moment): Moment => {
    return moment(new Date(`${utc.format("YYYY-MM-DD HH:mm:ss")} UTC`));
}

export const GetLocalWorkedHour = (wh: WorkedHour): WorkedHour => {
    wh.startDate = GetLocalMomentFromUtc(moment(wh.startDate))
    wh.endDate = GetLocalMomentFromUtc(moment(wh.endDate))
    return wh;
}

export const GetThreeMonthDateRange = (date: Date): DateRangeType => {
    const dateMoment = moment(date).utc();

    return {
        startDate: dateMoment.clone().subtract(1, 'month').startOf('month').format("YYYY-MM-DDTHH:mm:ss"),
        endDate: dateMoment.clone().add(1, 'month').endOf('month').format("YYYY-MM-DDTHH:mm:ss"),
    }
}

export const GetPickerDateRange = (range: PickerDateRange): DateRangeType => {
    const startDate = range.startDate.utc().format("YYYY-MM-DDTHH:mm:ss")
    const endDate = range.endDate ? range.endDate.utc().format("YYYY-MM-DDTHH:mm:ss") : startDate;

    return {
        startDate: startDate,
        endDate: endDate
    }
}

export const GetOneMonthDateRange = (date: Date): DateRangeType => {
    const dateMoment = moment(date).utc();

    return {
        startDate: dateMoment.startOf('month').format("YYYY-MM-DDTHH:mm:ss"),
        endDate: dateMoment.endOf('month').format("YYYY-MM-DDTHH:mm:ss"),
    }
}

export const GetLocalCalendarEvent = (event: CalendarEvent): CalendarEvent => {
    event.date = GetLocalDateFromUtc(event.date);

    return event;
}

export const GetLocalWorkPlan = (plan: WorkPlan): WorkPlan => {
    const dateOnly = plan.date.toString().split("T")[0]

    const utcStart = `${dateOnly} ${plan.startTime}`;
    const utcEnd = `${dateOnly} ${plan.endTime}`

    const localStart = moment(GetLocalDateFromUtc(new Date(utcStart)))
    const localEnd = moment(GetLocalDateFromUtc(new Date(utcEnd)))

    plan.date = localStart.toDate()
    plan.startTime = localStart.format('HH:mm:ss')
    plan.endTime = localEnd.format('HH:mm:ss')

    return plan;
}

export const ParseTimeString = (time: string): Date => {
    const [hours, minutes, seconds] = time.split(':').map(Number)
    const date = new Date();

    date.setHours(hours, minutes, seconds)

    return date;
}

export const CalculateTimeDifference = (timeString1: string, timeString2: string): number => {
    const time1 = ParseTimeString(timeString1);
    const time2 = ParseTimeString(timeString2);

    const timeDifference = Math.abs(time2.getTime() - time1.getTime());
    return timeDifference
}

export const GetFormattedTimeDifference = (timeString1: string, timeString2: string): string => {
    const totalSeconds = Math.floor(CalculateTimeDifference(timeString1, timeString2) / 1000);

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const formattedHours = hours < 10 ? `0${hours}` : `${hours}`;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const formattedSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

export const convertTimeToIndex = (time: string) => {
    const [hoursStr, minutesStr] = time.split(":");

    return parseInt(minutesStr, 10) + parseInt(hoursStr, 10) * 60;
};

export const GetNewWorkedHour = (state: TimerSliceState, timestamp: number, userId: number) => {
    const startDate = moment(timestamp);
    const stopDate = moment(timestamp)
        .add(state.hours, "hours")
        .add(state.minutes, 'minutes')
        .add(state.seconds, 'seconds');

    return {
        userId: userId,
        startDate: startDate.format("YYYY-MM-DDTHH:mm:ss"),
        endDate: stopDate.format("YYYY-MM-DDTHH:mm:ss")
    } as CreateWorkedHourType
}
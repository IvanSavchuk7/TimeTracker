import { H4 } from "@components/Headings";
import { UsersTableSmall } from "@components/Tables/UsersTableSmall";
import { CurrentDateElement } from "@components/UI/Misc/CurrentDateElement";
import { SchedulerModal } from "@components/UI/Modals/SchedulerModal";
import { hours } from "@components/constants";
import { useAppDispatch, useTypedSelector } from '@hooks/customHooks';
import { resetUsersWorkPlans, userFiltersToDefault } from '@redux/slices';
import { CalendarCell, SchedulerWorkPlan, SchedulerWorkedHour } from '@redux/types';
import { useEffect, useState } from 'react';
import { addDay, createCalendarCell, generateColors, substractDay } from "../../utils";
import { GetFormattedTimeDifference } from '../../utils/dateTimeHelpers';
import "../Calendar/calendars.css";
import { TimeRow } from './TimeRow';
import './scheduler.css';

export const Scheduler = ({ cell, back }: { cell: CalendarCell, back: (selectedDate: Date) => void }) => {
    const dispatch = useAppDispatch()

    const calendar = useTypedSelector(state => state.calendar);
    const { user } = useTypedSelector(state => state.auth)

    const [currentDate, setCurrentDate] = useState<Date>(cell.date);
    const [calendarCell, setCalendarCell] = useState<CalendarCell>(cell)
    const [workedHours, setWorkedHours] = useState<SchedulerWorkedHour[]>()
    const [selectedUsers, setSelectedUsers] = useState<number[]>([])
    const [colors, setColors] = useState<string[]>([])

    const [isFormHidden, setIsFormHidden] = useState<SchedulerWorkPlan | null>(null);

    const defaultRowsCount = 6;

    useEffect(() => {
        const wp: SchedulerWorkedHour[] = [];
        for (const c of calendarCell.workPlans) {
            wp.push({
                userId: c.userId,
                workPlans: c.workPlans.map(p => {
                    return {
                        id: p.id,
                        startTime: p.startTime,
                        endTime: p.endTime,
                        totalTime: GetFormattedTimeDifference(p.startTime, p.endTime),
                        date: p.date,
                        user: `${p.firstName} ${p.lastName}`,
                        userId: p.userId
                    }
                })

            });
        }
        setWorkedHours(sortByCurrentUser(wp))
        setColors([...colors, ...generateColors(calendarCell.workPlans.length - colors.length)])
    }, [calendarCell])

    useEffect(() => {
        setCalendarCell(createCalendarCell(currentDate, calendar.events.currentMonth, calendar.workPlans.currentMonth))
    }, [calendar.workPlans])

    useEffect(() => {
        if (calendarCell.date != currentDate)
            currentDate.getMonth() == new Date().getMonth()
                ? setCalendarCell(createCalendarCell(currentDate, calendar.events.currentMonth, calendar.workPlans.currentMonth))
                : currentDate.getMonth() > new Date().getMonth()
                    ? setCalendarCell(createCalendarCell(currentDate, calendar.events.nextMonth, calendar.workPlans.nextMonth))
                    : setCalendarCell(createCalendarCell(currentDate, calendar.events.previousMonth, calendar.workPlans.previousMonth))
    }, [currentDate])

    const handleDayButton = (date: Date) => {
        setCurrentDate(date);
    }

    const sortByCurrentUser = (wp: SchedulerWorkedHour[]) => {
        const firstElement = wp.findIndex(w => w.userId == user!.id)

        if (firstElement !== -1) {
            const elementToMove = wp.splice(firstElement, 1)[0];
            wp.splice(0, 0, elementToMove);
        }
        return wp
    }

    const handleBackButton = () => {
        dispatch(userFiltersToDefault())
        dispatch(resetUsersWorkPlans(user!.id))
        back(currentDate)
    }

    return (
        <div className="component-wrapper">
            <SchedulerModal isHidden={isFormHidden} setIsHidden={setIsFormHidden} />

            <div className="working-hours__wrapper">
                <div className="calendar-header__wrapper">
                    <div className="calendar-date__wrapper">
                        <button onClick={handleBackButton} id='return-button' />
                        <CurrentDateElement date={currentDate} showFullDate={true} />
                    </div>
                    <div className="calendar-actions">
                        <div>
                            <button onClick={() => { handleDayButton(substractDay(currentDate)) }}></button>
                            <button onClick={() => { handleDayButton(addDay(currentDate)) }}></button>
                        </div>
                    </div>
                </div>
                <div className="working-hours__table">
                    <div className="working-hours__schedule">
                        {hours.map((time, index) => (
                            <div key={index}><span>{time}</span></div>
                        ))}
                    </div>

                    {!workedHours ? (
                        <div className="no-data__message-wrapper"><H4 value="No data available" /></div>
                    ) : (
                        <div
                            className="working-hours__content">
                            {workedHours.map((wh, index) => {
                                return (
                                    <TimeRow workedHour={wh} color={colors[index]} onClick={setIsFormHidden} key={index} />
                                )
                            })}
                            {workedHours.length < defaultRowsCount &&
                                Array.from({ length: defaultRowsCount - workedHours.length }, (_, index) => (
                                    <div className="content-row" key={index}></div>
                                ))}
                        </div>)}
                </div>
            </div>
            <div className="side-form-wrapper">
                <div className="user-search-form">
                    <UsersTableSmall selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
                </div>
            </div>
        </div>

    );
};

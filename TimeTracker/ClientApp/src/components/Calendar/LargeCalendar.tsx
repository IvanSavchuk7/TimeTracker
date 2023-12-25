import { CalendarModal } from '@components/UI/Modals/CalendarModal';
import { useAppDispatch, useTypedSelector } from "@hooks/customHooks";
import { fetchCalendarEvents, fetchWorkPlans, setDate } from '@redux/slices';
import { CalendarCell, CalendarEvent, CalendarType } from '@redux/types';
import React, { useEffect, useState } from 'react';
import { addMonth, setCurrentMonthDates, setNextMonthDates, setPrevMonthDates, substractMonth } from '../../utils';
import { GetOneMonthDateRange, GetThreeMonthDateRange } from '../../utils/dateTimeHelpers';
import "./calendars.css";
import { CurrentDateElement } from '@components/UI/Misc/CurrentDateElement';
import { days } from '@components/constants';


interface CalendarProps {
    date?: Date,
    setter: React.Dispatch<React.SetStateAction<CalendarCell | null>>
}

const calendarCellsCount = 42;

export const LargeCalendar = ({ date, setter }: CalendarProps) => {
    const calendarState = useTypedSelector(state => state.calendar);

    const { currentDate, events, workPlans } = useTypedSelector(state => state.calendar);
    const { user } = useTypedSelector(state => state.auth);
    const dispatch = useAppDispatch();

    const [isCurrentMonth, setIsCurrentMonth] = useState<boolean>(true);
    const [isFormHidden, setIsFormHidden] = useState<Date | null>(null);
    const [changeEvent, setChangeEvent] = useState<CalendarEvent | undefined>(undefined)
    const [calendar, setCalendar] = useState<CalendarType>(
        {
            previousDates: [],
            currentDates: [],
            nextDates: [],
        }
    );

    const setValues = (): CalendarType => ({
        previousDates: setPrevMonthDates(currentDate, events.previousMonth, workPlans.previousMonth),
        currentDates: setCurrentMonthDates(currentDate, events.currentMonth, workPlans.currentMonth),
        nextDates: setNextMonthDates(currentDate, events.nextMonth, workPlans.nextMonth),
    })

    useEffect(() => {
        if (!date) {
            dispatch(fetchWorkPlans({
                dateRange: GetThreeMonthDateRange(calendarState.currentDate),
                userIds: [user!.id]
            }))
            dispatch(fetchCalendarEvents(GetThreeMonthDateRange(calendarState.currentDate)))
        }
        else if (date.getMonth() != currentDate.getMonth()) {
            handleMonthButton(date)
        }
    }, [])

    useEffect(() => {
        setIsCurrentMonth(currentDate.getMonth() == new Date().getMonth());
        setCalendar(setValues())
    }, [calendarState.currentDate])


    useEffect(() => {
        if (calendar.currentDates.length)
            setCalendar(setValues())
    }, [events, workPlans])

    const handleMonthButton = (date: Date) => {
        const dateRange = GetOneMonthDateRange(date > currentDate ? addMonth(date) : substractMonth(date))

        dispatch(setDate(date))
        dispatch(fetchWorkPlans({
            dateRange: dateRange,
            userIds: [user!.id]
        }))
        dispatch(fetchCalendarEvents(dateRange))
    }

    const handleAddEventButton = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, day: CalendarCell) => {
        e.stopPropagation();
        setChangeEvent(undefined)
        setIsFormHidden(day.date)
    }

    const handleEventButton = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, evt: CalendarEvent) => {
        e.stopPropagation();
        setChangeEvent(evt)
        setIsFormHidden(evt.date)
    }

    return (
        <div className="calendar-wrapper">
            <CalendarModal isHidden={isFormHidden} setIsHidden={setIsFormHidden} event={changeEvent} />

            <div className="calendar-header__wrapper">
                <div className="calendar-date__wrapper">
                    <CurrentDateElement date={currentDate} showFullDate={false} />
                </div>
                <div className="calendar-actions">
                    <div>
                        <button onClick={() => handleMonthButton(substractMonth(currentDate))}></button>
                        <button onClick={() => handleMonthButton(addMonth(currentDate))}></button>
                    </div>
                </div>
            </div>

            <div className="calendar-content">
                <div className="calendar-days-header">
                    {days.map((day, index) => (
                        <div key={index} className="days-header__day">
                            <span>
                                {day}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="calendar-dates">
                    {calendar.previousDates.map((cell, index) => (
                        <div key={index}
                            className="calendar-date__grey"
                            onClick={() => { setter(cell) }}>
                            <span className={getClassName(cell, "calendar-prev__month-date")}>
                                {cell.date.getDate()}
                            </span>
                        </div>
                    ))}

                    {calendar.currentDates.map((cell, index) => (
                        <div key={index}
                            className={
                                (cell.date.getDate() === new Date().getDate() && isCurrentMonth)
                                    ? "dates-today__date" : ""}
                            onClick={() => { setter(cell) }} >
                            <div className="date-top__wrapper">
                                <span className={getClassName(cell)}>
                                    {cell.date.getDate()}
                                </span>
                                <button type="button" className="calendar-event__btn" onClick={(e) => {
                                    handleAddEventButton(e, cell)
                                }} />
                            </div>
                            <div className="event-name__wrapper">
                                {cell.events.map((evt) => (
                                    <span
                                        key={evt.id}
                                        style={evt.eventType == 0
                                            ? { borderLeft: `5px solid #6ede8a` }
                                            : { borderLeft: `5px solid var(--color-cyan)` }}
                                        onClick={(e) => { handleEventButton(e, evt) }}
                                    >{evt.title}</span >
                                ))}
                            </div>
                        </div>
                    ))}

                    {calendar.nextDates.slice(0, calendarCellsCount - (calendar.previousDates.length + calendar.currentDates.length))
                        .map((cell, index) => (
                            <div key={index}
                                className="calendar-date__grey"
                                onClick={() => { setter(cell) }}>
                                <span className={getClassName(cell, "calendar-prev__month-date")}>
                                    {cell.date.getDate()}
                                </span>
                            </div>
                        ))}
                </div>
            </div>
        </div >
    );
};

const getClassName = (cell: CalendarCell, className?: string): string => {
    return cell.isHoliday ? `holiday ${className ?? ''}` : className ?? "";
}
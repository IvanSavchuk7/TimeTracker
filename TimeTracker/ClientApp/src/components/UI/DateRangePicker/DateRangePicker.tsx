import { datePickerDays } from '@components/constants';
import moment, { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import './dateRange.css';

export interface DatePickerCalendarType {
    previousDates: Moment[],
    currentDates: Moment[],
    nextDates: Moment[],
}

export interface PickerDateRange {
    startDate: Moment,
    endDate: Moment | null
}

export const DateRangePicker = ({ dateRange, setDateRange }: { dateRange: PickerDateRange, setDateRange: React.Dispatch<React.SetStateAction<PickerDateRange>> }) => {
    const [date, setDate] = useState<Moment>(moment());
    const [calendar, setCalendar] = useState<DatePickerCalendarType>({ previousDates: [], currentDates: [], nextDates: [] })

    useEffect(() => {
        generateCalendar(date)
    }, [date])

    const changeMonth = (month: number) => {
        setDate((prevDate) => moment(prevDate).month(month));
    };

    const selectDate = (selectedDate: Moment) => {
        if (dateRange.startDate === null) {
            setDateRange({ startDate: selectedDate, endDate: null });
        } else if (dateRange.startDate !== null && dateRange.endDate === null) {
            if (selectedDate.isSame(dateRange.startDate, 'day')) {
                setDateRange({ startDate: selectedDate, endDate: null });
            } else if (selectedDate.isBefore(dateRange.startDate)) {
                setDateRange({ startDate: selectedDate, endDate: null });
            } else {
                setDateRange({ ...dateRange, endDate: selectedDate });
            }
        } else {
            setDateRange({ startDate: selectedDate, endDate: null });
        }
    };

    const generateCalendar = (date: Moment) => {
        const newCalendar: DatePickerCalendarType = {
            previousDates: [],
            currentDates: [],
            nextDates: [],
        };

        const daysInMonth = date.daysInMonth();
        const firstDayDate = date.startOf('month');
        const previousMonth = date.clone().subtract(1, 'month');
        const previousMonthDays = previousMonth.daysInMonth();
        const nextMonth = date.clone().add(1, 'month');

        for (let i = firstDayDate.day(); i > 0; i--) {
            const previousMonthDate = previousMonth.clone().date(previousMonthDays - i + 1);
            newCalendar.previousDates.push(previousMonthDate);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const thisMonthDate = date.clone().date(i);
            newCalendar.currentDates.push(thisMonthDate);
        }

        const daysToAdd = 42 - (newCalendar.previousDates.length + newCalendar.currentDates.length);
        for (let i = 1; i <= daysToAdd; i++) {
            const nextMonthDate = nextMonth.clone().date(i);
            newCalendar.nextDates.push(nextMonthDate);
        }

        setCalendar(newCalendar);
    };

    const generateClassName = (selectedDate: Moment, className: string) => {
        if (moment().isSame(selectedDate, 'day'))
            className = `${className} active`

        if (selectedDate.isSame(dateRange.endDate, 'day'))
            return `${className} end`
        if (selectedDate.isSame(dateRange.startDate, 'day'))
            return dateRange.endDate ? `${className} start` : `${className} start end`;

        return selectedDate.isBetween(dateRange.startDate, dateRange.endDate, 'day', '[]') ? `${className} between` : className;
    }

    return (
        <div className="date-range-picker" >
            <nav className="date-range-picker--nav">
                <a onClick={() => changeMonth(date.month() - 1)}>&#8249;</a>
                <h1>{date.format('MMMM')} <small>{date.format('YYYY')}</small></h1>
                <a onClick={() => changeMonth(date.month() + 1)}>&#8250;</a>
            </nav>
            <nav className="date-range-picker--days">
                {datePickerDays.map((d) => (<span className="day-label" key={d}>{d}</span>))}
                {calendar.previousDates.map((d) => (
                    <span key={d.format('DD-MM')}
                        className={generateClassName(d, "day muted")}
                        onClick={() => { selectDate(d) }}>

                        {d.date()}
                    </span>))
                }
                {calendar.currentDates.map((d) => (
                    <span key={d.format('DD-MM')}
                        className={generateClassName(d, "day")}
                        onClick={() => { selectDate(d) }}>

                        {d.date()}
                    </span>))
                }
                {calendar.nextDates.map((d) => (
                    <span key={d.format('DD-MM')}
                        className={generateClassName(d, "day muted")}
                        onClick={() => { selectDate(d) }}>
                        {d.date()}
                    </span>))
                }
            </nav>
        </div>
    );
};

import { CurrentDateElement } from '@components/UI/Misc/CurrentDateElement';
import { SelectedDateElement } from '@components/UI/Misc/SelectedDateElement';
import { createWorkedHour, deleteWorkedHour, editWorkedHour } from '@redux/slices';
import { CreateWorkedHourType, UpdateWorkedHourType, WorkedHour } from '@redux/types';
import moment from 'moment';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from "react-redux";
import { GetFormattedDateString, GetInputUtcDateTimeString, GetTimeFromString } from '../../utils/dateTimeHelpers';
import "./trackers.css";



type Inputs = {
    id?: number
    startTime: string
    endTime: string
    date: string
}

interface TimeInputs {
    startTime: string
    endTime: string
}

export const TrackerSetHours = ({ userId, workedHour }: { userId: number, workedHour?: WorkedHour }) => {
    const defaultValues: TimeInputs = {
        startTime: workedHour ? workedHour.startDate.format("HH:mm") : '08:00',
        endTime: workedHour ? workedHour.endDate.format("HH:mm") : '16:00',
    }

    const [showDatePicker, setShowDatePicker] = useState<boolean>(true);
    const [selectedDate, setSelectedDate] = useState<string>(GetFormattedDateString(new Date));
    const [timeInputs, setTimeInputs] = useState<TimeInputs>(defaultValues);

    const dispatch = useDispatch();

    const handleShowDatePicker = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setShowDatePicker(!showDatePicker);
    }

    const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedDate(event.target.value);
        setShowDatePicker(!showDatePicker);
    }

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        setTimeInputs({ ...timeInputs, [name]: value });
    }

    const handleDelete = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        dispatch(deleteWorkedHour(workedHour!.id));
    }

    const { register, handleSubmit,
        formState: { errors }, reset } = useForm<Inputs>({
            mode: 'onBlur',
            defaultValues: {
                id: workedHour?.id,
                date: workedHour?.startDate.format("YYYY-MM-DD")
            }
        });

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const startTime = GetTimeFromString(data.startTime)
        const endTime = GetTimeFromString(data.endTime)


        if (workedHour) {
            workedHour.startDate
                .set({ 'hours': startTime.hours, 'minutes': startTime.minutes, 'seconds': startTime.seconds })
            workedHour.endDate
                .set({ 'hours': endTime.hours, 'minutes': endTime.minutes, 'seconds': endTime.seconds })

            dispatch(editWorkedHour({
                id: data.id,
                startDate: GetInputUtcDateTimeString(workedHour.startDate),
                endDate: GetInputUtcDateTimeString(workedHour.endDate),
            } as UpdateWorkedHourType))
        }
        else {
            const date = moment(selectedDate);
            const startDate = date.clone()
                .set({ 'hours': startTime.hours, 'minutes': startTime.minutes, 'seconds': startTime.seconds })
            const endDate = date.clone()
                .set({ 'hours': endTime.hours, 'minutes': endTime.minutes, 'seconds': endTime.seconds })

            dispatch(createWorkedHour({
                userId: userId,
                startDate: GetInputUtcDateTimeString(startDate),
                endDate: GetInputUtcDateTimeString(endDate),
            } as CreateWorkedHourType))
        }
    }
    return (
        <>
            {workedHour ? <CurrentDateElement date={workedHour!.startDate.toDate()} showFullDate={true} /> : <SelectedDateElement date={selectedDate} />}

            {!workedHour ?
                <div className="time-range__date-wrapper">
                    <button type='button' onClick={handleShowDatePicker}>
                        <input
                            type="date"
                            className="date-picker__input"
                            value={selectedDate}
                            {...register("date")}
                            onChange={handleDateChange}
                            style={!showDatePicker ? { display: 'none' } : {}} />
                    </button>
                </div> : <></>}

            <div className="set-hours-tracker">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="time-range__wrapper">
                        <div className="time-range__inner">
                            <input
                                type="time"
                                className="time-input"
                                value={timeInputs.startTime}
                                {...register("startTime")}
                                onChange={handleTimeChange}
                            />
                        </div>
                        <div className="time-range__separator">
                            <span>-</span>
                        </div>
                        <div className="time-range__inner">
                            <input
                                type="time"
                                className="time-input"
                                value={timeInputs.endTime}
                                {...register("endTime")}
                                onChange={handleTimeChange}
                            />
                        </div>
                    </div>

                    <div className="tracker-set-btn__wrapper">
                        {!workedHour ?
                            <div className='single-btn-wrapper'>
                                <button type="submit">Add</button>
                            </div>
                            :
                            <>
                                <div className='double-btn-wrapper'>
                                    <button type='submit' >Change</button>
                                    <button type="button" onClick={handleDelete}>Delete</button>
                                </div>
                            </>}
                    </div>
                </form>
            </div>
        </>
    );
};
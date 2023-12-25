import { SmallButton } from "@components/UI/Buttons/SmallButton";
import { useTypedSelector } from "@hooks/customHooks";
import { deleteWorkedHour, editWorkedHour } from '@redux/slices';
import { UpdateWorkedHourType, WorkedHour } from '@redux/types';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useDispatch } from "react-redux";
import { GetInputUtcDateTimeString, GetTimeFromString } from "../../utils/dateTimeHelpers";
import "./trackers.css";
import moment from "moment";

type Inputs = {
    id: number,
    startTime: string
    endTime: string
    date: string
}

interface TimeInputs {
    startTime: string
    endTime: string
}

export const DashboardTrackerSetHours = ({ workedHour }: { workedHour: WorkedHour }) => {
    const defaultValues: TimeInputs = {
        startTime: workedHour ? workedHour.startDate.format("HH:mm") : '08:00',
        endTime: workedHour ? workedHour.endDate.format("HH:mm") : '16:00',
    }

    const [timeInputs, setTimeInputs] = useState<TimeInputs>(defaultValues);

    const dispatch = useDispatch();
    const { user } = useTypedSelector(state => state.auth)

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
                id: workedHour.id,
                date: workedHour.startDate.format("YYYY-MM-DD")
            }
        });

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const startTime = GetTimeFromString(data.startTime)
        const endTime = GetTimeFromString(data.endTime)

        workedHour.startDate.set({ 'hours': startTime.hours, 'minutes': startTime.minutes, 'seconds': startTime.seconds })
        workedHour.endDate.set({ 'hours': endTime.hours, 'minutes': endTime.minutes, 'seconds': endTime.seconds })

        dispatch(editWorkedHour({
            id: data.id,
            startDate: GetInputUtcDateTimeString(workedHour.startDate),
            endDate: GetInputUtcDateTimeString(workedHour.endDate),
        } as UpdateWorkedHourType))
    }
    return (
        <div className="set-tracker-hours">
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="worked-time-range__wrapper">
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
                        <SmallButton type="submit" value="Add" /> :
                        <>
                            <div className='double-btn-wrapper'>
                                <button type='submit' >Change</button>
                                <button type="button" onClick={handleDelete}>Delete</button>
                            </div>
                        </>}
                </div>
            </form>
        </div>
    );
};
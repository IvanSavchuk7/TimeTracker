import { LargeButton } from "@components/UI/Buttons/LargeButton";
import { useAppDispatch } from '@hooks/customHooks';
import { deleteWorkedHour, editWorkedHour } from '@redux/slices';
import { UpdateWorkedHourType, WorkedHour } from '@redux/types';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { GetInputUtcDateTimeString, GetTimeFromString } from "../../utils/dateTimeHelpers";
import { months } from "../constants";

interface WorkedHourFormProps {
    setIsOpen: (val: WorkedHour | null) => void,
    workedHour: WorkedHour
}

interface TimeInputs {
    startTime: string
    endTime: string
}

interface Inputs extends TimeInputs {
    id: number,
}

export const WorkedHourForm = ({ setIsOpen, workedHour }: WorkedHourFormProps) => {
    const defaultValues: TimeInputs = {
        startTime: workedHour ? workedHour.startDate.format("") : '08:00',
        endTime: workedHour ? workedHour.endDate.format("") : '16:00',
    }

    const showDate = `${workedHour.startDate.toDate().getDate()} ${months[workedHour.startDate.toDate().getMonth()]}`;
    const dispatch = useAppDispatch();

    const [timeInputs, setTimeInputs] = useState<TimeInputs>(defaultValues);

    const { register, handleSubmit,
        formState: { errors }, reset } = useForm<Inputs>({
            mode: 'onBlur',
            defaultValues: {
                id: workedHour.id,
            }
        });

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        setTimeInputs({ ...timeInputs, [name]: value });
    }

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
        setIsOpen(null);
    }

    const handleDelete = (workedHour: WorkedHour) => {
        dispatch(deleteWorkedHour(workedHour.id))
        setIsOpen(null);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <span>{`Manage work sprint on ${showDate}:`}</span>

            <div className="time-range-wrapper">
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
            <div className='button-group-wrapper'>
                <LargeButton type="submit" value="Change work spring" />
                <div className='delete-button-wrapper'>
                    <button type="button" className="reset-btn" onClick={() => { handleDelete(workedHour) }}>
                        Delete
                    </button>
                </div>
            </div>
        </form>
    );
};
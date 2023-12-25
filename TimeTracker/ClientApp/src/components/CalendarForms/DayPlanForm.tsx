import { LargeButton } from "@components/UI/Buttons/LargeButton";
import { useAppDispatch, useTypedSelector } from '@hooks/customHooks';
import { deleteWorkPlan, setWorkPlan } from '@redux/slices';
import { SchedulerWorkPlan, SetWorkPlanType } from '@redux/types';
import { GetFormattedDateString, GetFormattedUTCTimeString } from '@utils/dateTimeHelpers';
import React, { useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { months } from '../constants';
import "./eventForms.css";
import { WorkPlanFormProps } from './props';

type Inputs = {
    id: number | null,
    userId: number,
    date: Date,
    startTime: string,
    endTime: string,
}
interface TimeInputs {
    startTime: string
    endTime: string
}

export const DayPlanForm = ({ date, setIsOpen, workPlan }: WorkPlanFormProps) => {
    const defaultValues: TimeInputs = {
        startTime: workPlan ? workPlan.startTime : '08:00',
        endTime: workPlan ? workPlan.endTime : '16:00',
    }
    const showDate = `${date.getDate()} ${months[date.getMonth()]}`;
    const dispatch = useAppDispatch();

    const [timeInputs, setTimeInputs] = useState<TimeInputs>(defaultValues);

    const { user } = useTypedSelector(state => state.auth)

    const { register, handleSubmit, setValue,
        formState: { errors }, reset } = useForm<Inputs>({
            mode: 'onBlur',
            defaultValues: {
                id: workPlan ? workPlan.id : null,
                userId: user!.id,
                date: date
            }
        });

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        setTimeInputs({ ...timeInputs, [name]: value });
    }

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const dateStr = GetFormattedDateString(date)

        dispatch(setWorkPlan({
            id: data.id,
            userId: user!.id,
            startTime: GetFormattedUTCTimeString(data.startTime, dateStr),
            endTime: GetFormattedUTCTimeString(data.endTime, dateStr),
            date: dateStr
        } as SetWorkPlanType))

        setIsOpen(null);


    }

    const handleDelete = (workPlan: SchedulerWorkPlan) => {
        dispatch(deleteWorkPlan(workPlan))
        setIsOpen(null);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <span>{workPlan ? `Manage your work plan:` : `Add work plan for ${showDate}:`}</span>

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
                <LargeButton type="submit" value={workPlan ? "Change plan" : "Add plan"} />
                {workPlan &&
                    <div className='delete-button-wrapper'>
                        <button type="button" className="reset-btn" onClick={() => { handleDelete(workPlan) }}>
                            Delete
                        </button>
                    </div>
                }</div>
        </form>
    );
};
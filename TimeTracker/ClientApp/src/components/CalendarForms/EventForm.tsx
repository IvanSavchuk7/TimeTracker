import { LargeButton } from "@components/UI/Buttons/LargeButton";
import { Dropdown } from "@components/UI/Dropdowns/Dropdown";
import { TextInput } from "@components/UI/Inputs/TextInput";
import { useAppDispatch } from '@hooks/customHooks';
import { EventType } from '@redux/enums';
import {deleteCalendarEvent, modalClose, setCalendarEvent} from '@redux/slices';
import { CalendarEvent, SetCalendarEventType } from '@redux/types';
import { useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { GetFormattedDateString } from '@utils/dateTimeHelpers.ts';
import { months } from '../constants';
import "./eventForms.css";
import { EventFormProps } from "./props";

type Inputs = {
    id: number | undefined,
    date: Date,
    title: string,
    eventType: number
    startTime?: string,
    endTime?: string,
}
interface TimeInputs {
    startTime: string
    endTime: string
}

export const EventForm = ({ date, setIsOpen, event }: EventFormProps) => {
    const dispatch = useAppDispatch();
    const defaultValues: TimeInputs = {
        startTime: '08:00',
        endTime: '16:00',
    }

    const [showTimeRange, setShowTimeRange] = useState<boolean>(false);
    const [timeInputs, setTimeInputs] = useState<TimeInputs>(defaultValues);
    const showDate = `${date.getDate()} ${months[date.getMonth()]}`;

    function handle(){
        dispatch(modalClose());
    }
    const isHoliday = (date: Date): boolean => {
        return date.getDay() == 0 || date.getDay() == 6
    }

    const { register, handleSubmit, setValue,
        formState: { errors }, reset } = useForm<Inputs>({
            mode: 'onBlur',
            defaultValues: {
                id: event?.id,

                date: date
            }
        });

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        dispatch(setCalendarEvent({
            date: GetFormattedDateString(new Date(data.date)),
            eventType: data.eventType,
            title: data.title
        } as SetCalendarEventType))
        setIsOpen(null);
    }

    const handleDelete = (evt: CalendarEvent) => {
        dispatch(deleteCalendarEvent(evt))
        setIsOpen(null);
    }

    const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = event.target;
        setTimeInputs({ ...timeInputs, [name]: value });
    }

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = parseInt(e.currentTarget.value);

        setShowTimeRange(value == EventType.Shortday)
    }

    const options: { value: any, name: string }[] = [
        isHoliday(date)
            ? {
                value: EventType.Workday,
                name: "Workday"
            }
            : {
                value: EventType.Holiday,
                name: "Holiday"
            },
        {
            value: EventType.Shortday,
            name: "Shortday"
        }
    ]

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <span>{event ? `Manage "${event.title}" event` : `Add event for ${showDate}`}</span>

            <div className='form-inputs-wrapper'>
                <TextInput name="title" placeholder="Title" register={register("title", { required: "Title can't be empty!" })} errors={errors.title} />

                <Dropdown title='Choose' options={options} onSelectChange={(e) => handleChange(e)} />
            </div>
            {showTimeRange &&
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
            }

            <div className='button-group-wrapper'>
                <LargeButton type="submit" value={event ? "Change event" : "Add event"} />
                {event &&
                    <div className='delete-button-wrapper'>
                        <button type="button" className="reset-btn" onClick={() => { handleDelete(event) }}>
                            Delete
                        </button>
                    </div>
                }</div>
        </form>
    );
};

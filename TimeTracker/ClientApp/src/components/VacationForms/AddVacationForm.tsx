import { SmallButton } from '@components/UI/Buttons/SmallButton';
import { TextInput } from '@components/UI/Inputs/TextInput';
import React, { useEffect, useRef } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { useAppDispatch, useTypedSelector } from "../../hooks";
import { createVacation, fetchVacationDays, updateApproversVacations } from "../../redux";



interface VacationInput {
    startDate: Date,
    endDate: Date,
    message?: string
}
interface AddVacationFormProps {
    isOpen: boolean,
    setIsOpen: (open: boolean) => void,
}
export const AddVacationForm = ({ isOpen, setIsOpen }: AddVacationFormProps) => {

    const { register, handleSubmit,
        formState: { errors }, reset } = useForm<VacationInput>({
            mode: 'onBlur',
            defaultValues: {
                startDate: new Date(),
                endDate: new Date(),
                message: ''
            }
        });

    const backRef = useRef<HTMLDivElement>(null);
    const user = useTypedSelector(u => u.auth.user);
    const { vacationDays, loading: userLoading }
        = useTypedSelector(s => s.user);
    const { loading, error, created, createdId }
        = useTypedSelector(s => s.vacations);

    const dispatch = useAppDispatch();

    useEffect(() => {
        dispatch(fetchVacationDays(user?.id!));
    }, []);

    useEffect(() => {
        if (created) {
            dispatch(updateApproversVacations({ vacationId: createdId!, userId: user?.id! }))
        }
    }, [created])


    const onSubmit: SubmitHandler<VacationInput> = (data) => {
        dispatch(createVacation({ ...data, userId: user?.id! }));
        reset()
        setIsOpen(false);
    }

    function hideElements(e: React.MouseEvent<HTMLDivElement>) {
        e.stopPropagation();
        if (backRef.current === e.target) {
            backRef.current.style.display = "none";
            setIsOpen(false);
        }
    }

    return (
        <div ref={backRef} onClick={e => hideElements(e)} className="black-rga" style={{ display: `${isOpen ? 'flex' : 'none'}` }}>
            <form onSubmit={handleSubmit(onSubmit)} className="add-vacation__form">
                <label style={{ marginLeft: "5px" }}>Start date</label>
                <input {...register("startDate")} name="startDate" className="text-input" type="date" placeholder="Start date" />
                <label style={{ marginLeft: "5px" }}>End date</label>
                <input {...register("endDate")} name="endDate" className="text-input" type="date" placeholder="End date" />
                <TextInput name="message" register={register("message")} placeholder="Message" />
                <SmallButton type="submit" value="Create vacation" />
            </form>
        </div>
    );
};
import { LargeButton } from "@components/UI/Buttons/LargeButton";
import { PasswordInput } from "@components/UI/Inputs/PasswordInput";
import { useAppDispatch } from "@hooks/customHooks";
import { userVerify } from "@redux/slices";
import { useState } from "react";
import { SubmitHandler, useForm } from 'react-hook-form';
import { Navigate } from "react-router-dom";
import "./UserVerify.css";

type Inputs = {
    password: string
}

export const UserVerify = () => {

    const dispatch = useAppDispatch();
    const urlParams = new URLSearchParams(window.location.search)
    const [param, setParam] = useState<string | null>(urlParams.get('verify'));

    const { register, handleSubmit,
        formState: { errors }, reset } = useForm<Inputs>({
            mode: 'onBlur',
            defaultValues: {
                password: ''
            }
        });

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        dispatch(userVerify({ token: param!, password: data.password }));
        reset();
    }

    switch (param) {
        case null:
            return (<Navigate to='/notFound' />)
        default:
            return (
                <div className="user-verify-page-wrapper">
                    <form className="user-password-form" onSubmit={handleSubmit(onSubmit)}>
                        <PasswordInput name="password" placeholder="Password" register={register("password", { required: "Password can't be empty!" })} errors={errors.password} />
                        <LargeButton type="submit" value="Confirm" />
                    </form>
                </div>
            );
    }
}
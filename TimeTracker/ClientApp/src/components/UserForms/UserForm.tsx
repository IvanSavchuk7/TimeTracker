import { SmallButton } from "@components/UI/Buttons/SmallButton";
import { CheckboxInput } from "@components/UI/Inputs/CheckboxInput";
import { RangeInput } from "@components/UI/Inputs/RangeInput";
import { TextInput } from "@components/UI/Inputs/TextInput";
import { StepsElement } from "@components/UI/Misc/StepsElement";
import { useAppDispatch, useTypedSelector } from "@hooks/customHooks";
import { Permission } from "@redux/enums";
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import "./AddUserForms.css";
import { Inputs, UserFormProps } from "./props";



const options: Permission[] = [
    Permission.Create,
    Permission.Update,
    Permission.Delete,
    Permission.Read,
];


export const UserForm = ({ formDataHandler, step }: UserFormProps) => {
    const dispatch = useAppDispatch();
    const { user } = useTypedSelector(state => state.user)

    const [checkedOptions, setCheckedOptions] = useState<number>(0);
    const [hoursPerMonthValue, setHoursPerMonthValue] = useState<number>(100);

    const { register, handleSubmit, setValue,
        formState: { errors }, reset } = useForm<Inputs>({
            mode: 'onBlur',
            defaultValues: {
                hoursPerMonth: hoursPerMonthValue,
                permissions: checkedOptions,
            }
        });

    useEffect(() => {
        if (user) {
            setValue("firstName", user.firstName);
            setValue("lastName", user.lastName);
            setValue("email", user.email);
            setValue("id", user.id);
            setCheckedOptions(user.permissions);
            setHoursPerMonthValue(user.hoursPerMonth);
        }
    }, [user])

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        data.permissions = checkedOptions;
        data.hoursPerMonth = parseInt((hoursPerMonthValue).toString())
        formDataHandler(data);

        if (!user) {
            reset();
            setCheckedOptions(0)
            setHoursPerMonthValue(100)
        }
    }

    return (
        <div className="user-form__wrapper-inner">
            <form onSubmit={handleSubmit(onSubmit)}>
                {step ? <StepsElement title="Step 1/2" currentStep={1} /> : <></>}
                <span className="user-form__title">{step ? "User registration:" : "Edit user:"}</span>
                <TextInput name="firstName" placeholder="First name"
                    register={register("firstName", { required: "First name can't be empty!" })}
                    errors={errors.firstName} />

                <TextInput name="lastName" placeholder="Last name"
                    register={register("lastName", { required: "Last name can't be empty!" })}
                    errors={errors.lastName} />

                <TextInput name="email" placeholder="Enter email"
                    register={register("email", { required: "Email name can't be empty!" })}
                    errors={errors.email} />

                <RangeInput title="Select working hours %:" minRange={25} maxRange={100} step={5} value={hoursPerMonthValue} onChange={setHoursPerMonthValue} />

                <CheckboxInput title="Select user permissions:" options={options}
                    register={register('permissions')}
                    selected={checkedOptions}
                    setSelected={setCheckedOptions}
                    values={Permission}
                    isMultipleChoice={true}
                />

                <SmallButton type="submit" value={step ? "Create user" : "Save changes"} />
            </form>
        </div>
    );
};
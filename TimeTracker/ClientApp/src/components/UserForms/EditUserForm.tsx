import { SmallButton } from '@components/UI/Buttons/SmallButton';
import { CheckboxInput } from '@components/UI/Inputs/CheckboxInput';
import { TextInput } from '@components/UI/Inputs/TextInput';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm } from "react-hook-form";
import { useParams } from 'react-router-dom';
import { useAppDispatch, useTypedSelector } from "../../hooks";
import { Permission, User, editUser, fetchUser } from '../../redux';
import { RangeInput } from "../UI/Inputs/RangeInput";

type Inputs = {
    hoursPerMonth: number,
    permissions: number,
}

const options: Permission[] = [
    Permission.Create,
    Permission.Update,
    Permission.Delete,
    Permission.Read,
];

const EditUserForm = () => {
    const { userId } = useParams();
    const dispatch = useAppDispatch();
    const { user, loading } = useTypedSelector(state => state.user);

    useEffect(() => {
        dispatch(fetchUser(parseInt(userId!)))
    }, []);

    const [checkedOptions, setCheckedOptions] = useState<number>(user ? user!.permissions : 0);
    const [hoursPerMonthValue, setHoursPerMonthValue] = useState<number>(user ? user!.permissions : 0);

    useEffect(() => {
        setCheckedOptions(user ? user.permissions : 0);
        setHoursPerMonthValue(user ? user!.hoursPerMonth : 0);
    }, [user])


    const { register, handleSubmit,
        formState: { errors }, reset } = useForm<Inputs>({
            mode: 'onBlur',
            defaultValues: {
                hoursPerMonth: hoursPerMonthValue,
                permissions: checkedOptions,
            }
        });

    const onSubmit: SubmitHandler<Inputs> = () => {
        const editedUser = {
            id: user!.id,
            permissions: checkedOptions,
            hoursPerMonth: parseInt((hoursPerMonthValue).toString())
        }
        dispatch(editUser(editedUser as User));
    }

    return (
        <div className="user-form__wrapper-inner edit-form__wrapper-inner">
            <form onSubmit={handleSubmit(onSubmit)}>
                <span className="user-form__title">Edit user:{`${user?.firstName} ${user?.lastName}`}</span>
                <TextInput name="firstName" placeholder={user?.firstName!} />

                <TextInput name="lastName" placeholder={user?.lastName!} />

                <TextInput name="email" placeholder={user?.email!} />

                <RangeInput title="Select working hours %:" minRange={25} maxRange={100} step={5} value={hoursPerMonthValue} onChange={setHoursPerMonthValue} />

                <CheckboxInput
                    title="Select user permissions:"
                    options={options}
                    register={register('permissions')}
                    selected={checkedOptions}
                    setSelected={setCheckedOptions}
                    isMultipleChoice={true}
                    values={Permission}
                />
                <SmallButton type="submit" value="Confirm" />
            </form>
        </div>
    );
};
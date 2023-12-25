import { AddApproversForm } from "@components/UserForms//AddApproversForm";
import { useAppDispatch, useTypedSelector } from '@hooks/customHooks';
import { fetchUser } from '@redux/slices';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';


export const AddApprovers = () => {
    const dispatch = useAppDispatch();
    const { user } = useTypedSelector(state => state.user)
    const { userId } = useParams();

    useEffect(() => {
        if (!user)
            dispatch(fetchUser(parseInt(userId!)))
    }, [])

    return (
        <div className="user-form__wrapper">
            <AddApproversForm />
        </div>
    )

};
import React from 'react';
import {GetUserFromToken, IsUserAuthenticated} from "@utils/authProvider.ts";
import {useAppDispatch, useTypedSelector} from "@hooks/customHooks.ts";
import {refreshToken} from "@redux/slices";

type IAuthMiddleware = {
    children: React.ReactElement;
};

const AuthMiddleware:React.FC<IAuthMiddleware> = ({children}) => {

    const dispatch = useAppDispatch();

    const cookieUser = GetUserFromToken();


    if(!IsUserAuthenticated()&&cookieUser!==null){
       dispatch(refreshToken(cookieUser.id));
    }

    return (
        children
    );
};

export default AuthMiddleware;

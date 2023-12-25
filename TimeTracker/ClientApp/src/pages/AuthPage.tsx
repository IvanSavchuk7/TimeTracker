import React, {useEffect, useState} from 'react';
import './GoogleAuthCard.css'
import {useAppDispatch, useTypedSelector} from "@hooks/customHooks.ts";
import {
    authorizeWithEmail,
    authorizeWithEmailFail,
    getAccessToken,
    getUserInfoFromToken,
    loginSuccess
} from "@redux/slices";
import {GetUserFromToken, IsUserAuthenticated} from "@utils/authProvider.ts";
import {Navigate} from "react-router-dom";
const AuthPage = () => {


    const dispatch = useAppDispatch();
    const {error,accessToken,status,userToken,userEmail} = useTypedSelector(s=>s.auth);
    const searchParams = new URLSearchParams(window.location.search);

    const code = searchParams.get('code');
    const  [message,setMessage]  = useState<string>("Your authorization is being processed. Wait for the result")
    const  authType = localStorage.getItem("authType");

    if(IsUserAuthenticated()){
        return <Navigate to="/"/>
    }

    useEffect(() => {
        if(code&&authType){
            dispatch(getAccessToken({
                code:code,
                authType:authType
            }));
        }
    }, []);

    useEffect(() => {
        if(accessToken!==""){
            dispatch(getUserInfoFromToken({
                token:accessToken,
                authType:authType!
            }));
            localStorage.clear();
        }
    }, [accessToken]);

    useEffect(() => {
        if(userEmail!==""){
            dispatch(authorizeWithEmail(userEmail));
        }
    }, [userEmail]);

    useEffect(() => {
        if(userToken!==""){
            dispatch(loginSuccess(userToken));
            window.location.href="/";
        }
    }, [userToken]);

    return (
        <div className="google-auth-card">
            <div className="google-auth-card-inner">
                <div>
                    <h1 style={{fontSize:"20px",color:"#023047",padding:"5px"}}>
                        {message}
                    </h1>
                    {error&&<h1 style={{fontSize:"20px",color:"red",padding:"5px"}}>
                        {error}
                    </h1>}
                </div>
            </div>
        </div>
    );
};

export default AuthPage;

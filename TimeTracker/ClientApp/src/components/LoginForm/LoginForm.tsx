import {LargeButton} from '@components/UI/Buttons/LargeButton';
import {PasswordInput} from '@components/UI/Inputs/PasswordInput';
import {TextInput} from '@components/UI/Inputs/TextInput';
import {Loader} from '@components/UI/Loaders/Loader';
import {InputTooltip} from '@components/UI/Tooltips/InputTooltip';
import {SubmitHandler, useForm} from 'react-hook-form';
import {useAppDispatch, useTypedSelector} from "../../hooks";
import {auth, login, loginSuccess, loginWithCode, verifyUserLogin} from "../../redux";
import {H1, H5} from "../Headings";
import "./LoginForm.css";
import googleImg from '../../assets/images/search.png'
import githubImg from '../../assets/images/github.png'
import {useEffect, useState} from "react";

export type Inputs = {
    email: string
    password: string
}

export const LoginForm = () => {
    const dispatch = useAppDispatch();
    const {loading, error,twoStepCodeStatus,userToken, user, verifiedUser, currentAuth} = useTypedSelector(state => state.auth);

    const [step, setStep] = useState<number>(0);

    const [val,setVal] = useState<string>("");

    const [showTwoStep, setShowTwoStep] = useState<boolean>(false);

    const [data,setData] = useState<Inputs>({
        email:"",
        password:""
    })


    const stepMsg = ['Sign in', 'Enter the code']

    const {
        register, handleSubmit,
        formState: {errors}, reset
    } = useForm<Inputs>({
        mode: 'onBlur',
        defaultValues: {
            email: '',
            password: ''
        }
    });

    useEffect(() => {
        if(verifiedUser==null){
            return;
        }
        if(verifiedUser.isTwoStepAuthEnabled){
            setShowTwoStep(true);
            setStep(1);
        }else{
            dispatch(login(data));
        }
    }, [verifiedUser]);

    useEffect(() => {
        if(userToken!==""){
            setStep(0);
            setShowTwoStep(false);
            dispatch(loginSuccess(userToken))
        }
    }, [userToken]);

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        dispatch(verifyUserLogin(data));
        setData(data);
    }


    function handleAuthClick(e: React.MouseEvent<HTMLAnchorElement>) {
        e.preventDefault();
        const authType = e.currentTarget.id;
        localStorage.setItem("authType", authType);
        window.location.href = `/to-external-auth?authType=${authType}`;
    }

    function authWithCode(){
        dispatch(loginWithCode({
            id:verifiedUser?.id!,
            code:val
        }))
    }

    const LoginFromFirstStep = () => {

        return (
            <>
                <div className="external-auth-wrapper" style={{width: "65%"}}>
                    <a id="google" onClick={(e) => handleAuthClick(e)} className="external-auth"
                       href="/to-external-auth?authType=google">
                        <span>Continue with Google</span>
                        <img style={{width: "25px", height: "25px"}} src={googleImg} alt=""/>
                    </a>
                    <a id="github" onClick={(e) => handleAuthClick(e)} className="external-auth"
                       href="/to-external-auth?authType=github">
                        <span>Continue with Github</span>
                        <img style={{width: "25px", height: "25px"}} src={githubImg} alt=""/>
                    </a>
                </div>

                <div className="or">
                    <span className="or-text">OR</span>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="login-form">
                    <div className="login-inputs__wrapper">
                        <TextInput name="email" placeholder="Enter your work email"
                                   register={register("email", {required: "Email can't be empty!"})}
                                   errors={errors.email}/>

                        <div className="password-input__wrapper">
                            <PasswordInput name="password" placeholder="Password"
                                           register={register("password", {required: "Password can't be empty!"})}
                                           errors={errors.password}/>

                            <InputTooltip description="Forgot your password?" url="/passwordRecovery"
                                          urlTitle="Click here"/>
                        </div>
                    </div>

                    <div className="tooltip-wrapper__bold" style={{display: 'none'}}>
                        <InputTooltip description="Don't have an account?" url="/auth" urlTitle="Get started"/>
                    </div>
                    <div className='submit-wrapper'>
                        <LargeButton  type="submit" value="Login"/>
                    </div>
                </form>
            </>
        );
    }

    return (
        <div className="login-form__wrapper">
            <H1 value={stepMsg[step]}/>
            <div className="login-form__messages-wrapper" style={{display: `${error ? "flex" : "none"}`}}>
                {loading ? <Loader/> : ""}
                <H5 value={error ? error : ""}/>
            </div>
            {showTwoStep?<div className="login-form" style={{gap:"15px",marginTop:"20px"}}>
                <input onChange={(e)=>{
                    setVal(e.target.value);
                }} value={val} className="text-input" type="text" placeholder="You code"/>
                <LargeButton handleClick={authWithCode} type="submit" value="Login"/>
            </div>:<LoginFromFirstStep />}
        </div>
    );
}
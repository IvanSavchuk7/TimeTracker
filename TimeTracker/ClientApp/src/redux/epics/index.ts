import { combineEpics, Epic } from "redux-observable";
import { catchError } from "rxjs";
import {
    authorizeWithEmailEpic,
    codeVerifyEpic,
    createPasswordEpic,
    EnableTwoStepVerifyEpic,
    externalAuthorizeEpic,
    GetQrCodeEpic,
    getUserInfoFromTokenEpic,
    LoginWithCodeEpic,
    refreshTokenEpic,
    resetPasswordEpic,
    userLoginEpic,
    verifyUserLoginEpic
} from './auth'
import {
    userEpics
} from './user'
import {usersEpics} from "./users";
import {vacationEpics} from "./vacation";
import { addApproversEpic, fetchApproversEpic } from "./approvers";
import {vacationApproverEpics } from "./approverVacation";
import { workedHourEpics } from "./timeTracker";
import { calendarEpics } from "./calendar";






export const rootEpic: Epic = (action$, store$, dependencies) =>
    combineEpics(
        userLoginEpic,
        addApproversEpic,
        fetchApproversEpic,
        refreshTokenEpic,
        resetPasswordEpic,
        codeVerifyEpic,
        createPasswordEpic,
        externalAuthorizeEpic,
        getUserInfoFromTokenEpic,
        authorizeWithEmailEpic,
        verifyUserLoginEpic,
        LoginWithCodeEpic,
        GetQrCodeEpic,
        EnableTwoStepVerifyEpic,
        ...userEpics,
        ...usersEpics,
        ...workedHourEpics,
        ...vacationEpics,
        ...vacationApproverEpics,
        ...calendarEpics

    )
        (action$, store$, dependencies).pipe(
            catchError((error, source) => {
                console.error(error);
                return source;
            })
        );
import { Epic, ofType } from "redux-observable";
import { PayloadAction } from "@reduxjs/toolkit";
import { catchError, map, mergeMap, Observable, of } from "rxjs";

import {
    AddUserQuery,
    PasswordConfirmQuery,
    FetchUserQuery,
    EditUserQuery,
    FetchUserVacationDays,
    DeleteUser,
    EmailConfirmQuery,

    UpdateTwoStepAuthQuery
} from "@redux/queries";
import {
    userAddFail, userAddSuccess,
    verifyFail, verifySuccess,
    fetchUserFail, fetchUserSuccess,
    editUserFail, editUserSuccess,
    fetchVacationDaysFail, fetchVacationDaysSuccess,
    deleteUserFail, deleteUserSuccess, updateTwoStepAuthFail, updateTwoStepAuthSuccess
} from '../slices';
import {UpdateTwoStepAuth, UpdateWorkedHourType, UserAddType, WorkedFetchType} from "../types";
import { User } from "../intrerfaces";
import { GetErrorMessage } from "../../utils";

export const addUserEpic: Epic = (action: Observable<PayloadAction<UserAddType>>, state) =>
    action.pipe(
        ofType("user/userAdd"),
        mergeMap(action =>
            AddUserQuery(action.payload).pipe(
                mergeMap(async resp => {
                    if (resp.response.errors != null) {
                        const errorMessage = await GetErrorMessage(resp.response.errors[0].message);
                        return userAddFail(errorMessage)
                    }
                    return userAddSuccess(resp.response.data.userMutation.create);
                }),
                catchError((e: Error) => {
                    return of(userAddFail("Unexpected error"))
                })
            ),
        )
    );

export const passwordConfirmEpic: Epic = (action: Observable<PayloadAction<{ token: string, password: string }>>, state) =>
    action.pipe(
        ofType("user/userVerify"),
        mergeMap(action =>
            PasswordConfirmQuery(action.payload).pipe(
                mergeMap(async resp => {
                    console.log(resp)
                    if (resp.response.errors != null) {
                        const errorMessage = await GetErrorMessage(resp.response.errors[0].message);
                        return verifyFail(errorMessage)
                    }
                    return verifySuccess();
                }),
                catchError((e: Error) => {
                    return of(verifyFail("Unexpected error"))
                })
            ),
        )
    );

export const fetchUserEpic: Epic = (action: Observable<PayloadAction<number>>, state) =>
    action.pipe(
        ofType("user/fetchUser"),
        mergeMap(action =>
            FetchUserQuery(action.payload).pipe(
                mergeMap(async resp => {
                    if (resp.response.errors != null) {
                        const errorMessage = await GetErrorMessage(resp.response.errors[0].message);
                        return fetchUserFail(errorMessage)
                    }
                    return fetchUserSuccess(resp.response.data.userQuery.user);
                }),
                catchError((e: Error) => {
                    console.log(e);
                    return of(verifyFail("Unexpected error"))
                })
            ),
        )
    );

export const editUserEpic: Epic = (action: Observable<PayloadAction<User>>, state) =>
    action.pipe(
        ofType("user/editUser"),
        mergeMap(action =>
            EditUserQuery(action.payload)
                .pipe(
                    mergeMap(async resp => {
                        if (resp.response.errors != null) {
                            const errorMessage = await GetErrorMessage(resp.response.errors[0].message);
                            return editUserFail(errorMessage)
                        }
                        console.log("successfully");
                        return editUserSuccess();
                    }),
                    catchError((e: Error) => {
                        console.log(e);
                        return of(verifyFail("Unexpected error"))
                    })
                ),
        )
    );

export const fetchVacationDaysEpic: Epic = (action: Observable<PayloadAction<number>>, state) =>
    action.pipe(
        ofType("user/fetchVacationDays"),
        mergeMap(action => FetchUserVacationDays(action.payload)
            .pipe(
                map(res => {
                    if (res.response.errors != null) {
                        return fetchVacationDaysFail(res.response.errors[0].message)
                    }
                    return fetchVacationDaysSuccess(res.response.data.userQuery.user.vacationDays);
                }),
                catchError((e: Error) => of(fetchVacationDaysFail("Error")))
            ),
        )
    );

export const DeleteUserEpic: Epic = (action: Observable<PayloadAction<number>>) =>
    action.pipe(
        ofType('users/deleteUser'),
        mergeMap(action =>
            DeleteUser(action.payload)
                .pipe(
                    map(res => {
                        if (res.response.errors != null) {
                            return deleteUserFail(res.response.errors[0].message)
                        }
                        return deleteUserSuccess(res.response.data.userMutation.deleteById);
                    }),
                    catchError((e: Error) => of(deleteUserFail("error")))
                )
        )
    )

export const emailConfirmEpic: Epic = (action: Observable<PayloadAction<string>>, state) =>
    action.pipe(
        ofType("user/emailVerify"),
        mergeMap(action =>
            EmailConfirmQuery(action.payload).pipe(
                mergeMap(async resp => {
                    console.log(resp)
                    if (resp.response.errors != null) {
                        const errorMessage = await GetErrorMessage(resp.response.errors[0].message);
                        return verifyFail(errorMessage)
                    }
                    return verifySuccess();
                }),
                catchError((e: Error) => {
                    return of(verifyFail("Unexpected error"))
                })
            ),
        )
    );

export  const updateTwoStepAuthEpic:Epic = (action$:Observable<PayloadAction<UpdateTwoStepAuth>>)=>
    action$.pipe(
        ofType("user/updateTwoStepAuth"),
        mergeMap(action$=>
            UpdateTwoStepAuthQuery(action$.payload).pipe(
                map(res=>{
                    return updateTwoStepAuthSuccess(res.response.data.userMutation.updateTwoStepAuth);
                }),
                catchError((e: Error) => {
                    console.log(e);
                    return of(updateTwoStepAuthFail(e.message))
                })
            )
        )
    )



export const userEpics = [
    addUserEpic,
    DeleteUserEpic,
    passwordConfirmEpic,
    fetchUserEpic,
    editUserEpic,
    fetchVacationDaysEpic,
    emailConfirmEpic,
    updateTwoStepAuthEpic
]

import {
    CreateWorkedHoursQuery,
    DeleteWorkedHoursQuery,
    FetchWorkedHoursQuery,
    UpdateWorkedHoursQuery,
    WorkedHoursStatistic
} from "@redux/queries";
import { CreateWorkedHourType, UpdateWorkedHourType, WorkedFetchType, WorkedHour, WorkedHoursStatisticInput } from '@redux/types';
import { PayloadAction } from "@reduxjs/toolkit";
import { Epic, ofType } from "redux-observable";
import { Observable, catchError, map, mergeMap, of, withLatestFrom } from "rxjs";
import { RootState } from "..";
import { GetNewWorkedHour } from "../../utils/dateTimeHelpers";
import { GetErrorMessage } from "../../utils";
import {
    createWorkedHourFail,
    createWorkedHourSuccess,
    deleteWorkedHourFail,
    deleteWorkedHourSuccess,
    editWorkedHourFail,
    editWorkedHourSuccess,
    fetchWorkedHoursFail, fetchWorkedHoursStatisticFail, fetchWorkedHoursStatisticSuccess,
    fetchWorkedHoursSuccess,
    resetTimerFail,
    resetTimerSuccess
} from '../slices';

export const createWorkedHourEpic: Epic = (action: Observable<PayloadAction<CreateWorkedHourType>>, state) =>
    action.pipe(
        ofType("workedHours/createWorkedHour"),
        mergeMap(action =>
            CreateWorkedHoursQuery(action.payload).pipe(
                mergeMap(async resp => {
                    if (resp.response.errors != null) {
                        console.log(resp.response)
                        const errorMessage = await GetErrorMessage(resp.response.errors[0].message);
                        return createWorkedHourFail(errorMessage)
                    }
                    return createWorkedHourSuccess(resp.response.data.workedHourMutations.create);
                }),
                catchError((e: Error) => {
                    console.log(e)
                    return of(createWorkedHourFail("Unexpected error"))
                })
            ),
        )
    );

export const resetTimerEpic: Epic = (action: Observable<PayloadAction<CreateWorkedHourType>>, state) =>
    action.pipe(
        ofType("timer/resetTimer"),
        mergeMap(action =>
            CreateWorkedHoursQuery(action.payload).pipe(
                mergeMap(async resp => {
                    if (resp.response.errors != null) {
                        console.log(resp.response)
                        const errorMessage = await GetErrorMessage(resp.response.errors[0].message);
                        return resetTimerFail(errorMessage)
                    }
                    return resetTimerSuccess(resp.response.data.workedHourMutations.create);
                }),
                catchError((e: Error) => {
                    console.log(e)
                    return of(resetTimerFail("Unexpected error"))
                })
            ),
        )
    );

export const resetTimerSuccessEpic: Epic = (action: Observable<PayloadAction<WorkedHour>>, state) =>
    action.pipe(
        ofType("timer/resetTimerSuccess"),
        mergeMap(action => {
            return of(createWorkedHourSuccess(action.payload));
        })
    )

export const fetchWorkedHoursEpic: Epic = (action: Observable<PayloadAction<WorkedFetchType>>, state) =>
    action.pipe(
        ofType("workedHours/fetchWorkedHours"),
        mergeMap(action =>
            FetchWorkedHoursQuery(action.payload).pipe(
                mergeMap(async resp => {
                    if (resp.response.errors != null) {
                        const errorMessage = await GetErrorMessage(resp.response.errors[0].message);
                        return fetchWorkedHoursFail(errorMessage)
                    }
                    return fetchWorkedHoursSuccess({
                        entities: resp.response.data.workedHourQuery.workedHours,
                        extensions: resp.response.extensions
                    });
                }),
                catchError((e: Error) => {
                    console.log(e);
                    return of(fetchWorkedHoursFail("Unexpected error"))
                })
            ),
        )
    );

export const editWorkedHourEpic: Epic = (action: Observable<PayloadAction<UpdateWorkedHourType>>, state) =>
    action.pipe(
        ofType("workedHours/editWorkedHour"),
        mergeMap(action =>
            UpdateWorkedHoursQuery(action.payload)
                .pipe(
                    mergeMap(async resp => {
                        if (resp.response.errors != null) {
                            console.log(resp.response)
                            const errorMessage = await GetErrorMessage(resp.response.errors[0].message);
                            return editWorkedHourFail(errorMessage)
                        }
                        return editWorkedHourSuccess(resp.response.data.workedHourMutations.update);
                    }),
                    catchError((e: Error) => {
                        console.log(e);
                        return of(editWorkedHourFail("Unexpected error"))
                    })
                ),
        )
    );


export const deleteWorkedHourEpic: Epic = (action: Observable<PayloadAction<number>>) =>
    action.pipe(
        ofType('workedHours/deleteWorkedHour'),
        mergeMap(action =>
            DeleteWorkedHoursQuery(action.payload)
                .pipe(
                    map(res => {
                        if (res.response.errors != null) {
                            return deleteWorkedHourFail(res.response.errors[0].message)
                        }
                        return deleteWorkedHourSuccess(res.response.data.workedHourMutations.delete);
                    }),
                    catchError((e: Error) => of(deleteWorkedHourFail("error")))
                )
        )
    )
export const fetchWorkedHourStatistic: Epic = (action: Observable<PayloadAction<WorkedHoursStatisticInput>>) =>
    action.pipe(
        ofType('workedHours/fetchWorkedHoursStatistic'),
        mergeMap(act =>
            WorkedHoursStatistic(act.payload.userId, act.payload.date)
                .pipe(
                    map(res => {
                        if (res.response.errors != null) {
                            return fetchWorkedHoursStatisticFail(res.response.errors[0].message)
                        }
                        return fetchWorkedHoursStatisticSuccess(res.response.data.workedHourQuery.getYearStatistic);
                    }),
                    catchError((e: Error) => {
                        console.log(e);
                        return of(fetchWorkedHoursStatisticFail("error"));
                    })
                )
        )
    )

export const startTimerEpic: Epic = (action$, state$: Observable<RootState>) => {
    return action$.pipe(
        ofType("timer/startTimer"),
        withLatestFrom(state$),
        mergeMap(([action, state]) => {
            console.log(state.timer.startedAt)
            console.log(action.payload)
            if (state.timer.startedAt !== action.payload) {
                return CreateWorkedHoursQuery(
                    GetNewWorkedHour(state.timer, action.payload, state.auth.user!.id))
                    .pipe(mergeMap(async (resp) => {
                        if (resp.response.errors != null) {
                            console.log(resp.response);
                            const errorMessage = await GetErrorMessage(
                                resp.response.errors[0].message
                            );
                            return createWorkedHourFail(errorMessage);
                        }
                        return createWorkedHourSuccess(
                            resp.response.data.workedHourMutations.create
                        );
                    }),
                        catchError((e: Error) => {
                            console.log(e);
                            return of(createWorkedHourFail("Unexpected error"));
                        })
                    );
            } else {
                return of();
            }
        })
    );
}

export const workedHourEpics = [startTimerEpic, fetchWorkedHourStatistic, fetchWorkedHoursEpic, createWorkedHourEpic, editWorkedHourEpic, deleteWorkedHourEpic, resetTimerEpic, resetTimerSuccessEpic]
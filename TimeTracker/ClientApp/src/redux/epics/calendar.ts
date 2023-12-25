import {
    DeleteWorkPlanQuery,
    FetchCalendarEventsQuery,
    FetchWorkPlansQuery,
    SetCalendarEventQuery,
    SetWorkPlanQuery
} from "@redux/queries";
import { DateRangeType, FetchUsersPlansSuccessType, FetchUsersPlansType, SchedulerWorkPlan, SetCalendarEventType, SetWorkPlanType } from '@redux/types';
import { PayloadAction } from "@reduxjs/toolkit";
import { Epic, ofType } from "redux-observable";
import { Observable, catchError, mergeMap, of } from "rxjs";
import { GetLocalDateFromUtc } from "../../utils/dateTimeHelpers";
import {
    deleteFail, deleteWorkPlanSuccess,
    fetchAllCalendarEventsSuccess,
    fetchFail,
    fetchNextCalendarEventsSuccess,
    fetchWorkPlansSuccess,
    setCalendarEventSuccess,
    setFail, setWorkPlanSuccess
} from '../slices';

export const fetchWorkPlansEpic: Epic = (action: Observable<PayloadAction<FetchUsersPlansType>>, state) =>
    action.pipe(
        ofType("calendar/fetchWorkPlans"),
        mergeMap(action =>
            FetchWorkPlansQuery(action.payload).pipe(
                mergeMap(async resp => {
                    if (resp.response.errors != null) {
                        //const errorMessage = await GetErrorMessage(resp.response.errors[0].message);
                        console.log(resp.response.errors[0])
                        return fetchFail("errorMessage")
                    }
                    return fetchWorkPlansSuccess({
                        workPlans: resp.response.data.workPlanQuery.workPlans,
                        userIds: action.payload.userIds
                    }as FetchUsersPlansSuccessType)
                }),
                catchError((e: Error) => {
                    console.log(e);
                    return of(fetchFail("Unexpected error"))
                })
            ),
        )
    );

export const fetchCalendarEventsEpic: Epic = (action: Observable<PayloadAction<DateRangeType>>, state) =>
    action.pipe(
        ofType("calendar/fetchCalendarEvents"),
        mergeMap(action =>
            FetchCalendarEventsQuery(action.payload).pipe(
                mergeMap(async resp => {
                    if (resp.response.errors != null) {
                        //const errorMessage = await GetErrorMessage(resp.response.errors[0].message);
                        console.log(resp.response.errors[0])
                        return fetchFail("errorMessage")
                    }
                    const startDate = GetLocalDateFromUtc(new Date(action.payload.startDate))
                    const endDate = GetLocalDateFromUtc(new Date(action.payload.endDate))

                    if (startDate.getMonth() == endDate.getMonth())
                        return fetchNextCalendarEventsSuccess(resp.response.data.calendarEventQuery.calendarEvents)
                    else
                        return fetchAllCalendarEventsSuccess(resp.response.data.calendarEventQuery.calendarEvents);
                }),
                catchError((e: Error) => {
                    console.log(e);
                    return of(fetchFail("Unexpected error"))
                })
            ),
        )
    );

export const setWorkPlanEpic: Epic = (action: Observable<PayloadAction<SetWorkPlanType>>, state) =>
    action.pipe(
        ofType("calendar/setWorkPlan"),
        mergeMap(action =>
            SetWorkPlanQuery(action.payload).pipe(
                mergeMap(async resp => {
                    if (resp.response.errors != null) {
                        console.log(resp.response.errors)
                        //const errorMessage = await GetErrorMessage(resp.response.errors[0].message);
                        return setFail(resp.response.errors[0].message)
                    }
                    return setWorkPlanSuccess(resp.response.data.workPlanMutations.set);
                }),
                catchError((e: Error) => {
                    console.log(e)
                    return of(setFail("Unexpected error"))
                })
            ),
        )
    );

export const setCalendarEventEpic: Epic = (action: Observable<PayloadAction<SetCalendarEventType>>, state) =>
    action.pipe(
        ofType("calendar/setCalendarEvent"),
        mergeMap(action =>
            SetCalendarEventQuery(action.payload).pipe(
                mergeMap(async resp => {
                    if (resp.response.errors != null) {
                        console.log(resp.response.errors)
                        //const errorMessage = await GetErrorMessage(resp.response.errors[0].message);
                        return setFail(resp.response.errors[0].message)
                    }
                    return setCalendarEventSuccess(resp.response.data.calendarEventMutations.set);
                }),
                catchError((e: Error) => {
                    console.log(e)
                    return of(setFail("Unexpected error"))
                })
            ),
        )
    );

export const deleteWorkPlanEpic: Epic = (action: Observable<PayloadAction<SchedulerWorkPlan>>, state) =>
    action.pipe(
        ofType("calendar/deleteWorkPlan"),
        mergeMap(action =>
            DeleteWorkPlanQuery(action.payload).pipe(
                mergeMap(async resp => {
                    if (resp.response.errors != null) {
                        console.log(resp.response.errors)
                        //const errorMessage = await GetErrorMessage(resp.response.errors[0].message);
                        return deleteFail(resp.response.errors[0].message)
                    }
                    return resp.response.data.workPlanMutations.delete == null
                        ? deleteFail("Failed to delete (Not found)")
                        : deleteWorkPlanSuccess(resp.response.data.workPlanMutations.delete);
                }),
                catchError((e: Error) => {
                    console.log(e)
                    return of(deleteFail("Unexpected error"))
                })
            ),
        )
    );

export const deleteCalendarEventEpic: Epic = (action: Observable<PayloadAction<SchedulerWorkPlan>>, state) =>
    action.pipe(
        ofType("calendar/deleteCalendarEvent"),
        mergeMap(action =>
            DeleteWorkPlanQuery(action.payload).pipe(
                mergeMap(async resp => {
                    if (resp.response.errors != null) {
                        console.log(resp.response.errors)
                        //const errorMessage = await GetErrorMessage(resp.response.errors[0].message);
                        return deleteFail(resp.response.errors[0].message)
                    }
                    return resp.response.data.workPlanMutations.delete == null
                        ? deleteFail("Failed to delete (Not found)")
                        : deleteWorkPlanSuccess(resp.response.data.workPlanMutations.delete);
                }),
                catchError((e: Error) => {
                    console.log(e)
                    return of(deleteFail("Unexpected error"))
                })
            ),
        )
    );

export const calendarEpics = [fetchWorkPlansEpic, fetchCalendarEventsEpic, setCalendarEventEpic, setWorkPlanEpic, deleteWorkPlanEpic]
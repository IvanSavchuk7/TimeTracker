import {Epic, ofType} from "redux-observable";
import {catchError, map, mergeMap, Observable, of} from "rxjs";
import {PayloadAction} from "@reduxjs/toolkit";
import {
    DeleteApproverVacationByVacationId,
    FetchApproverVacationById,
    FetchVacationsRequest,
    UpdateApproverVacations,
    UpdateApproverVacationState, UpdateApproverVacationToDefault
} from "../queries";
import {
    deleteByVacationIdFail,
    deleteByVacationIdSuccess,
    fetchApproverVacationByIdFail,
    fetchApproverVacationByIdSuccess,
    fetchRequestsFail,
    fetchRequestsSuccess,
    updateApproversVacationsFail,
    updateApproversVacationsSuccess,
    updateApproverVacationStateStateFail,
    updateApproverVacationStateSuccess, updateToDefaultFail, updateToDefaultSuccess, 
} from "../slices";
import {ApproverVacationUpdate, VacationApproverInput, WorkedFetchType} from "../types";
import {GetErrorMessage} from "../../utils";


const updateApproverVacationEpic: Epic = (action: Observable<PayloadAction<ApproverVacationUpdate>>, state) =>
    action.pipe(
        ofType("approverVacation/updateApproverVacationState"),
        mergeMap(action =>
            UpdateApproverVacationState(action.payload)
                .pipe(
                    mergeMap(async resp => {
                        console.log(resp.response);
                        if (resp.response.errors != null) {
                            return updateApproverVacationStateStateFail(resp.response.errors[0].message)
                        }
                        return updateApproverVacationStateSuccess(resp.response.data.approverVacationMutation.updateState);
                    }),
                    catchError((e: Error) => {
                        return of(updateApproverVacationStateStateFail("unexpected error"))
                    })
                ),
        )
    );

const fetchVacationsRequestsEpic: Epic = (action: Observable<PayloadAction<WorkedFetchType>>, state) =>
    action.pipe(
        ofType("approverVacation/fetchRequests"),
        mergeMap(action =>
            FetchVacationsRequest(action.payload.userId,action.payload.take,action.payload.skip,action.payload.group)
                .pipe(
                    mergeMap(async resp => {
                        if (resp.response.errors != null) {
                            const errorMessage = await GetErrorMessage(resp.response.errors[0].message);
                            return fetchRequestsFail(errorMessage)
                        }
                        return fetchRequestsSuccess({
                            entities:resp.response.data.approverVacationQuery.requests,
                            extensions:resp.response.extensions
                        });
                    }),
                    catchError((e: Error) => {
                        console.log(e);
                        return of(fetchRequestsFail("unexpected error"))
                    })
                ),
        )
    );

const updateApproversVacationsEpic: Epic = (action: Observable<PayloadAction<VacationApproverInput>>, state) =>
    action.pipe(
        ofType("approverVacation/updateApproversVacations"),
        mergeMap(action =>
            UpdateApproverVacations(action.payload)
                .pipe(
                    mergeMap(async resp => {
                        if (resp.response.errors != null) {
                            return updateApproversVacationsFail(resp.response.errors[0].message)
                        }
                        return updateApproversVacationsSuccess();
                    }),
                    catchError((e: Error) => {
                        return of(updateApproversVacationsFail("unexpected error"))
                    })
                ),
        )
    );


const deleteApproverVacationByVacationIdEpic:Epic  = (action$:Observable<PayloadAction<number>>)=>
    action$.pipe(
        ofType('approverVacation/deleteByVacationId'),
        mergeMap(action$=>
            DeleteApproverVacationByVacationId(action$.payload)
                .pipe(
                    map(res=>{
                        if (res.response.errors != null) {
                            return deleteByVacationIdFail(res.response.errors[0].message)
                        }
                        return deleteByVacationIdSuccess(res.response.data.approverVacationMutation.deleteByVacationId);
                    }),
                    catchError((e: Error) => {
                        return of(deleteByVacationIdFail("unexpected error"))
                    })
                ))
        )

const fetchApproverVacationByIdEpic:Epic=(action$:Observable<PayloadAction<number>>)=>
    action$.pipe(
        ofType('approverVacation/fetchApproverVacationById'),
        mergeMap(action$=>
            FetchApproverVacationById(action$.payload)
                .pipe(
                    map(res=>{
                        if (res.response.errors != null) {
                            return fetchApproverVacationByIdFail(res.response.errors[0].message)
                        }
                        return fetchApproverVacationByIdSuccess(res.response.data.approverVacationQuery.approverVacation);
                    }),
                    catchError((e: Error) => {
                        console.log(e);
                        return of(fetchApproverVacationByIdFail("unexpected error"))
                    })
                )
        )
    )
export const updateApproverVacationsStateToDefaultEpic: Epic = (action$: Observable<PayloadAction<number>>) =>
    action$.pipe(
        ofType('approverVacation/updateToDefault'),
        mergeMap(action$ =>
            UpdateApproverVacationToDefault(action$.payload)
                .pipe(
                    map(res => {
                        if (res.response.errors != null) {
                            return updateToDefaultFail(res.response.errors[0].message)
                        }
                        return updateToDefaultSuccess();
                    }),
                    catchError((e: Error) => {
                        console.log(e);
                        return of(updateToDefaultFail("unexpected error"))
                    })
                )
        )
    )
export const vacationApproverEpics = [deleteApproverVacationByVacationIdEpic,updateApproversVacationsEpic,
    fetchVacationsRequestsEpic,updateApproverVacationEpic,fetchApproverVacationByIdEpic,updateApproverVacationsStateToDefaultEpic];
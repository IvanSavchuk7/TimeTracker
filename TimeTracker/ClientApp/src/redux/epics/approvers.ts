import { Epic, ofType } from "redux-observable";
import { catchError, map, mergeMap, Observable, of } from "rxjs";
import { PayloadAction } from "@reduxjs/toolkit";
import { ApproversAddType, FetchUsersType } from "../types";
import { AddApproversQuery, FetchUsersQuery } from "../queries";
import { addApproversFail, addApproversSuccess, fetchApproversFail, fetchApproversSuccess } from "../slices";
import { GetErrorMessage } from "../../utils";

export const addApproversEpic: Epic = (action: Observable<PayloadAction<ApproversAddType>>, state) =>
    action.pipe(
        ofType("approvers/addApprovers"),
        mergeMap(action =>
            AddApproversQuery(action.payload).pipe(
                mergeMap(async resp => {
                    if (resp.response.errors != null) {
                        const errorMessage = await GetErrorMessage(resp.response.errors[0].message);
                        return addApproversFail(errorMessage)
                    }
                    console.log('successfully added')
                    return addApproversSuccess();
                }),
                catchError((e: Error) => {
                    return of(addApproversFail("Unexpected error"))
                })
            ),
        )
    );

export const fetchApproversEpic: Epic = (action: Observable<PayloadAction<FetchUsersType>>, state) =>
    action.pipe(
        ofType("approvers/fetchApprovers"),
        mergeMap(action =>
            FetchUsersQuery(action.payload).pipe(
                mergeMap(async resp => {
                    if (resp.response.errors != null) {
                        const errorMessage = await GetErrorMessage(resp.response.errors[0].message);
                        return fetchApproversFail(errorMessage)
                    }
                    return fetchApproversSuccess(resp.response.data.userQuery.users);
                }),
                catchError((e: Error) => {
                    return of(fetchApproversFail("Unexpected error"))
                })
            ),
        )
    );




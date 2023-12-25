import { Epic, ofType } from "redux-observable";
import {catchError, map, mergeMap, Observable, of, tap} from "rxjs";
import { PayloadAction } from "@reduxjs/toolkit";
import { FetchUsersQuery} from "../queries";
import {fetchUsersFail, fetchUsersSuccess, loadUsersSuccess} from "../slices";
import { FetchUsersType } from "../types";
import { GetErrorMessage } from "../../utils";

export const fetchUsersEpic: Epic = (action: Observable<PayloadAction<FetchUsersType>>, state) =>
    action.pipe(
        ofType("users/fetchUsers"),
        mergeMap(action =>
            FetchUsersQuery(action.payload)
                .pipe(
                    mergeMap(async resp => {
                        if (resp.response.errors != null) {
                            const errorMessage = await GetErrorMessage(resp.response.errors[0].message);
                            return fetchUsersFail(errorMessage)
                        }
                        return fetchUsersSuccess({entities:resp.response.data.userQuery.users,
                                extensions:resp.response.extensions
                        });
                    }),
                    catchError((e: Error) => {
                        console.log(e);
                        return of(fetchUsersFail("Unexpected error"))
                    })
                ),
        )
    );

    export const loadUsersEpic: Epic = (action: Observable<PayloadAction<FetchUsersType>>, state) =>
    action.pipe(
        ofType("users/loadUsers"),
        mergeMap(action =>
            FetchUsersQuery(action.payload)
                .pipe(
                    mergeMap(async resp => {
                        if (resp.response.errors != null) {
                            const errorMessage = await GetErrorMessage(resp.response.errors[0].message);
                            return fetchUsersFail(errorMessage)
                        }
                        return loadUsersSuccess({entities:resp.response.data.userQuery.users,
                                extensions:resp.response.extensions
                        });
                    }),
                    catchError((e: Error) => {
                        console.log(e);
                        return of(fetchUsersFail("Unexpected error"))
                    })
                ),
        )
    );

    export const usersEpics = [fetchUsersEpic, loadUsersEpic]
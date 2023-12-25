import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User, UserSliceState } from '../intrerfaces';
import {UpdateTwoStepAuth, UserAddType, UserEditType} from "../types";
import {
    createErrorReducer,
    createPendingReducerWithPayload,
    createSuccessReducerWithoutPayload,
    createSuccessReducerWithPayload,
    defaultState
} from "./generic";

const initialState: UserSliceState = {
    ...defaultState,
    user: null,
    vacationDays: 0,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        userAdd: createPendingReducerWithPayload<UserSliceState, UserAddType>(),
        userAddSuccess: createSuccessReducerWithPayload<UserSliceState, User>(
            (state: UserSliceState, action: PayloadAction<User>) => {
                state.user = action.payload;
            }),
        userAddFail: createErrorReducer(),

        userVerify: createPendingReducerWithPayload<UserSliceState, { token: string, password: string }>(),
        verifySuccess: createSuccessReducerWithoutPayload(),
        verifyFail: createErrorReducer(),

        fetchUser: createPendingReducerWithPayload<UserSliceState, number>(),
        fetchUserSuccess: createSuccessReducerWithPayload<UserSliceState, User>(
            (state: UserSliceState, action: PayloadAction<User>) => {
                state.user = action.payload;
            }),
        fetchUserFail: createErrorReducer(),

        editUser: createPendingReducerWithPayload<UserSliceState, UserEditType>(),
        editUserSuccess: createSuccessReducerWithoutPayload(),
        editUserFail: createErrorReducer(),


        fetchVacationDays: createPendingReducerWithPayload<typeof initialState, number>(),
        fetchVacationDaysSuccess: createSuccessReducerWithPayload<typeof initialState, number>
            ((state: UserSliceState, action: PayloadAction<number>) => {
                state.vacationDays = action.payload;
            }),
        fetchVacationDaysFail: createErrorReducer(),

        emailVerify: createPendingReducerWithPayload<UserSliceState, string>(),

        updateTwoStepAuth:createPendingReducerWithPayload<typeof initialState,UpdateTwoStepAuth>(),
        updateTwoStepAuthSuccess:createSuccessReducerWithPayload<typeof initialState,boolean>(),
        updateTwoStepAuthFail:createErrorReducer()
    },
});

export const user = userSlice.reducer;

export const {
    userAdd, userAddSuccess, userAddFail,
    userVerify, verifyFail, verifySuccess,
    fetchUser, fetchUserFail, fetchUserSuccess,
    editUser, editUserFail, editUserSuccess,
    fetchVacationDaysSuccess, fetchVacationDaysFail,
    fetchVacationDays, emailVerify,updateTwoStepAuthSuccess,updateTwoStepAuthFail,updateTwoStepAuth
} = userSlice.actions;


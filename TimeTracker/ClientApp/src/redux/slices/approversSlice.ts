import { User, ApproversState } from "../intrerfaces";
import {
    createErrorReducer,
    createPendingReducerWithPayload,
    createSuccessReducerWithoutPayload,
    createSuccessReducerWithPayload,
    defaultState
} from "./generic";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApproversAddType, FetchUsersType } from "../types";



const initialState: ApproversState = {
    ...defaultState,
    userApprovers: [],
    approversList: []
};


const approversSlice = createSlice({
    name: 'approvers',
    initialState,
    reducers: {
        addApprovers: createPendingReducerWithPayload<ApproversState, ApproversAddType>(),
        addApproversSuccess: createSuccessReducerWithoutPayload(),
        addApproversFail: createErrorReducer(),
        setApprovers: (state: ApproversState, action: PayloadAction<number[]>) => {
            state.userApprovers = action.payload;
        },
        fetchApprovers: createPendingReducerWithPayload<ApproversState, FetchUsersType>(),
        fetchApproversSuccess: createSuccessReducerWithPayload<ApproversState, User[]>(
            (state: ApproversState, action: PayloadAction<User[]>) => {
                state.approversList = [...state.approversList, ...action.payload];
            }),
        fetchApproversFail: createErrorReducer()
    },
});

export const approvers = approversSlice.reducer;
export const {
    addApprovers, setApprovers,
    addApproversSuccess, addApproversFail,
    fetchApprovers,
    fetchApproversFail, fetchApproversSuccess } = approversSlice.actions;

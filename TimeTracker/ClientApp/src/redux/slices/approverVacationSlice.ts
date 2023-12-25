import { VacationApproverState } from "../intrerfaces";
import {
    createErrorReducer,
    createPendingReducerWithPayload, createSuccessReducerWithoutPayload,
    createSuccessReducerWithPayload,
    defaultState
} from "./generic";
import {createSlice,  PayloadAction} from "@reduxjs/toolkit";
import {
    ApproverVacation, ApproverVacationUpdate, Vacation,
    VacationApproverInput, WorkedFetchType
} from "../types";
import {
    basicFilteringReducers,
    basicPagingReducers,
    defaultPagingState,
    PagingEntityType, WhereFilter
} from "@redux/types/filterTypes.ts";


const initialState:VacationApproverState = {
    ...defaultState,
    vacationRequests:[],
    updated:null,
    approverVacation:null,
    deleted:false,
    ...{...defaultPagingState,take:4,perPage:4},
    group:[],

}

const approverVacationsSlice = createSlice({
    name: 'approverVacation',
    initialState,
    reducers: {
        updateApproverVacationState:createPendingReducerWithPayload<typeof initialState,ApproverVacationUpdate>
        ((state:VacationApproverState)=>{
            state.updated=null;
        }),
        updateApproverVacationStateSuccess:(state:VacationApproverState,action:PayloadAction<ApproverVacation>)=>{
            state.approverVacation=action.payload;
            state.loading=false;
            state.updated=action.payload.vacation;
        },
        updateApproverVacationStateStateFail:createErrorReducer(),

        fetchRequests:createPendingReducerWithPayload<typeof initialState,WorkedFetchType>(),
        fetchRequestsSuccess:createSuccessReducerWithPayload<typeof initialState,PagingEntityType<ApproverVacation>>(
            (state,action)=>{
            state.vacationRequests=action.payload.entities;
            state.extensions = action.payload.extensions;
            state.loading=false;
        }),
        fetchRequestsFail:createErrorReducer(),


        /*createApproverVacation:createPendingReducerWithPayload<typeof initialState,VacationApproverInput>(),
        createApproverVacationSuccess:createSuccessReducerWithoutPayload(),
        createApproverVacationFail:createErrorReducer()*/

        /*Оновлення не запису, а таблиці VacationApprovers*/
        updateApproversVacations:createPendingReducerWithPayload<typeof initialState,VacationApproverInput>(),
        updateApproversVacationsSuccess:createSuccessReducerWithoutPayload(),
        updateApproversVacationsFail:createErrorReducer(),

        deleteByVacationId:createPendingReducerWithPayload<typeof initialState,number>
        ((state)=>{
            state.deleted=false;
        }),
        deleteByVacationIdSuccess:createSuccessReducerWithPayload<typeof initialState,ApproverVacation>
        ((state)=>{
            state.deleted=true;
        }),
        deleteByVacationIdFail:createErrorReducer(),

        fetchApproverVacationById:createPendingReducerWithPayload<typeof initialState,number>(),
        fetchApproverVacationByIdSuccess:createSuccessReducerWithPayload<typeof initialState,ApproverVacation>
        ((state, action)=>{
            state.approverVacation=action.payload;
        }),
        fetchApproverVacationByIdFail:createErrorReducer(),

        updateToDefault:createPendingReducerWithPayload<typeof initialState,number>(),
        updateToDefaultFail:createErrorReducer(),
        updateToDefaultSuccess:createSuccessReducerWithoutPayload(),

        ...basicPagingReducers,
        ...basicFilteringReducers
    },
});


export const approverVacations = approverVacationsSlice.reducer;
export const  {updateApproverVacationState,
    updateApproverVacationStateSuccess,
    updateApproverVacationStateStateFail,
    fetchRequests,fetchRequestsFail,
    fetchRequestsSuccess,updateApproversVacationsSuccess,
    updateApproversVacationsFail,updateApproversVacations
    ,deleteByVacationIdSuccess,deleteByVacationIdFail
    ,deleteByVacationId,fetchApproverVacationById,
    fetchApproverVacationByIdSuccess,fetchApproverVacationByIdFail
    ,updateToDefaultSuccess,updateToDefaultFail,updateToDefault
    ,setSkip:setVacationRequestSkip,
    setTake:setVacationRequestsTake,
    setPerPage:setVacationRequestPerPage,
    addFilters:addVacationRequestFilter,
    filtersToDefault:vacationRequestsFiltersToDefault} =  approverVacationsSlice.actions
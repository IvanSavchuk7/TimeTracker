import { createSlice, PayloadAction} from "@reduxjs/toolkit";
import {
    createErrorReducer,
    createPendingReducerWithPayload,
    createSuccessReducerWithoutPayload, createSuccessReducerWithPayload,
    defaultState
} from "./generic";
import {VacationState} from "../intrerfaces";
import {Vacation, VacationChangeType, VacationInputType, WorkedFetchType} from "../types";
import {
    basicFilteringReducers, basicOrderingReducers,
    basicPagingReducers,
    defaultPagingState,
    PagingEntityType
} from "@redux/types/filterTypes.ts";

const initialState:VacationState = {
    ...defaultState,
    ...defaultPagingState,
    created:false,
    vacations:[],
    vacation:null,
    updated:null,
    group:[],
    orderBy:{
        property:"VacationState",
        direction:"DESC",
        value:"4"
    }
}

const vacationsSlice = createSlice({
    name: 'vacation',
    initialState,
    reducers: {
        createVacation:createPendingReducerWithPayload<typeof initialState,VacationInputType>
        ((state:VacationState)=>{
            state.created=false;
        }),
        createVacationSuccess:createSuccessReducerWithPayload<typeof initialState,Vacation>
        ((state,action)=>{
            state.created=true;
            state.createdId=action.payload.id
            state.vacations.push(action.payload);
        }),
        createVacationFail:createErrorReducer(),

        updateVacationState:createPendingReducerWithPayload<typeof initialState,number>(),
        updateVacationStateSuccess:createSuccessReducerWithoutPayload(),
        updateVacationStateFail:createErrorReducer(),

        fetchUserVacations:createPendingReducerWithPayload<typeof initialState,WorkedFetchType>(),
        fetchUserVacationsSuccess:createSuccessReducerWithPayload<typeof initialState,PagingEntityType<Vacation>>
        ((state,action)=>{
            state.vacations=action.payload.entities;
            state.extensions = action.payload.extensions;
        }),
        fetchUserVacationsFail:createErrorReducer(),

        changeVacationState:(state:VacationState,action:PayloadAction<VacationChangeType>)=>{
            state.updated=null;
        },
        changeVacationStateSuccess:(state:VacationState,action:PayloadAction<Vacation>)=>{
            state.vacations = state.vacations.map(v=>{
                if(v.id===action.payload.id){
                    v =action.payload;
                }
                return v;
            });
            state.updated=action.payload;
        },
        changeVacationStateFail:createErrorReducer(),

        updateVacation:createPendingReducerWithPayload<typeof initialState,Vacation>
        ((state,action)=>{
            state.updated=null;
        }),
        updateVacationSuccess:createSuccessReducerWithPayload<typeof initialState,Vacation>
        ((state, action)=>{
            const upd = action.payload;
            state.vacations=state.vacations.map(v=>{
                if(v.id===upd.id){
                    v=upd;
                }
                return v;
            });
            state.updated=upd;
        }),
        updateVacationFail:createErrorReducer(),

        deleteVacation:createPendingReducerWithPayload<typeof initialState,Vacation>(),
        deleteVacationSuccess:createSuccessReducerWithPayload<typeof initialState,Vacation>
        ((state,action)=>{
            state.vacations=state.vacations.filter(v=>v.id!==action.payload.id);
        }),
        deleteVacationFail:createErrorReducer(),

        fetchVacationById:createPendingReducerWithPayload<typeof initialState,number>(),
        fetchVacationByIdSuccess:createSuccessReducerWithPayload<typeof initialState,Vacation>
        ((state,action)=>{
            state.vacation=action.payload;
        }),
        fetchVacationByIdFail:createErrorReducer(),

        ...basicFilteringReducers,
        ...basicPagingReducers,
        ...basicOrderingReducers
    }
});


export const vacation = vacationsSlice.reducer;

export const  {createVacation,
    createVacationSuccess,
    createVacationFail,updateVacationStateFail,
    updateVacationStateSuccess,
    updateVacationState,fetchUserVacationsSuccess
    ,fetchUserVacationsFail
    ,fetchUserVacations,changeVacationState
    ,changeVacationStateFail
    ,changeVacationStateSuccess,
    updateVacationSuccess,updateVacationFail
    ,updateVacation
    ,deleteVacationSuccess,fetchVacationById,
    deleteVacationFail,fetchVacationByIdFail,
    deleteVacation,fetchVacationByIdSuccess
    ,addFilters:addVacationFilters,addFilter:addVacationFilter
    ,filtersToDefault:vacationFiltersToDefault,setTake:setVacationsTake
    ,setSkip:setVacationsSkip,setPerPage:setVacationsPerPage,
    setOrder:setVacationOrder} =  vacationsSlice.actions;
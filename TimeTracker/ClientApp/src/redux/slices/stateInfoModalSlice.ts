import {createSlice} from "@reduxjs/toolkit";
import {
    changeVacationState, changeVacationStateFail,
    createVacation,
    createVacationFail,
    createVacationSuccess, updateVacation, updateVacationFail
} from "@redux/slices/vacationSlice.ts";
import {addGenericCase, addOnlyErrorCase} from "@redux/slices/generic/addModalCase.ts";
import {
    deleteByVacationId, deleteByVacationIdFail
} from "@redux/slices/approverVacationSlice.ts";


export interface InfoModalState{
    isOpen:boolean,
    message:string|null,
    loading:boolean,
    animate:boolean
}

const initialState:InfoModalState = {
    isOpen:false,
    message:null,
    loading:false,
    animate:false
}

const infoModalSlice = createSlice({
    name:"infoModal",
    initialState:initialState,
    reducers:{
        closeInfoModal:(state:InfoModalState)=>{
            state.isOpen=false;
            state.loading=false;
            state.message=null;
        }
    },
    extraReducers:(builder)=>{
        addGenericCase({success:createVacationSuccess,fail:createVacationFail,
            trigger:createVacation,builder:builder});
        addOnlyErrorCase({
            trigger:changeVacationState,
            fail:changeVacationStateFail,
            builder:builder
        });
        addOnlyErrorCase({
            trigger:deleteByVacationId,
            fail:deleteByVacationIdFail,
            builder:builder
        });
        addOnlyErrorCase({
            trigger:updateVacation,
            fail:updateVacationFail,
            builder:builder
        })
    }
});

export const infoModalReducer = infoModalSlice.reducer;

export const {closeInfoModal} = infoModalSlice.actions;

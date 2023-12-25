import {ActionReducerMapBuilder, TypedActionCreator} from "@reduxjs/toolkit/dist/mapBuilders";
import {InfoModalState} from "@redux/slices/stateInfoModalSlice.ts";
import {ActionCreatorWithPayload} from "@reduxjs/toolkit";

interface CasePropsBase{
    builder: ActionReducerMapBuilder<InfoModalState>
}
interface OnlyErrorCaseProps extends CasePropsBase{
    fail:ActionCreatorWithPayload<string>,
    trigger: TypedActionCreator<string>,
}
interface CaseProps extends OnlyErrorCaseProps{
    success: TypedActionCreator<string>,
}

export function addGenericCase({success, fail, trigger, builder}: CaseProps){

    builder.addCase(success,(state:InfoModalState)=>{
        state.isOpen=true;
        state.loading=false;
        state.message="success";
    });
    builder.addCase(fail,(state:InfoModalState,action)=>{
        state.isOpen=true;
        state.loading=false;
        state.message=action.payload;
    });
    builder.addCase(trigger,(state:InfoModalState)=>{
        state.loading=true;
        state.message=null;
        state.animate=true;
    });
}

export function addOnlyErrorCase({fail,trigger,builder}:OnlyErrorCaseProps){
    builder.addCase(fail,(state,action)=>{
        state.message=action.payload;
        state.isOpen=true;
        state.animate=true;
    });
    builder.addCase(trigger,(state:InfoModalState)=>{
        state.message=null;
    });
}
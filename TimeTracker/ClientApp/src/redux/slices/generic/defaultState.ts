import { PayloadAction} from "@reduxjs/toolkit";
import { DefaultState } from "../../intrerfaces";

export const defaultState: DefaultState = {
    loading: false,
    error: null,
    message: null
}

export function createErrorReducer<T extends DefaultState>(callback:Function|null=null){
    return (state: T, action: PayloadAction<string>):void => {
        state.loading=false;
        state.error=action.payload;
        state.message=null;
        if(callback!==null)
            callback(state);

    }
}

export function createSuccessReducerWithPayload<T extends DefaultState,V>(callback:(state:T,action:PayloadAction<V>)=>void=()=>{}){
    return (state: T, action: PayloadAction<V>):void => {
        state.loading=false;
        state.error=null;
        state.message=null;
        if(callback!==null)
            callback(state,action);
    }
}

export function createSuccessReducerWithoutPayload<T extends DefaultState>(callback:Function|null=null){
    return (state: T):void => {
        state.loading=false;
        state.error=null;
        state.message=null;
        if(callback!==null)
            callback(state);
    }
}

export function createPendingReducer<T extends DefaultState>(callback:Function|null=null){
    return (state: T):void => {
        state.loading=true;
        state.error=null;
        state.message=null;
        if(callback!==null)
            callback(state);
    }
}

export function createPendingReducerWithPayload<T extends DefaultState,V>(callback?:(state:T,action:PayloadAction<V>)=>void){
    return (state:T,action:PayloadAction<V>)=>{
        state.loading=true;
        state.error=null;
        state.message=null;
        if(callback!==undefined)
            callback(state,action);
    }
}


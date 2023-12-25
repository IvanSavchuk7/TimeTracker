import {createSlice, PayloadAction} from "@reduxjs/toolkit";

interface MessageModalState{
    onClose?:()=>void,
    onSuccess?:()=>void,
    isOpen:boolean,
    userId?:number,
    vacationId?:number,
    state?:boolean
}

interface ModalOpenPayload{
    userId:number,
    vacationId:number,
    state:boolean,
}

const initialState:MessageModalState = {
    isOpen:false
}

const messageModalSlice = createSlice({
    name:"messageModal",
    initialState:initialState,
    reducers:{
        modalClose:(state:MessageModalState)=>{
            state.isOpen=false;
        },
        modalOpen:(state:MessageModalState,action:PayloadAction<ModalOpenPayload>)=>{
            state.isOpen=true;
            state.vacationId=action.payload.vacationId;
            state.userId=action.payload.userId;
            state.state=action.payload.state;

        },
    }
});

export const messageModalReducer = messageModalSlice.reducer;
export const { modalClose,modalOpen} = messageModalSlice.actions;

import { current, PayloadAction } from "@reduxjs/toolkit";



export interface WhereFilter {
    property: string,
    value: string,
    operator: string,
    connector?: string | null,
}

export interface FiltersType {
    group: WhereFilter[]
}
export interface OrderingType {
    orderBy: {
        property: string,
        direction: string,
        value?:string
    }
}
export interface PagingExtraInfo {
    extensions?: {
        count: number
    }
}

export interface PagingType {
    take: number,
    skip: number,
    perPage: number
}
export interface PagingWithExtraInfo extends PagingExtraInfo, PagingType { }
export interface OrderingPagingFilterType extends PagingType, PagingExtraInfo, FiltersType, OrderingType { }
export interface PagingEntityType<T> extends PagingExtraInfo {
    entities: T[],
}

export const defaultPagingState = {
    take: 5,
    skip: 0,
    perPage: 5
}

export interface PagingInputType {
    take: number,
    skip: number,
}
export type FilterAndPagingInputType = PagingInputType|FiltersType

export const basicFilteringReducers={
    addFilter:(state:FiltersType,action:PayloadAction<WhereFilter>)=>{
        const filter = state.group.find(f=>f.property==action.payload.property);
        if(filter){
            state.group = state.group.map(f=>{
               if(f.property===action.payload.property){
                   f=action.payload;
               }
               return f;
            });
        } else {
            state.group.push(action.payload);
        }

    },
    addFilters:(state:FiltersType,action:PayloadAction<WhereFilter[]>)=>{
        state.group = state.group.concat(action.payload);
    },
    filtersToDefault:(state:FiltersType)=>{
        state.group=[];
    },
    removeFilter:(state:FiltersType,action:PayloadAction<string>)=>{
        state.group = state.group.filter(f=>f.property!==action.payload);
    },
}

export const basicPagingReducers = {
    setTake: (state: PagingWithExtraInfo, action: PayloadAction<number>) => {
        state.take = action.payload;
    },
    setSkip: (state: PagingWithExtraInfo, action: PayloadAction<number>) => {
        state.skip = action.payload;
    },
    setPerPage: (state: PagingWithExtraInfo, action: PayloadAction<number>) => {
        state.perPage = action.payload;
        state.take = action.payload;
    },
    toDefault: (state: PagingWithExtraInfo) => {
        state.take = state.perPage;
        state.skip = 0;
    }
}

export const basicOrderingReducers = {
    setColumn: (state: OrderingPagingFilterType, action: PayloadAction<string>) => {


        if (state.orderBy.property === action.payload && state.orderBy.direction === "DESC") {
            state.orderBy = {
                property: "",
                direction: ""
            };
            return;
        }

        if (state.orderBy.property == action.payload) {
            state.orderBy.direction = "DESC";
        } else {
            state.orderBy = {
                property: action.payload,
                direction: state.orderBy.direction = "ASC"
            };
        }

    },
    setOrder:(state: OrderingPagingFilterType, action: PayloadAction<OrderingType>)=>{
        state.orderBy=action.payload.orderBy;
    }
}
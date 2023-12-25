import {
    CreateWorkedHourType,
    DateRangeType,
    UpdateWorkedHourType,
    WorkedHour,
    WorkedHoursStatistic,
    WorkedHoursStatisticInput,
} from '@redux/types';
import {
    PagingEntityType,
    basicPagingReducers,
    defaultPagingState,
} from "@redux/types/filterTypes.ts";
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import moment from 'moment';
import { FormattedWorkedHours, WorkedHoursSlice } from '..';
import { GetLocalWorkedHour } from '../../utils/dateTimeHelpers';
import {
    createErrorReducer,
    createPendingReducerWithPayload,
    createSuccessReducerWithPayload,
    defaultState
} from "./generic";



const initialState: WorkedHoursSlice = {
    ...defaultState,
    ...{ ...defaultPagingState, take: 4, perPage: 4 },
    workedHours: [],
    hoursToWork: undefined
};

const workedHoursSlice = createSlice({
    name: 'workedHours',
    initialState,
    reducers: {
        createWorkedHour: createPendingReducerWithPayload<WorkedHoursSlice, CreateWorkedHourType>(),
        createWorkedHourSuccess: createSuccessReducerWithPayload<WorkedHoursSlice, WorkedHour>(
            (state: WorkedHoursSlice, action: PayloadAction<WorkedHour>) => {
                action.payload.startDate = moment( action.payload.startDate.toString().slice(0, -1))
                action.payload.endDate = moment( action.payload.endDate.toString().slice(0, -1))
                action.payload = GetLocalWorkedHour(action.payload)

                const userFormattedWorkedHours = state.workedHours.find(
                    (formattedHours) => moment(formattedHours.date).isSame(action.payload.startDate, 'day')
                );

                if (!userFormattedWorkedHours) {
                    const newUserFormattedWorkedHours: FormattedWorkedHours = {
                        date: action.payload.startDate.toDate(),
                        workedHours: [action.payload],
                    };
                    state.workedHours = [newUserFormattedWorkedHours, ...state.workedHours];
                } else {
                    userFormattedWorkedHours.workedHours.push(action.payload);
                    userFormattedWorkedHours.workedHours = userFormattedWorkedHours.workedHours.sort((a, b) => b.startDate.valueOf() - a.startDate.valueOf())
                }
            }
        ),
        createWorkedHourFail: createErrorReducer(),

        fetchWorkedHours: createPendingReducerWithPayload<WorkedHoursSlice, { userId: number, dateRange: DateRangeType }>(),
        fetchWorkedHoursSuccess: createSuccessReducerWithPayload<WorkedHoursSlice, PagingEntityType<WorkedHour>>(
            (state, action) => {
                const workedHours: FormattedWorkedHours[] = [];
                action.payload.entities.forEach((wh, index) => {
                    action.payload.entities[index] = GetLocalWorkedHour(wh)

                    const userFormattedWorkedHours = workedHours.find(
                        (formattedHours) => moment(formattedHours.date).isSame(wh.startDate, 'day')
                    );

                    if (!userFormattedWorkedHours) {
                        const newUserFormattedWorkedHours: FormattedWorkedHours = {
                            date: wh.startDate.toDate(),
                            workedHours: [wh],
                        };
                        workedHours.push(newUserFormattedWorkedHours);
                    } else {
                        userFormattedWorkedHours.workedHours.push(wh);
                    }
                })
                state.workedHours = workedHours;
            }),
        fetchWorkedHoursFail: createErrorReducer(),

        editWorkedHour: createPendingReducerWithPayload<WorkedHoursSlice, UpdateWorkedHourType>(),
        editWorkedHourSuccess: createSuccessReducerWithPayload<WorkedHoursSlice, WorkedHour>(
            (state: WorkedHoursSlice, action: PayloadAction<WorkedHour>) => {
                for (const wh of state.workedHours) {
                    const index = wh.workedHours.findIndex(
                        (workedHour) => workedHour.id === action.payload.id
                    );
                    if (index !== -1) {
                        action.payload.startDate = moment( action.payload.startDate.toString().slice(0, -1))
                        action.payload.endDate = moment( action.payload.endDate.toString().slice(0, -1))

                        wh.workedHours[index] = GetLocalWorkedHour(action.payload);
                        break;
                    }
                }
            }
        ),
        editWorkedHourFail: createErrorReducer(),

        deleteWorkedHour: createPendingReducerWithPayload<WorkedHoursSlice, number>(),
        deleteWorkedHourSuccess: createSuccessReducerWithPayload<WorkedHoursSlice, number>(
            (state, action) => {
                for (const wh of state.workedHours) {
                    const index = wh.workedHours.findIndex(
                        (workedHour) => workedHour.id === action.payload
                    );
                    if (index !== -1) {
                        wh.workedHours.splice(index, 1);
                        break;
                    }
                }
            }),
        deleteWorkedHourFail: createErrorReducer(),

        fetchWorkedHoursStatistic: createPendingReducerWithPayload<typeof initialState, WorkedHoursStatisticInput>(),
        fetchWorkedHoursStatisticSuccess: createSuccessReducerWithPayload<typeof initialState, WorkedHoursStatistic>
            ((state, action) => {
                state.hoursToWork = action.payload;
            }),
        fetchWorkedHoursStatisticFail: createErrorReducer(),
        ...basicPagingReducers
    },
});

export const {
    fetchWorkedHours, fetchWorkedHoursSuccess, fetchWorkedHoursFail,
    editWorkedHour, editWorkedHourFail, editWorkedHourSuccess,
    deleteWorkedHour, deleteWorkedHourFail, deleteWorkedHourSuccess,
    createWorkedHour, createWorkedHourFail, createWorkedHourSuccess,
    setTake: setWorkedHoursTake, setSkip: setWorkedHourSkip, fetchWorkedHoursStatistic
    , fetchWorkedHoursStatisticSuccess, fetchWorkedHoursStatisticFail
} = workedHoursSlice.actions;
export const workedHours = workedHoursSlice.reducer;

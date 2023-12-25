import {
    CalendarEvent,
    DateRangeType, FetchUsersPlansSuccessType, FetchUsersPlansType, SchedulerWorkPlan,
    SetCalendarEventType,
    SetWorkPlanType,
    WorkPlan
} from "@redux/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CalendarSlice, FormattedCalendarArr, SortedCalendarArr } from "..";
import { GetLocalCalendarEvent, GetLocalWorkPlan } from "../../utils/dateTimeHelpers";
import {
    createErrorReducer,
    createPendingReducerWithPayload,
    createSuccessReducerWithPayload,
    defaultState
} from "./generic";

const initialState: CalendarSlice = {
    ...defaultState,
    events: { currentMonth: [], previousMonth: [], nextMonth: [] },
    workPlans: { currentMonth: [], previousMonth: [], nextMonth: [] },
    currentDate: new Date()
};

const calendarSlice = createSlice({
    name: 'calendar',
    initialState,
    reducers: {
        setDate: createSuccessReducerWithPayload<CalendarSlice, Date>((state: CalendarSlice, action: PayloadAction<Date>) => {
            if (state.currentDate > action.payload) {
                state.events.nextMonth = state.events.currentMonth;
                state.events.currentMonth = state.events.previousMonth;
                state.events.previousMonth = []

                state.workPlans.nextMonth = state.workPlans.currentMonth;
                state.workPlans.currentMonth = state.workPlans.previousMonth;
                state.workPlans.previousMonth = []
            }
            else {
                state.events.previousMonth = state.events.currentMonth;
                state.events.currentMonth = state.events.nextMonth;
                state.events.nextMonth = []

                state.workPlans.previousMonth = state.workPlans.currentMonth;
                state.workPlans.currentMonth = state.workPlans.nextMonth;
                state.workPlans.nextMonth = []
            }

            action.payload.getMonth() == new Date().getMonth()
                ? state.currentDate = new Date()
                : state.currentDate = action.payload;
        }),

        fetchCalendarEvents: createPendingReducerWithPayload<CalendarSlice, DateRangeType>(),
        fetchAllCalendarEventsSuccess: createSuccessReducerWithPayload<CalendarSlice, CalendarEvent[]>(
            (state: CalendarSlice, action: PayloadAction<CalendarEvent[]>) => {
                action.payload.forEach((element) => {
                    const local = GetLocalCalendarEvent(element)

                    local.date.getMonth() == state.currentDate.getMonth()
                        ? state.events.currentMonth.push(local)
                        : local.date.getMonth() < state.currentDate.getMonth()
                            ? state.events.previousMonth.push(local)
                            : state.events.nextMonth.push(local)
                });
            }),
        fetchNextCalendarEventsSuccess: createSuccessReducerWithPayload<CalendarSlice, CalendarEvent[]>(
            (state: CalendarSlice, action: PayloadAction<CalendarEvent[]>) => {
                action.payload.forEach((element) => {
                    const local = GetLocalCalendarEvent(element)

                    local.date.getMonth() < state.currentDate.getMonth()
                        ? state.events.previousMonth.push(local)
                        : state.events.nextMonth.push(local)
                });
            }),

        setCalendarEvent: createPendingReducerWithPayload<CalendarSlice, SetCalendarEventType>(),
        setCalendarEventSuccess: createSuccessReducerWithPayload<CalendarSlice, CalendarEvent>(
            (state: CalendarSlice, action: PayloadAction<CalendarEvent>) => {
                const local = GetLocalCalendarEvent(action.payload);
                const localDate = local.date.getMonth();
                const currentDate = state.currentDate.getMonth();

                const eventsArray =
                    localDate === currentDate
                        ? state.events.currentMonth
                        : localDate > currentDate
                            ? state.events.nextMonth
                            : state.events.previousMonth;

                const existingEventIndex = eventsArray.findIndex((event) => event.id === local.id);

                if (existingEventIndex !== -1) {
                    eventsArray[existingEventIndex] = local;
                } else {
                    eventsArray.push(local);
                }
            }
        ),

        fetchWorkPlans: createPendingReducerWithPayload<CalendarSlice, FetchUsersPlansType>(),
        fetchWorkPlansSuccess: createSuccessReducerWithPayload<CalendarSlice, FetchUsersPlansSuccessType>(
            (state: CalendarSlice, action: PayloadAction<FetchUsersPlansSuccessType>) => {
                const sortedEvents: FormattedCalendarArr<SortedCalendarArr> = state.workPlans

                action.payload.userIds.forEach((userId) => {
                    const userWorkPlans = action.payload.workPlans.filter((wp) => wp.userId === userId);

                    if (!userWorkPlans.length) {
                        const currentWorkPlans = state.workPlans['currentMonth'];
                        const userCurrentWorkPlans = currentWorkPlans.find(wp => wp.userId == userId)
                        
                        if (!userCurrentWorkPlans)
                            currentWorkPlans.push({
                                userId: userId,
                                workPlans: [],
                            });
                    }
                    else
                        userWorkPlans.forEach((element) => {
                            const local = GetLocalWorkPlan(element);

                            const userEvents = state.workPlans[
                                local.date.getMonth() === state.currentDate.getMonth()
                                    ? 'currentMonth'
                                    : local.date.getMonth() < state.currentDate.getMonth()
                                        ? 'previousMonth'
                                        : 'nextMonth'
                            ];

                            const existingUser = userEvents.find((u) => u.userId === local.userId);

                            if (existingUser) {
                                const existingWorkPlan = existingUser.workPlans.find((w) => w.id === local.id);

                                if (!existingWorkPlan) {
                                    existingUser.workPlans.push(local);
                                }
                            } else {
                                userEvents.push({
                                    userId: local.userId,
                                    workPlans: [local],
                                });
                            }
                        });
                });

                state.workPlans = sortedEvents;
            }),

        resetUsersWorkPlans: createSuccessReducerWithPayload<CalendarSlice, number>(
            (state: CalendarSlice, action: PayloadAction<number>) => {
                state.workPlans.currentMonth = state.workPlans.currentMonth.filter(w => w.userId == action.payload);
                state.workPlans.previousMonth = state.workPlans.previousMonth.filter(w => w.userId == action.payload);
                state.workPlans.nextMonth = state.workPlans.nextMonth.filter(w => w.userId == action.payload);
            }),

        setWorkPlan: createPendingReducerWithPayload<CalendarSlice, SetWorkPlanType>(),
        setWorkPlanSuccess: createSuccessReducerWithPayload<CalendarSlice, WorkPlan>(
            (state: CalendarSlice, action: PayloadAction<WorkPlan>) => {
                const sortedEvents: FormattedCalendarArr<SortedCalendarArr> = state.workPlans
                const local = GetLocalWorkPlan(action.payload)

                const localDate = local.date.getMonth();
                const currentDate = state.currentDate.getMonth();

                const userEvents = sortedEvents[
                    localDate == currentDate
                        ? 'currentMonth'
                        : localDate < currentDate
                            ? 'previousMonth'
                            : 'nextMonth'];

                const existingUser = userEvents.find((u) => u.userId === local.userId);

                if (existingUser) {
                    const existingWorkPlanIndex = existingUser.workPlans.findIndex(
                        (wp) => wp.id === local.id
                    );

                    if (existingWorkPlanIndex !== -1) {
                        existingUser.workPlans[existingWorkPlanIndex] = local;
                    } else {
                        existingUser.workPlans.push(local);
                    }
                } else {
                    userEvents.push({
                        userId: local.userId,
                        workPlans: [local],
                    });
                }

                state.workPlans = sortedEvents;
            }
        ),


        deleteWorkPlan: createPendingReducerWithPayload<CalendarSlice, SchedulerWorkPlan>(),
        deleteWorkPlanSuccess: createSuccessReducerWithPayload<CalendarSlice, WorkPlan>(
            (state: CalendarSlice, action: PayloadAction<WorkPlan>) => {
                const local = GetLocalWorkPlan(action.payload)

                const userEvents = state.workPlans;
                const sortedEvents = userEvents[
                    local.date.getMonth() == state.currentDate.getMonth()
                        ? 'currentMonth'
                        : local.date.getMonth() < state.currentDate.getMonth()
                            ? 'previousMonth' : 'nextMonth'];

                const existingUser = sortedEvents.find((u) => u.userId === local.userId);

                if (existingUser) {
                    existingUser.workPlans = existingUser.workPlans.filter(w => w.id != local.id)
                }

                state.workPlans = userEvents;
            }),

        deleteCalendarEvent: createPendingReducerWithPayload<CalendarSlice, CalendarEvent>(),
        deleteCalendarEventSuccess: createSuccessReducerWithPayload<CalendarSlice, CalendarEvent>(
            (state: CalendarSlice, action: PayloadAction<CalendarEvent>) => {
                const local = GetLocalCalendarEvent(action.payload);
                const { events, currentDate } = state;
                const month =
                    local.date.getMonth() === currentDate.getMonth()
                        ? 'currentMonth'
                        : local.date.getMonth() < currentDate.getMonth()
                            ? 'previousMonth'
                            : 'nextMonth';

                state.events = {
                    ...events,
                    [month]: events[month].filter((w) => w.id !== local.id),
                };
            }),

        deleteFail: createErrorReducer(),
        fetchFail: createErrorReducer(),
        setFail: createErrorReducer(),
    }
});

export const {
    setDate, fetchCalendarEvents,
    fetchAllCalendarEventsSuccess,
    fetchNextCalendarEventsSuccess,
    fetchFail, fetchWorkPlans,
    fetchWorkPlansSuccess,
    setWorkPlan, setWorkPlanSuccess,
    setCalendarEventSuccess,
    setCalendarEvent, setFail,
    resetUsersWorkPlans,
    deleteWorkPlan, deleteWorkPlanSuccess,
    deleteCalendarEvent, deleteCalendarEventSuccess,
    deleteFail } = calendarSlice.actions;

export const calendar = calendarSlice.reducer;


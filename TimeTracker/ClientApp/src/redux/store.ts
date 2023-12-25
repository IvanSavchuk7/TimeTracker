import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { createEpicMiddleware } from 'redux-observable';
import {
  user, auth, users, timer,
  workedHours, approvers, vacation,
  approverVacations, messageModalReducer,
  calendar
} from '@redux/slices';
import { rootEpic } from "./epics"
import { persistStore, persistReducer } from 'redux-persist';

import storage from 'redux-persist/lib/storage'
import {infoModalReducer} from "@redux/slices/stateInfoModalSlice.ts";


const middleware = createEpicMiddleware();

export const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['timer']
}

const rootReducer = combineReducers({
  auth: auth,
  user: user,
  users: users,
  approvers: approvers,
  vacations: vacation,
  approverVacations: approverVacations,
  messageModal: messageModalReducer,
  timer: timer,
  calendar: calendar,
  workedHours: workedHours,
  infoModal:infoModalReducer,
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [
    middleware
  ]
})

middleware.run(rootEpic);

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>

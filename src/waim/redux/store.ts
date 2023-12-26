import { ThunkAction, configureStore, Action } from '@reduxjs/toolkit'
import settingsSliceReducer from "./reducers/settingsSlice"
import windowsSlice from './reducers/windowsSlice'


export const store = configureStore({
  reducer: {
    settings: settingsSliceReducer,
    windows: windowsSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({serializableCheck: false}),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
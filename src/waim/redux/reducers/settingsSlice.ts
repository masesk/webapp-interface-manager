import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState, AppThunk } from "../store"
import * as R from "ramda"
export interface SettingsState {
  showing: boolean
}


const initialState: SettingsState = {
  showing: false
}

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleSettings: (state, action: PayloadAction<boolean>) => {
        const showing = action.payload
        return R.assoc("showing", showing, state)
    }
  },
})

export const { toggleSettings } = settingsSlice.actions

export const selectSettings = (state: RootState) => state.settings


export default settingsSlice.reducer

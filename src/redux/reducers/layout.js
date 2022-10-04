import * as R from 'ramda'
import { SELECT_LAYOUT } from "../actionTypes";


const initialState = {
    selectedLayout: undefined,
    selectedApps: {}
}

export default function (state = initialState, action) {
    switch (action.type) {
      case SELECT_LAYOUT:  {
        const { layoutType } = action.payload
        console.log(action)
        return R.assoc("selectedLayout", layoutType, state)
        
      }
      default:
        return state;
    }
  }
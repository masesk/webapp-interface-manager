import * as R from 'ramda'
import { REMOVE_LAYOUT, SELECT_LAYOUT, SELECT_LAYOUT_APP } from "../actionTypes";


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

      case SELECT_LAYOUT_APP: {
        const {appid, index} = action.payload
        return R.assocPath(["selectedApps", index], appid, state)
      }

      case REMOVE_LAYOUT: {
        return R.compose(
          R.assoc("selectedLayout", undefined),
          R.assoc("selectedApps", {})
        )(state)
      }
      default:
        return state;
    }
  }
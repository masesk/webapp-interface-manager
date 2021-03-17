import { CREATE_WINDOW, SHOW_WINDOW, HIDE_WINDOW, UPDATE_INDEX } from "../actionTypes";
import * as R from 'ramda'
import {BUILT_IN_APPS} from '../../constants'

const initialState = BUILT_IN_APPS;

export default function(state = initialState, action) {
  switch (action.type) {
    case SHOW_WINDOW: {
      const {id} = action.payload
      return R.assocPath([id, "showing"], true, state)
    }

    case HIDE_WINDOW: {
      const {id} = action.payload
      return R.assocPath([id, "showing"], false, state)
    }
    case CREATE_WINDOW:{
      const window = {
        id: action.payload.id,
        title: action.payload.title,
        width: action.payload.width,
        height: action.payload.height,
        url: action.payload.url,
        showing: true,
        zIndex: 1
      }
      return R.assoc(action.payload.id, window, state)
    }
    case UPDATE_INDEX:{
      const {id} = action.payload
      const result = R.map(window => {
        if(R.propEq("id", id, window)){
          return R.assoc("zIndex", 1, window)
        }
        else{
          return R.assoc("zIndex", 0, window)
        }
      }, state)
      return result

    }
    default:
      return state;
  }
}

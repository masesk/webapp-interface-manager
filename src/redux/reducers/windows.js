import { CREATE_WINDOW, SHOW_WINDOW, HIDE_WINDOW, UPDATE_INDEX, MINIMIZE_WINDOW } from "../actionTypes";
import * as R from 'ramda'
import {BUILT_IN_APPS} from '../../constants'

const initialState = {
  apps: BUILT_IN_APPS,
  order: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SHOW_WINDOW: {
      const {id} = action.payload
      const index = R.findIndex(R.equals(id))(R.prop("order", state))
      const order = index => {
        if(R.gte(index, 0)){
          return R.assoc("order", R.append(id, R.remove(index, 1, R.prop("order", state))), state)
        }
        else{
          return R.assoc("order", R.append(id, R.prop("order", state)), state)
        }
      }
      return R.compose(
        R.assocPath(["apps", id, "showing"], true),
        R.assocPath(["apps", id, "minimized"], false),
        R.assoc("order", R.prop("order", order(index)))
      )(state)
    }

    case HIDE_WINDOW: {
      const {id} = action.payload
      const index = R.findIndex(R.equals(id))(R.prop("order", state))
      return R.compose(
        R.assoc("order", R.remove(index, 1, R.prop("order", state))),
        R.assocPath(["apps", id, "showing"], false),
        R.assocPath(["apps", id, "minimized"], false)
      )(state)
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
      return R.assocPath(["apps", action.payload.id], window, state)
    }
    case UPDATE_INDEX:{
      const {id} = action.payload
      const index = R.findIndex(R.equals(id))(R.prop("order", state))
      const order = index => {
        if(R.gte(index, 0)){
          return R.assoc("order", R.append(id, R.remove(index, 1, R.prop("order", state))), state)
        }
        else{
          return R.assoc("order", R.append(id, R.prop("order", state)), state)
        }
      }
      return order(index)
    }
    case MINIMIZE_WINDOW:{
      const {id} = action.payload
      return R.compose(
        R.assocPath(["apps", id, "minimized"], true)
      )(state)
    }
    default:
      return state;
  }
}

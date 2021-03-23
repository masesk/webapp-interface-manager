import { CREATE_WINDOW, SHOW_WINDOW, HIDE_WINDOW, UPDATE_INDEX, MINIMIZE_WINDOW, UNMINIMIZE_WINDOW, UNMINIMIZE_UPDATE_INDEX, HIDE_WINDOW_ID } from "../actionTypes";
import * as R from 'ramda'
import {BUILT_IN_APPS} from '../../constants'
let appView = 0;
let opened = {}
const initialState = {
  apps: BUILT_IN_APPS,
  view: []
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SHOW_WINDOW: {
      const {appid} = action.payload
      if(R.pathEq(["apps", appid, "single"], true, state) && R.propEq(appid, true, opened)){
        return state
      }
      opened[appid] = true
      return R.compose(
        R.assocPath(["apps", appid, "showing"], true),
        R.assocPath(["apps", appid, "minimized"], false),
        R.assoc("view", R.append({appid, viewid: appView++}, state.view))
      )(state)
    }

    case HIDE_WINDOW: {
      const {index} = action.payload
      delete opened[R.path(["view", index, "appid"], state)]
      return R.assoc("view", R.remove(index, 1, R.prop("view", state)), state)
    }
    case CREATE_WINDOW:{
      const window = {
        appid: action.payload.appid,
        title: action.payload.title,
        width: action.payload.width,
        height: action.payload.height,
        url: action.payload.url,
        single: action.payload.single
      }
      return R.assocPath(["apps", action.payload.appid], window, state)
    }
    case UPDATE_INDEX:{
      const {index} = action.payload
      const instance = R.path(["view", index], state)
      return R.assoc("view", R.append(instance, R.remove(index, 1, R.prop("view", state))), state)
    }
    case MINIMIZE_WINDOW:{
      const {index} = action.payload
      const updateIn = R.curry((path, val, obj) => R.compose(
        R.set(R.__, val, obj),
        R.apply(R.compose),
        R.map(R.cond([[R.is(Number), R.lensIndex], [R.T, R.lensProp]]))
      )(path));
      return updateIn(["view", Number(index), "minimized"], true, state);

    }
    case UNMINIMIZE_WINDOW:{
      const {index} = action.payload
      const updateIn = R.curry((path, val, obj) => R.compose(
        R.set(R.__, val, obj),
        R.apply(R.compose),
        R.map(R.cond([[R.is(Number), R.lensIndex], [R.T, R.lensProp]]))
      )(path));
      return updateIn(["view", Number(index), "minimized"], false, state);

    }

    case UNMINIMIZE_UPDATE_INDEX:{
      console.log("here")
      const {viewid} = action.payload
      const index = R.findIndex(R.propEq("viewid", viewid))(R.prop("view", state));
      const updateIn = R.curry((path, val, obj) => R.compose(
        R.set(R.__, val, obj),
        R.apply(R.compose),
        R.map(R.cond([[R.is(Number), R.lensIndex], [R.T, R.lensProp]]))
      )(path));
      
      const updateIndex = updateIn(["view", Number(index), "minimized"], false, state)
      const instance = R.path(["view", index], updateIndex)
      return R.assoc("view", R.append(instance, R.remove(index, 1, R.prop("view", updateIndex))), updateIndex)
    }

    case HIDE_WINDOW_ID: {
      const {viewid} = action.payload
      const index = R.findIndex(R.propEq("viewid", viewid))(R.prop("view", state));
      delete opened[R.path(["view", index, "appid"], state)]
      return R.assoc("view", R.remove(index, 1, R.prop("view", state)), state)
    }
    default:
      return state;
  }
}

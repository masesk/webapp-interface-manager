import {
  CREATE_APP,
  SHOW_WINDOW,
  HIDE_WINDOW,
  UPDATE_INDEX,
  MINIMIZE_WINDOW,
  UNMINIMIZE_WINDOW,
  UNMINIMIZE_UPDATE_INDEX,
  HIDE_WINDOW_ID,
  DELETE_APP,
  LOAD_APPS,
  RESET_DEFAULT,
  UPDATE_APP,
  ADD_APP_DOM,
  REMOVE_ALL_LAYOUT,
  SELECT_LAYOUT,
  SELECT_LAYOUT_APP,
  CREATE_NOTIFICATION,
  REMOVE_NOTIFICATION,
  ADD_LAYOUT,
  ADD_LAYOUT_INITIAL,
  TOGGLE_LAYOUT_EDIT,
  LAYOUT_SIZE_CHANGE
} from "../actionTypes";
import * as R from 'ramda'
import { BUILT_IN_APPS } from '../../constants'
import { SELECTED_APP } from "../constants";
let appView = 0;
let opened = {}
const appName = "waim"
const appNameLayout = "waimlayout"
const initialState = {
  apps: BUILT_IN_APPS,
  view: [],
  appDoms: {},
  layout:
    {},
  layoutEditEnabled: false,
  notificationCount: 0,
  notifications: {},
  openApps: {}
};

const save = (newstate) => {
  const myStorage = window.localStorage;
  myStorage.setItem(appName, JSON.stringify(newstate.apps));
  return newstate
}

const saveLayout = (newState) => {
  const myStorage = window.localStorage;
  myStorage.setItem(appNameLayout, JSON.stringify(R.prop("layout", newState)))
  return newState
}

const countLayoutApps = (map, layout) => {
  if (R.isNil(layout)) {
    return 0
  }
  if (layout.type === SELECTED_APP) {
    let count = 0;
    if (map.get(layout.appid) !== undefined) {
      count = map.get(layout.appid)
    }
    map.set(layout.appid, count + 1)
  }
  if (layout["0"] !== undefined) {
    countLayoutApps(map, layout[0])
  }
  if (layout["1"] !== undefined) {
    countLayoutApps(map, layout[1])
  }
}


const mapLayoutApp = (layout, appid, path, callback) => {
  if (R.isNil(layout)) {
    return
  }
  if (layout.type === SELECTED_APP && layout.appid === appid) {
    callback(layout, path)
  }
  if (layout["0"] !== undefined) {
    mapLayoutApp(layout[0], appid, R.append(0, path), callback)
  }
  if (layout["1"] !== undefined) {
    mapLayoutApp(layout[1], appid, R.append(1, path), callback)
  }
}




const load = (newstate) => {
  const myStorage = window.localStorage;
  const apps = myStorage.getItem(appName);
  const layout = myStorage.getItem(appNameLayout)
  const layoutObj = R.assoc("layout", JSON.parse(layout), newstate)
  const map = new Map()
  countLayoutApps(map, R.prop("layout", layoutObj))
  let tmpLayoutObj = layoutObj
  for (let [key, value] of map) {
    tmpLayoutObj = R.assocPath(["openApps", key], value, tmpLayoutObj)
  }
  return R.assoc("apps", R.isNil(apps) ? BUILT_IN_APPS : JSON.parse(apps), tmpLayoutObj)
}




const updateIn = R.curry((path, val, obj) => R.compose(
  R.set(R.__, val, obj),
  R.apply(R.compose),
  R.map(R.cond([[R.is(Number), R.lensIndex], [R.T, R.lensProp]]))
)(path));

export default function main(state = initialState, action) {
  switch (action.type) {
    case SHOW_WINDOW: {
      const { appid } = action.payload
      if (R.pathEq(["apps", appid, "single"], true, state) && R.gt(R.path(["openApps", appid], state), 0)) {
        return state
      }
      appView++
      opened[appid] = true
      return R.compose(
        R.assoc("view", R.append({ appid, viewid: appView, zIndex: Number(R.length(R.prop("view", state)) + 1) }, state.view)),
        R.assocPath(["openApps", appid], R.inc(R.pathOr(0, ["openApps", appid], state)))
      )(state)
    }

    case HIDE_WINDOW: {
      const { index } = action.payload

      delete opened[R.path(["view", index, "appid"], state)]
      const zIndex = R.path(["view", Number(index), "zIndex"], state)
      const viewid = R.path(["view", Number(index), "viewid"], state)
      const length = R.length(state.view)
      const instance = R.compose(
        R.map(([index, win]) => {
          const fviewid = R.prop("viewid", win)
          const fzIndex = R.prop("zIndex", win)
          if (R.equals(fviewid, viewid)) {
            return R.assoc("zIndex", Number(length), win)
          }
          else {
            if (Number(fzIndex) > zIndex) {
              return R.assoc("zIndex", Number(fzIndex) - 1, win)
            }
            else {
              return R.assoc("zIndex", fzIndex, win)
            }
          }
        }),
        R.toPairs,
      )(state.view)
      const appid = R.path(["view", index, "appid"], state)
      return R.compose(
        R.assoc("view", R.remove(index, 1, instance)),
        R.assocPath(["openApps", appid], R.dec(R.pathOr(0, ["openApps", appid], state)))
      )(state)
    }
    case CREATE_APP: {
      const payload = action.payload;
      const window = {
        appid: payload.appid,
        title: R.propOr("No Title", "title", payload),
        width: R.propOr(500, "width", payload),
        height: R.propOr(500, "height", payload),
        url: R.propOr("", "url", payload),
        single: R.propOr(false, "single", payload),
        deletable: R.propOr(true, "deletable", payload),
        editable: R.propOr(true, "editable", payload),
        imageUrl: R.propOr("", "imageUrl", payload),
      }
      return R.compose(
        save,
        R.assocPath(["apps", action.payload.appid], window)
      )(state)
    }
    case UPDATE_INDEX: {
      const { viewid } = action.payload
      const length = R.length(state.view)
      const index = R.findIndex(R.propEq("viewid", viewid))(R.prop("view", state));
      const zIndex = R.path(["view", Number(index), "zIndex"], state)
      if (R.pathEq(["view", Number(index), "zIndex"], length, state)) {
        return state
      }
      const instance = R.compose(
        R.map(([index, win]) => {
          const fviewid = R.prop("viewid", win)
          const fzIndex = R.prop("zIndex", win)
          if (R.equals(fviewid, viewid)) {
            return R.assoc("zIndex", Number(length), win)
          }
          else {
            if (Number(fzIndex) > zIndex) {
              return R.assoc("zIndex", Number(fzIndex) - 1, win)
            }
            else {
              return R.assoc("zIndex", fzIndex, win)
            }
          }
        }),
        R.toPairs,
      )(state.view)
      return R.assoc("view", instance, state)
    }
    case MINIMIZE_WINDOW: {
      const { index } = action.payload
      const updateIn = R.curry((path, val, obj) => R.compose(
        R.set(R.__, val, obj),
        R.apply(R.compose),
        R.map(R.cond([[R.is(Number), R.lensIndex], [R.T, R.lensProp]]))
      )(path));
      return updateIn(["view", Number(index), "minimized"], true, state);

    }
    case UNMINIMIZE_WINDOW: {
      const { index } = action.payload
      return updateIn(["view", Number(index), "minimized"], false, state);

    }

    case UNMINIMIZE_UPDATE_INDEX: {
      const { viewid } = action.payload
      const length = R.length(state.view)
      const index = R.findIndex(R.propEq("viewid", viewid))(R.prop("view", state));
      const zIndex = R.path(["view", Number(index), "zIndex"], state)


      const min = updateIn(["view", Number(index), "minimized"], false, state)
      if (R.pathEq(["view", Number(index), "zIndex"], length, state)) {
        return min
      }
      const instance = R.compose(
        R.map(([index, win]) => {
          const fviewid = R.prop("viewid", win)
          const fzIndex = R.prop("zIndex", win)
          if (R.equals(fviewid, viewid)) {
            return R.assoc("zIndex", Number(length), win)
          }
          else {
            if (Number(fzIndex) > zIndex) {
              return R.assoc("zIndex", Number(fzIndex) - 1, win)
            }
            else {
              return R.assoc("zIndex", fzIndex, win)
            }
          }
        }),
        R.toPairs
      )(min.view)
      return R.assoc("view", instance, state)
    }

    case HIDE_WINDOW_ID: {
      const { viewid } = action.payload
      const index = R.findIndex(R.propEq("viewid", viewid))(R.prop("view", state));
      delete opened[R.path(["view", index, "appid"], state)]
      const zIndex = R.path(["view", Number(index), "zIndex"], state)
      const length = R.length(state.view)
      const instance = R.compose(
        R.map(([_, win]) => {
          const fviewid = R.prop("viewid", win)
          const fzIndex = R.prop("zIndex", win)
          if (R.equals(fviewid, viewid)) {
            return R.assoc("zIndex", Number(length), win)
          }
          else {
            if (Number(fzIndex) > zIndex) {
              return R.assoc("zIndex", Number(fzIndex) - 1, win)
            }
            else {
              return R.assoc("zIndex", fzIndex, win)
            }
          }
        }),
        R.toPairs,
      )(state.view)

      const appid = R.path(["view", index, "appid"], state)

      return R.compose(
        R.assoc("view", R.remove(index, 1, instance)),
        R.assocPath(["openApps", appid], R.dec(R.pathOr(0, ["openApps", appid], state)))
      )(state)

    }


    case UPDATE_APP: {
      const payload = action.payload;
      const window = {
        appid: payload.appid,
        title: R.propOr("No Title", "title", payload),
        width: R.propOr(500, "width", payload),
        height: R.propOr(500, "height", payload),
        url: R.propOr("", "url", payload),
        single: R.propOr(false, "single", payload),
        deletable: R.propOr(true, "deletable", payload),
        editable: R.propOr(true, "editable", payload),
        imageUrl: R.propOr("", "imageUrl", payload),
      }
      delete opened[payload.appid]

      let layoutRemoved = state
      mapLayoutApp(layoutRemoved.layout, payload.appid, [], (_, path) => {
        layoutRemoved = R.dissocPath(["layout", ...path], layoutRemoved)
      })

      layoutRemoved = R.dissocPath(["openApps", payload.appid], layoutRemoved)
      const removed = R.compose(
        save,
        saveLayout,
        R.assocPath(["apps", payload.appid], window),
        R.assoc("view", R.filter(view => {
          return !R.propEq("appid", payload.appid, view)
        }, state.view)),
      )(layoutRemoved)


      const sorted = R.reverse(R.sortBy(R.prop("zIndex"), removed.view))
      let lengthIndex = sorted.length
      return R.assoc("view", R.compose(
        R.map(([index, win]) => {
          return R.assoc("zIndex", lengthIndex--, win)
        }),
        R.toPairs,
      )(sorted), removed)

    }

    case DELETE_APP: {
      const { appid } = action.payload
      const removed = R.compose(
        save,
        R.dissocPath(["apps", appid]),
        R.assoc("view", R.filter(view => {
          return !R.propEq("appid", appid, view)
        }, state.view)
        ))(state)

      const sorted = R.reverse(R.sortBy(R.prop("zIndex"), removed.view))
      let lengthIndex = sorted.length
      const newState = R.assoc("view", R.compose(
        R.map(([index, win]) => {
          return R.assoc("zIndex", lengthIndex--, win)
        }),
        R.toPairs,
      )(sorted), removed)


      let layoutRemoved = newState
      mapLayoutApp(layoutRemoved.layout, appid, [], (_, path) => {
        layoutRemoved = R.dissocPath(["layout", ...path], layoutRemoved)
      })
      return R.compose(
        saveLayout,
        R.dissocPath(["openApps", appid])
      )(layoutRemoved)
  

    }
    case LOAD_APPS: {
      return load(state)
    }

    case RESET_DEFAULT: {
      opened = {}
      appView = 0
      window.localStorage.removeItem(appName);
      window.localStorage.removeItem(appNameLayout)
      return R.compose(
        save,
        R.assoc("apps", BUILT_IN_APPS),
        R.assoc("view", []),
        R.assoc("layout", {}),
        R.assoc("openApps", {})
      )(state)
    }

    case SELECT_LAYOUT: {
      const { layoutType } = action.payload
      const newState = R.assocPath(["layout", "selectedLayout"], layoutType, state)
      window.localStorage.setItem(appNameLayout, JSON.stringify(R.prop("layout", newState)))
      return newState

    }

    case REMOVE_ALL_LAYOUT: {
      const map = new Map()
      countLayoutApps(map, R.prop("layout", state))
      let tmpState = state
      for (let [key, _] of map) {
        tmpState = R.assocPath(["openApps", key], R.dec(R.pathOr(0, ["openApps", key], tmpState)), tmpState)
      }
      const newState = R.compose(
        R.assoc("layout", {})
      )(tmpState)
      window.localStorage.setItem(appNameLayout, JSON.stringify(R.prop("layout", newState)))
      return newState
    }

    case ADD_APP_DOM: {
      const { appid, appDom } = action.payload
      return R.assocPath(["appDoms", appid], appDom, state)
    }

    case CREATE_NOTIFICATION: {
      const { message, type, duration } = action.payload
      return R.compose(
        R.assocPath(["notifications", state.notificationCount], { message, type, duration }),
        R.assoc("notificationCount", R.inc(R.prop("notificationCount", state)))
      )(state)
    }

    case REMOVE_NOTIFICATION: {
      const { id } = action.payload
      return R.assoc("notifications", R.pick(R.filter((n) => {
        return n != id
      }, R.keys(state.notifications)), state.notifications), state)
    }

    case ADD_LAYOUT: {
      const { indexPath, layoutType } = action.payload
      return R.compose(
        saveLayout,
        R.assocPath(["layout", ...indexPath, "type"], layoutType)
      )(state)
    }

    case ADD_LAYOUT_INITIAL: {
      const { layoutType } = action.payload
      return R.compose(
        saveLayout,
        R.assocPath(["layout", "type"], layoutType)
      )(state)
    }

    case SELECT_LAYOUT_APP: {
      const { appid, indexPath } = action.payload
      if (R.pathEq(["apps", appid, "single"], true, state) && R.gt(R.path(["openApps", appid], state), 0)) {
        return state
      }
      return R.compose(
        saveLayout,
        R.assocPath(["layout", ...indexPath, "appid"], appid),
        R.assocPath(["layout", ...indexPath, "type"], SELECTED_APP),
        R.assocPath(["openApps", appid], R.inc(R.pathOr(0, ["openApps", appid], state)))
      )(state)
    }

    case TOGGLE_LAYOUT_EDIT: {
      return R.assoc("layoutEditEnabled", !R.prop("layoutEditEnabled", state), state)
    }

    case LAYOUT_SIZE_CHANGE: {
      const { indexPath, sizes } = action.payload

      return R.compose(
        saveLayout,
        R.assocPath(["layout", ...indexPath, "sizes"], sizes)
      )(state)
    }

    default:
      return state;
  }
}

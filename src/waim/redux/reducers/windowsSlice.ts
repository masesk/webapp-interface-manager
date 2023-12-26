

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { RootState, AppThunk } from "../store"
import * as R from "ramda"
import { AppsInterface, AppStruct, BUILT_IN_APPS } from "../../../constants"
import { SELECTED_APP } from "../constants"




interface OpenApps {
  [key: string]: number
}

interface NotificationStruct {
  message: string,
  type: "error" | "warning" | "info" | "success",
  duration: number
}

interface Notification {
  [key: number]: NotificationStruct
}

interface AppDomParams {
  appid: string,
  appDom: JSX.Element
}



interface AppDoms {
  [key: string]: JSX.Element
}

interface View {
  appid: string,
  viewid: number,
  zIndex: number,
  minimized?: boolean
}

export type LayoutType = "HORIZONTAL_LAYOUT" | "VERTICAL_LAYOUT"

interface LayoutParams {
  layoutType: LayoutType,
  indexPath: number[]
}

interface SelectLayoutParams {
  appid: string,
  indexPath: number[]
}

type LayoutNode = {
  type: LayoutType
  sizes: [number, number],
  [key: number]: Layout
}
type LayoutApp = {
  type: "SELECTED_APP",
  appid: string
}

interface LayoutChangeParams {
  indexPath: number[],
  sizes: [number, number]

}

type Layout = LayoutNode | LayoutApp

interface WindowsState {
  apps: AppsInterface,
  view: View[],
  appDoms: AppDoms,
  layout: Layout | {},
  layoutEditEnabled: boolean,
  notificationCount: number,
  notifications: Notification,
  openApps: OpenApps

}

interface Opened {
  [key: string]: boolean
}

let appView: number = 0;
let opened: Opened = {}
const appName: string = "waim"
const appNameLayout: string = "waimlayout"
const initialState: WindowsState = {
  apps: BUILT_IN_APPS,
  view: [],
  appDoms: {},
  layout:
    {},
  layoutEditEnabled: false,
  notificationCount: 0,
  notifications: {},
  openApps: {}
}

const save = (newstate: AppsInterface) => {
  const myStorage = window.localStorage;
  myStorage.setItem(appName, JSON.stringify(newstate || ""));
  return newstate
}

const saveLayout = (newState: WindowsState) => {
  const myStorage = window.localStorage;
  myStorage.setItem(appNameLayout, JSON.stringify(R.prop("layout", newState) || ""))
}

const countLayoutApps = (map: Map<string, number>, layout: Layout) => {
  if (R.isNil(layout)) {
    return 0
  }
  if (layout.type === "SELECTED_APP") {
    let count: number = 0;
    if (map.get(layout.appid) !== undefined) {
      count = map.get(layout.appid) as number
    }
    map.set(layout.appid as string, count + 1)
  }
  if (layout.type !== "SELECTED_APP") {
    if (layout["0"] !== undefined) {
      countLayoutApps(map, layout[0])
    }
    if (layout["1"] !== undefined) {
      countLayoutApps(map, layout[1])
    }
  }

}

const mapLayoutApp = (layout: Layout, appid: string, path: number[], callback: Function) => {
  if (R.isNil(layout)) {
    return
  }
  if (layout.type === "SELECTED_APP" && layout.appid === appid) {
    callback(layout, path)
  }
  if (layout.type !== "SELECTED_APP") {
    if (layout["0"] !== undefined) {
      mapLayoutApp(layout[0], appid, R.append(0, path), callback)
    }
    if (layout["1"] !== undefined) {
      mapLayoutApp(layout[1], appid, R.append(1, path), callback)
    }
  }
}

const load = (newstate: WindowsState) => {
  const myStorage = window.localStorage;
  const apps = myStorage.getItem(appName);
  const layout: string | null = myStorage.getItem(appNameLayout)
  const layoutObj = R.assoc("layout", JSON.parse(layout || "{}"), newstate)
  const map: Map<string, number> = new Map()
  countLayoutApps(map, R.prop("layout", layoutObj))
  let tmpLayoutObj = layoutObj
  for (let [key, value] of map) {
    tmpLayoutObj = R.assocPath(["openApps", key], value, tmpLayoutObj)
  }
  return R.assoc("apps", R.isNil(apps) ? BUILT_IN_APPS : JSON.parse(apps), tmpLayoutObj)
}

const shiftWindows = (state: WindowsState, viewid: number, zIndex: number, length: number) => {
  // loop through each view, update the zIndex based on the change of window being hidden
  state.view.map((value: View) => {
    // grab the view id of the view
    const fviewid = value.viewid

    // grab the z index of the view
    const fzIndex = value.zIndex

    // if the view is the one we are looking for, put it on top
    if (fviewid === viewid) value.zIndex = Number(length)

    // shift all the others below our current window down
    else if (fzIndex > zIndex) value.zIndex = fzIndex - 1

    // keep the ones below us the same
    else value.zIndex = fzIndex
  })
  return state
}

const assocPathInternal =  (path: any, val: any, obj: any) => {
  let tmpObj = obj
  let idx: number | string = ""
  while(path.length !== 0){
      idx = path[0]
      if (path.length === 1) break
      if(tmpObj.hasOwnProperty(idx) && 
          typeof tmpObj[idx] === "object" || Array.isArray(obj[idx])){
          tmpObj = tmpObj[idx]
      }
      else{
          tmpObj[idx] = {}
          tmpObj = tmpObj[idx]
      }
      console.log("Processing ", idx, obj)
      path.splice(0, 1)
  }
  if (idx !== "") tmpObj[idx] = val
}
const dissocPathInternal =  (path: any, obj: any) => {
  let tmpObj = obj
  let idx: number | string = ""
  while(path.length !== 0){
      idx = path[0]
      if (path.length === 1) break
      if(tmpObj.hasOwnProperty(idx) && 
          typeof tmpObj[idx] === "object" || Array.isArray(obj[idx])){
          tmpObj = tmpObj[idx]
      }
      else{
        return
      }
      path.splice(0, 1)
  }
  if(idx !== ""){
    if(Array.isArray(tmpObj) && typeof idx === "number"){
        tmpObj.splice(idx, 1)
    }
    else{
        delete tmpObj[idx]
    }
  }
}

const sortByKey = (array: any, key: string) => {
  return array.sort(function(a: any, b: any) {
      var x = a[key]; var y = b[key];
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
  });
}


export const windowsSlice = createSlice({
  name: "windows",
  initialState,
  reducers: {
    createWindow: (state, action: PayloadAction<string>) => {

      // grab the appid request to be created a new window for
      const appid: string = action.payload


      if (R.path(["apps", appid, "single"], state) && R.gt(R.path(["openApps", appid], state), 0)) {
        return state
      }
      appView++
      opened[appid] = true
      const newView: View = {
        appid: appid,
        viewid: appView,
        zIndex: state.view.length + 1
      }
      !state.openApps.hasOwnProperty(appid) ? state.openApps[appid] = 1 : state.openApps[appid] += 1
      state.view.push(newView)
    },

    hideWindowWithIndex: (state, action: PayloadAction<number>) => {
      // grab the index from payload
      const index: number = action.payload

      // grab the appid that corresponds to the index received
      const appid: string = state.view[index].appid

      // deleted the opened based on appid
      delete opened[appid]

      // grab the current zindex of the view
      const zIndex: number = state.view[index].zIndex

      // grab the viewid
      const viewid: number = state.view[index].viewid

      // gran the length of the view
      const length: number = state.view.length

      // loop through each view, update the zIndex based on the change of window being hidden
      shiftWindows(state, viewid, zIndex, length)

      // remove the view
      state.view.splice(index, 1)

      // decrement open apps
      state.openApps[appid] -= 1
    },
    createApp: (state, action: PayloadAction<AppStruct>) => {
      const { appid, title, width, height, url, single, deletable, editable, imageUrl }: AppStruct = action.payload
      const newWindow: AppStruct = {
        appid,
        title,
        width,
        height,
        url,
        single,
        deletable,
        editable,
        imageUrl
      }
      state.apps[appid] = newWindow
      save(state.apps)
    },

    updateIndex: (state, action: PayloadAction<number>) => {

      // grab the view id
      const viewid: number = action.payload

      // grab length of views
      const length: number = state.view.length

      // grab the index of the view id
      const index: number = state.view.map(e => e.viewid).indexOf(viewid);

      // grab the z index of the view
      const zIndex: number = state.view[index].zIndex

      // loop through each window, update or shift their z index based on the changed view
      shiftWindows(state, viewid, zIndex, length)
    },

    minimizeWindow: (state, action: PayloadAction<number>) => {
      // gran the index of the view
      const index = action.payload

      // set the view's minimized to true
      state.view[index].minimized = true
    },
    unminimizeWindow: (state, action: PayloadAction<number>) => {
      // gran the index of the view
      const index: number = action.payload

      // set the view's minimized to false
      state.view[index].minimized = false

    },
    unminimizeWindowAndUpdateIndex: (state, action: PayloadAction<number>) => {
      // grab the view id
      const viewid: number = action.payload

      // grab the length of the view
      const length: number = state.view.length

      // grab the index of the view id
      const index: number = state.view.map(e => e.viewid).indexOf(viewid);

      // grab the z index
      const zIndex: number = state.view[index].zIndex

      // update to minimized as false
      state.view[index].minimized = false

      // check if the index of the view at the top
      if (state.view[index].zIndex === length) return state

      // otherwise, shift windows everything
      shiftWindows(state, viewid, zIndex, length)
    },
    hideWindowWithViewId: (state, action: PayloadAction<number>) => {
      // grab the view id
      const viewid: number = action.payload

      // grab the length of the view
      const length: number = state.view.length

      // grab the index of the view id
      const index: number = state.view.map(e => e.viewid).indexOf(viewid);

      // grab the z index
      const zIndex: number = state.view[index].zIndex

      // shift windows
      shiftWindows(state, viewid, zIndex, length)

      // grab the app id
      const appid = state.view[index].appid

      // remove the view
      state.view.splice(index, 1)

      //decrement open apps
      state.openApps[appid] -= 1
    },
    updateApp: (state, action: PayloadAction<AppStruct>) => {

      // grab all the necessary propss
      const { appid, title, width, height, url, single, deletable, editable, imageUrl }: AppStruct = action.payload
      
      // construct a new window to update
      const newWindow: AppStruct = {
        appid,
        title,
        width,
        height,
        url,
        single,
        deletable,
        editable,
        imageUrl
      }

      // deleted the opened id for app
      delete opened[appid]

      // loop through and remove all the layouts that use this app
      mapLayoutApp((state.layout as Layout), appid, [], (_1: Layout, path: number[]) => {
        console.log(path)
        dissocPathInternal(["layout", ...path], state)
      })

      // remove the open apps 
      delete state.openApps[appid]

      // filter the views and remove all the ones that use this appid
      state.view = state.view.filter(view => view.appid !== appid)

      // update the app
      console.log(appid)
      state.apps[appid] = newWindow

      // save new layout
      saveLayout(state)      

      // save apps
      save(state.apps)

      // sort the list based on the zIndex
      sortByKey(state.view, "zIndex")

      // reverse the list
      state.view.reverse()

      // grab the length of the sorted list
      let lengthIndex: number = state.view.length

      // loop through each view and update the index
      state.view.map((value: View) => {
        value.zIndex = lengthIndex--
      })

    },
    deleteApp: (state, action: PayloadAction<string>)=> {
      // grab the appid
      const appid = action.payload

      // filter out all the views that use the appid
      state.view = state.view.filter(e => e.appid !== appid)

      // sort the list based on the zIndex
      sortByKey(state.view, "zIndex")

      // reverse the list
      state.view.reverse()

      // grab the length of the sorted list
      let lengthIndex: number = state.view.length

      // loop through each view and update the index
      state.view.map((value: View) => {
        value.zIndex = lengthIndex--
      })

      // loop through and remove all the layouts that use this app
      mapLayoutApp((state.layout as Layout), appid, [], (path: number[]) => {
          dissocPathInternal(["layout", ...path], state)
      })

      // delete that the app is open
      delete state.openApps[appid]

      // save the layout
      saveLayout(state)

    },
    loadApps: (state)=> {
      load(state)
    },
    resetDefault: (state)=> {
      // reset everything to default
      state = initialState
      opened = {}
      appView = 0

      // remove all storages
      window.localStorage.removeItem(appName);
      window.localStorage.removeItem(appNameLayout)

      // save the apps as they now appear
      save(state.apps)
    },
    removeAllLayout: (state)=> {
      // grab a map 
      const map = new Map<string, number>()

      // count the layouts that use this app 
      countLayoutApps(map, state.layout as Layout)

      // loop through the keys of the map
      for (let [key, _] of map) {
        // for each key, remove the open apps
        state.openApps[key] -= 1
      }
      
      // remove all layouts
      state.layout = {}

      // save the empty layout
      window.localStorage.setItem(appNameLayout, JSON.stringify(R.prop("layout", state)))
    },

    addAppDom: (state, action: PayloadAction<AppDomParams>)=> {
      // grab the appid and app dom
      const { appid, appDom } = action.payload

      // put a app dom at the appid
      state.appDoms[appid] = appDom
    },
    createNotificaiton: (state, action: PayloadAction<NotificationStruct>)=> {
      // grab the notification struct
      const { message, type, duration }: NotificationStruct = action.payload

      // add the new notification with the new id
      state.notifications[state.notificationCount] = { message, type, duration}

      // increment the notification id
      state.notificationCount += 1
    },

    removeNotification: (state, action: PayloadAction<NotificationStruct>)=> {
      // grab the notification struct
      const { message, type, duration }: NotificationStruct = action.payload

      // add the new notification with the new id
      state.notifications[state.notificationCount] = { message, type, duration}

      // increment the notification id
      state.notificationCount += 1
    },
    addLayout: (state, action: PayloadAction<LayoutParams>)=> {
      // grab the layout params
      const {indexPath, layoutType} = action.payload

      // set the state based on the layout path and layout type
      assocPathInternal(["layout", ...indexPath, "type"], layoutType, state)

      // save the state
      saveLayout(state)

      console.log(state)

     // return state
    },
    addLayoutInitial: (state, action: PayloadAction<LayoutType>)=> {
      // set the initial layout type
      (state.layout as LayoutNode).type = action.payload
    },
    selectLayoutApp: (state, action: PayloadAction<SelectLayoutParams>)=> {
      const { appid, indexPath } = action.payload
      if(state.apps[appid].single && state.openApps[appid] > 0) return state
      state.openApps[appid] += 1
      assocPathInternal(["layout", ...indexPath, "type"], SELECTED_APP, state)
      assocPathInternal(["layout", ...indexPath, "appid"], appid, state)
    },
    toggleLayoutEdit: (state)=> {
      // toggle if the layout is in edit mode
      state.layoutEditEnabled = !state.layoutEditEnabled
    },
    changeLayoutSizes: (state, action: PayloadAction<LayoutChangeParams>)=> {
      // grab the index path and the sizes
      const { indexPath, sizes } = action.payload

      // modify the state with the new sizes
      assocPathInternal(["layout", ...indexPath, "sizes"], sizes, state)

      //state = R.assocPath(["layout", ...indexPath, "sizes"], sizes, state)

      // save to local storage
      saveLayout(state)

    }

  },

})

export const { createWindow, hideWindowWithIndex, updateIndex,
  createApp, minimizeWindow, unminimizeWindow, unminimizeWindowAndUpdateIndex,
  hideWindowWithViewId, updateApp, resetDefault, deleteApp, 
  loadApps, removeAllLayout, addAppDom, createNotificaiton, 
  removeNotification, addLayout, addLayoutInitial, toggleLayoutEdit, 
  changeLayoutSizes, selectLayoutApp } = windowsSlice.actions

export const selectWindows = (state: RootState) => state.windows


export default windowsSlice.reducer

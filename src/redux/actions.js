import {
  SHOW_WINDOW,
  CREATE_APP,
  HIDE_WINDOW,
  TOGGLE_SETTINGS,
  UPDATE_INDEX,
  MINIMIZE_WINDOW,
  UNMINIMIZE_WINDOW,
  UNMINIMIZE_UPDATE_INDEX,
  HIDE_WINDOW_ID,
  DELETE_WINDOW,
  LOAD_APPS,
  RESET_DEFAULT,
  UPDATE_WINDOW,
  SELECT_LAYOUT,
  ADD_APP_DOM,
  SELECT_LAYOUT_APP,
  REMOVE_LAYOUT,
  CHANGE_LAYOUT_SIZE_2COL_VER,
  CREATE_NOTIFICATION,
  REMOVE_NOTIFICATION
} from "./actionTypes";


export const hideWindow = index => ({
  type: HIDE_WINDOW,
  payload: { index }
})

export const showWindow = appid => ({
  type: SHOW_WINDOW,
  payload: { appid }
})

export const createApp = (appid, title, width, height, url, single, deletable, editable) => ({
  type: CREATE_APP,
  payload: { appid, title, width, height, url, single, deletable, editable }
})

export const updateWindow = (appid, title, width, height, url, single, deletable, editable) => ({
  type: UPDATE_WINDOW,
  payload: { appid, title, width, height, url, single, deletable, editable }
})


export const toggleShowing = (showing) => ({
  type: TOGGLE_SETTINGS,
  payload: { showing }
})


export const updateIndex = (viewid) => ({
  type: UPDATE_INDEX,
  payload: { viewid }
})

export const minimizeWindow = (index) => ({
  type: MINIMIZE_WINDOW,
  payload: { index }
})

export const unminimizeWindow = (index) => ({
  type: UNMINIMIZE_WINDOW,
  payload: { index }
})

export const uminimizeUpdateIndex = (viewid) => ({
  type: UNMINIMIZE_UPDATE_INDEX,
  payload: { viewid }
})

export const hideWindowId = (viewid) => ({
  type: HIDE_WINDOW_ID,
  payload: { viewid }
})


export const deleteWindow = (appid) => ({
  type: DELETE_WINDOW,
  payload: { appid }
})

export const loadApps = () => ({
  type: LOAD_APPS
})

export const resetDefault = () => ({
  type: RESET_DEFAULT
})



export const selectLayout = (layoutType) => ({
  type: SELECT_LAYOUT,
  payload: {layoutType}
})


export const addAppDom = (appid, appDom) => ({
  type: ADD_APP_DOM,
  payload: {appid, appDom}
})


export const selectLayoutApp = (appid, index) => ({
  type: SELECT_LAYOUT_APP,
  payload: {appid, index}
})

export const removeLayout = () => ({
  type: REMOVE_LAYOUT
})

export const changeLayoutSize2ColVertical = (size) => ({
  type: CHANGE_LAYOUT_SIZE_2COL_VER,
  payload: {size}
})

export const createNotification = (message, type, duration) => ({
  type: CREATE_NOTIFICATION,
  payload: {message, type, duration}
})

export const removeNotification = (id) => ({
  type: REMOVE_NOTIFICATION,
  payload: {id}
})


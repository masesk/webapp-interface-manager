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
  REMOVE_ALL_LAYOUT,
  CREATE_NOTIFICATION,
  REMOVE_NOTIFICATION,
  ADD_LAYOUT,
  ADD_LAYOUT_INITIAL,
  TOGGLE_LAYOUT_EDIT,
  LAYOUT_SIZE_CHANGE
} from "./actionTypes";


export const hideWindow = index => ({
  type: HIDE_WINDOW,
  payload: { index }
})

export const showWindow = appid => ({
  type: SHOW_WINDOW,
  payload: { appid }
})

export const createApp = (appid, title, width, height, url, single, deletable, editable, imageUrl) => ({
  type: CREATE_APP,
  payload: { appid, title, width, height, url, single, deletable, editable, imageUrl }
})

export const updateWindow = (appid, title, width, height, url, single, deletable, editable, imageUrl) => ({
  type: UPDATE_WINDOW,
  payload: { appid, title, width, height, url, single, deletable, editable, imageUrl }
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


export const selectLayoutApp = (appid, indexPath) => ({
  type: SELECT_LAYOUT_APP,
  payload: {appid, indexPath}
})

export const removeAllLayout = () => ({
  type: REMOVE_ALL_LAYOUT
})

export const createNotification = (message, type, duration) => ({
  type: CREATE_NOTIFICATION,
  payload: {message, type, duration}
})

export const removeNotification = (id) => ({
  type: REMOVE_NOTIFICATION,
  payload: {id}
})


export const addLayout = (indexPath, layoutType) => ({
  type: ADD_LAYOUT,
  payload: {indexPath, layoutType}
})

export const addInitialLayout = (layoutType) => ({
  type: ADD_LAYOUT_INITIAL,
  payload: {layoutType}
})

export const toggleLayoutEdit = () => ({
  type: TOGGLE_LAYOUT_EDIT
})

export const layoutSizeChange = (indexPath, sizes) => ({
  type: LAYOUT_SIZE_CHANGE,
  payload: {indexPath, sizes}
})


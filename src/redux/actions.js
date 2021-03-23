import {SHOW_WINDOW, CREATE_WINDOW, HIDE_WINDOW, TOGGLE_SETTINGS, UPDATE_INDEX, MINIMIZE_WINDOW, UNMINIMIZE_WINDOW, UNMINIMIZE_UPDATE_INDEX, HIDE_WINDOW_ID } from "./actionTypes";


export const hideWindow = index => ({
  type: HIDE_WINDOW,
  payload: {index}
})

export const showWindow = appid => ({
  type: SHOW_WINDOW,
  payload: {appid}
})

export const createWindow = (appid, title, width, height, url, single) => ({
  type: CREATE_WINDOW,
  payload: {appid, title, width, height, url, single}
})


export const toggleShowing = (showing) => ({
  type: TOGGLE_SETTINGS,
  payload: {showing}
})


export const updateIndex = (index) => ({
  type: UPDATE_INDEX,
  payload: {index}
})

export const minimizeWindow = (index) => ({
  type: MINIMIZE_WINDOW,
  payload: {index}
})

export const unminimizeWindow = (index) => ({
  type: UNMINIMIZE_WINDOW,
  payload: {index}
})

export const uminimizeUpdateIndex = (viewid) => ({
  type: UNMINIMIZE_UPDATE_INDEX,
  payload: {viewid}
})

export const hideWindowId = (viewid) => ({
  type: HIDE_WINDOW_ID,
  payload: {viewid}
})






import {SHOW_WINDOW, CREATE_WINDOW, HIDE_WINDOW, TOGGLE_SETTINGS, UPDATE_INDEX } from "./actionTypes";


export const hideWindow = id => ({
  type: HIDE_WINDOW,
  payload: {id}
})

export const showWindow = id => ({
  type: SHOW_WINDOW,
  payload: {id}
})

export const createWindow = (id, title, width, height, url, showing) => ({
  type: CREATE_WINDOW,
  payload: {id, title, width, height, url, showing}
})


export const toggleShowing = (showing) => ({
  type: TOGGLE_SETTINGS,
  payload: {showing}
})


export const updateIndex = (id) => ({
  type: UPDATE_INDEX,
  payload: {id}
})




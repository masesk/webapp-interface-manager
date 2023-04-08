// any offset needed for the height will be added on top of the height value
export const WINDOW_HEIGHT_MAXIMIZED_OFFSET = 0

// height of the footer (where the tabs are shown) 
export const FOOTER_HEIGHT = 40

// height of the header, where the apps, layout, etc buttons are shown
export const HEADER_HEIGHT = 35

// height of the bar above each window containing close, maximize, minimize, etc buttons
export const WINDOW_TOPBAR_HEIGHT = 30

// style to be applied when a window is maximized
export const MAXIMIZED_STYLE = {
    transform: "none",
    top: HEADER_HEIGHT,
    width: "100%",
    height: `calc(100% - ${FOOTER_HEIGHT})`,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0
}

export const HEADER_BUTTON_SIZE = 13
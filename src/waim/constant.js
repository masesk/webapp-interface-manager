export const WINDOW_HEIGHT_MAXIMIZED_OFFSET = 0
export const FOOTER_HEIGHT = 40
export const HEADER_HEIGHT = 35
export const WINDOW_TOPBAR_HEIGHT = 30
export const MAXIMIZED_STYLE = {
    transform: "none",
    top: HEADER_HEIGHT,
    width: "100%",
    height: `calc(100% - ${FOOTER_HEIGHT})`,
    paddingBottom: 0,
    paddingTop: 0,
    paddingLeft: 0
}
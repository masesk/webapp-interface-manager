
import React, {useState } from 'react'
import LayoutSelector from './LayoutSelector';
import * as R from 'ramda'
import PaneFrame from './PaneFrame';
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { changeLayoutSizes, selectWindows } from './redux/reducers/windowsSlice';

interface SplitLayoutProps {
    layoutType: string,
    indexPath: number[],
}

const SplitLayout = ({layoutType, indexPath } : SplitLayoutProps) => {
    const dispatch = useAppDispatch()
    const windows = useAppSelector(selectWindows)

    const [allowPointerEvents, setAllowPointerEvents] = useState(true)
    const Render1 = R.path(["appDoms", R.path(["layout", ...indexPath, 0, "appid"], windows) as string], windows)
    const Render2 = R.path(["appDoms", R.path(["layout", ...indexPath, 1, "appid"], windows) as string], windows)
    const paneStyle = { pointerEvents: "auto", height: "100%" } as React.CSSProperties
    
    return (
        <div id="paneParent" style={{ width: "100%", height: "100%" }}>

            <Allotment
                vertical={layoutType === "HORIZONTAL_LAYOUT"}
                onDragStart={() => { setAllowPointerEvents(false) }}
                onDragEnd={(sizes: number[]) => { dispatch(changeLayoutSizes({indexPath, sizes: [sizes[0] ,sizes[1]]})); setAllowPointerEvents(true) }}
                defaultSizes={R.pathOr(undefined, ["layout", ...indexPath, "sizes"], windows)}
            >
                <Allotment.Pane>
                    {R.path(["layout", ...indexPath, 0, "type"], windows) !== "SELECTED_APP" ? <LayoutSelector indexPath={R.append(0, indexPath)} /> : R.isNil(Render1) ?

                        <PaneFrame allowPointerEvents={allowPointerEvents} key={"frame12col"} url={R.path(["apps", R.path(["layout", ...indexPath, 0, "appid"], windows) as string, "url"], windows) as string} title={R.path(["apps", R.path(["layout", ...indexPath, 0], windows) as string, "title"], windows)} />
                        : <div style={allowPointerEvents ? paneStyle : R.assoc("pointerEvents", "none", paneStyle)}>{Render1}</div>

                    }

                </Allotment.Pane>
                <Allotment.Pane>

                    {R.path(["layout", ...indexPath, 1, "type"], windows) !== "SELECTED_APP"  ? <LayoutSelector indexPath={R.append(1, indexPath)} /> : R.isNil(Render2) ?

                        <PaneFrame allowPointerEvents={allowPointerEvents} key={"frame22col"} url={R.path(["apps", R.path(["layout", ...indexPath, 1, "appid"], windows) as string, "url"], windows) as string} title={R.path(["apps", R.path(["layout", ...indexPath, 1], windows) as string, "title"], windows)} />
                        : <div style={allowPointerEvents ? paneStyle : R.assoc("pointerEvents", "none", paneStyle)}>{Render2}</div>

                    }
                </Allotment.Pane>

            </Allotment>
            {/* {
                R.propEq("layoutEditEnabled", true, windows) &&
                <>
                    <Box sx={{ position: "absolute", left: layoutType===VERTICAL_LAYOUT ? determinePanelValues(VERTICAL_LAYOUT, true) : "calc(50% - 20px)", top: layoutType===HORIZONTAL_LAYOUT ? determinePanelValues(HORIZONTAL_LAYOUT) : "calc(50% - 20px)" }}>
                            <IconButton sx={{ bgcolor: "background.paper" }} variant="contained">
                                <DeleteIcon />
                            </IconButton>
                    </Box>
                    

                </>
            } */}
        </div>
    )
}


export default SplitLayout;
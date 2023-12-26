
import React, { useEffect, useRef, useState } from 'react'
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
    const Render1 = R.path(["appDoms", R.path(["layout", ...indexPath, 0, "appid"], windows)], windows)
    const Render2 = R.path(["appDoms", R.path(["layout", ...indexPath, 1, "appid"], windows)], windows)
    const paneStyle = { pointerEvents: "auto", height: "100%" }
    //const [allotmentValues, setAllotmentValues] = React.useState([])



    useEffect(()=> {
        console.log(indexPath)
    }, [])

    const determinePanelValues = (layoutType) => {
        let offset = 0
        if (layoutType === "HORIZONTAL_LAYOUT") {
            offset -= 25
        }
        else if (layoutType === "VERTICAL_LAYOUT") {
            offset -= 22
        }
        if (R.isEmpty(allotmentValues)) {
            if(layoutType === "VERTICAL_LAYOUT") return "calc(50% - 20px)"
            else if(layoutType === "HORIZONTAL_LAYOUT") return "calc(50% - 20px)"
        }
        else {
            return `${allotmentValues[0] + offset}px`
        }
    }

    return (
        <div id="paneParent" style={{ width: "100%", height: "100%" }}>

            <Allotment
                vertical={layoutType === "HORIZONTAL_LAYOUT"}
                onDragStart={() => { setAllowPointerEvents(false) }}
                onDragEnd={(sizes) => { dispatch(changeLayoutSizes({indexPath, sizes})); setAllowPointerEvents(true) }}
                defaultSizes={R.pathOr(undefined, ["layout", ...indexPath, "sizes"], windows)}
            >
                <Allotment.Pane>
                    {!R.pathEq(["layout", ...indexPath, 0, "type"], "SELECTED_APP", windows) ? <LayoutSelector indexPath={R.append(0, indexPath)} /> : R.isNil(Render1) ?

                        <PaneFrame allowPointerEvents={allowPointerEvents} key={"frame12col"} url={R.path(["apps", R.path(["layout", ...indexPath, 0, "appid"], windows), "url"], windows)} title={R.path(["apps", R.path(["layout", ...indexPath, 0], windows), "title"], windows)} />
                        : <div style={allowPointerEvents ? paneStyle : R.assoc("pointerEvents", "none", paneStyle)}>{Render1}</div>

                    }

                </Allotment.Pane>
                <Allotment.Pane size="20">

                    {!R.pathEq(["layout", ...indexPath, 1, "type"], "SELECTED_APP", windows) ? <LayoutSelector indexPath={R.append(1, indexPath)} /> : R.isNil(Render2) ?

                        <PaneFrame allowPointerEvents={allowPointerEvents} key={"frame22col"} url={R.path(["apps", R.path(["layout", ...indexPath, 1, "appid"], windows), "url"], windows)} title={R.path(["apps", R.path(["layout", ...indexPath, 1], windows), "title"], windows)} />
                        : <div height="100%" style={allowPointerEvents ? paneStyle : R.assoc("pointerEvents", "none", paneStyle)}>{Render2}</div>

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

import React, { useState } from 'react'
import LayoutSelector from './LayoutSelector';
import { connect } from 'react-redux'
import { changeLayoutSize2ColVertical } from '../redux/actions'
import * as R from 'ramda'
import PaneFrame from './PaneFrame';
import { Allotment } from "allotment";
import "allotment/dist/style.css";


const TwoColumnLayout = ({ windows, changeLayoutSize2ColVertical }) => {
    const [allowPointerEvents, setAllowPointerEvents] = useState(true)
    const Render1 = R.path(["appDoms", R.path(["layout", "selectedApps", 0], windows)], windows)
    const Render2 = R.path(["appDoms", R.path(["layout", "selectedApps", 1], windows)], windows)
    const paneStyle = {pointerEvents: "auto", height: "100%" }
    const ref = React.useRef();
    return (
        <div id="paneParent" style={{ width: "100%", height: "calc(100vh - 100px)" }}>
            <Allotment
                snap
                ref={ref}
                vertical={false}
                minSize={"20%"}
                paneStyle={{ zIndex: 0 }}
                onChange={(e)=> {console.log(e)}}
                defaultSize={R.path(["layout", "2ColSizeVertcial"], windows)}
                onDragStarted={() => { setAllowPointerEvents(false) }}
                onDragFinished={(size) => { console.log("S", size) }}
            >
                <Allotment.Pane>
                    {!R.has(0, R.path(["layout", "selectedApps"], windows)) ? <LayoutSelector oIndex={0} /> : R.isNil(Render1) ?

                        <PaneFrame allowPointerEvents={allowPointerEvents} key={"frame12col"} url={R.path(["apps", R.path(["layout", "selectedApps", 0], windows), "url"], windows)} title={R.path(["apps", R.path(["layout", "selectedApps", 0], windows), "title"], windows)} />
                        : <div style={allowPointerEvents ? paneStyle : R.assoc("pointerEvents", "none", paneStyle)}>{Render1}</div>

                    }
                </Allotment.Pane>
                <Allotment.Pane size="20">

                    {!R.has(1, R.path(["layout", "selectedApps"], windows)) ? <LayoutSelector oIndex={1} /> : R.isNil(Render2) ?

                        <PaneFrame allowPointerEvents={allowPointerEvents} key={"frame22col"} url={R.path(["apps", R.path(["layout", "selectedApps", 1], windows), "url"], windows)} title={R.path(["apps", R.path(["layout", "selectedApps", 1], windows), "title"], windows)} />
                        : <div height="100%" style={allowPointerEvents ? paneStyle : R.assoc("pointerEvents", "none", paneStyle)}>{Render2}</div>

                    }
                </Allotment.Pane>

            </Allotment>
        </div>
    )
}

const mapStateToProps = state => {
    return state
};

export default connect(mapStateToProps, { changeLayoutSize2ColVertical })(TwoColumnLayout);
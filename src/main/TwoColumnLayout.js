
import React, {useEffect, useState} from 'react'
import SplitPane from 'react-split-pane'
import LayoutSelector from './LayoutSelector';
import { connect } from 'react-redux'
import { changeLayoutSize2ColVertical } from '../redux/actions'
import * as R from 'ramda'
import PaneFrame from './PaneFrame';


const TwoColumnLayout = ({ windows, changeLayoutSize2ColVertical }) => {
    const [allowPointerEvents, setAllowPointerEvents] = useState(true)
    const Render1 =  R.path(["appDoms", R.path(["layout", "selectedApps", 0], windows)], windows)
    const Render2 =  R.path(["appDoms", R.path(["layout", "selectedApps", 1], windows)], windows)
    return (
        <SplitPane
            split="vertical"
            minSize={"20%"}
            paneStyle={{ zIndex: 0 }}
            defaultSize={R.path(["layout", "2ColSizeVertcial"], windows)}
            onDragStarted={()=> {setAllowPointerEvents(false)}}
            onDragFinished={(size) => {changeLayoutSize2ColVertical(size); setAllowPointerEvents(true)}}
        >
            {!R.has(0, R.path(["layout", "selectedApps"], windows)) ? <LayoutSelector oIndex={0} /> : R.isNil(Render1) ?

                <PaneFrame allowPointerEvents={allowPointerEvents} key={"frame12col"} url={R.path(["apps", R.path(["layout", "selectedApps", 0], windows), "url"], windows)} title={R.path(["apps", R.path(["layout", "selectedApps", 0], windows), "title"], windows)} />
                : <div style={allowPointerEvents ? {pointerEvents: "auto"} : {pointerEvents: "none"}}>{Render1}</div>}
                


            {!R.has(1, R.path(["layout", "selectedApps"], windows)) ? <LayoutSelector oIndex={1} /> : R.isNil(Render2) ?

                <PaneFrame allowPointerEvents={allowPointerEvents} key={"frame22col"}  url={R.path(["apps", R.path(["layout", "selectedApps", 1], windows), "url"], windows)} title={R.path(["apps", R.path(["layout", "selectedApps", 1], windows), "title"], windows)} />
                : <div style={allowPointerEvents ? {pointerEvents: "auto"} : {pointerEvents: "none"}}>{Render2}</div>}

        </SplitPane>
    )
}

const mapStateToProps = state => {
    return state
};

export default connect(mapStateToProps, { changeLayoutSize2ColVertical })(TwoColumnLayout);
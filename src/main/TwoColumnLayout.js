
import React, {useEffect} from 'react'
import SplitPane from 'react-split-pane'
import LayoutSelector from './LayoutSelector';
import {connect} from 'react-redux'
import * as R from 'ramda'
const TwoColumnLayout = (layout) => {
    useEffect(()=> {
        console.log(layout)
    }, [layout])
    return (
        <SplitPane
            split="vertical"
            minSize={"20%"}
            defaultSize={localStorage.getItem('verSplitPos') != null ? parseInt(localStorage.getItem('verSplitPos'), 10) : "20%"}
            onDragFinished={(size) => localStorage.setItem('verSplitPos', size)}
        >
        {!R.prop("0", layout.selectedLayout) && <LayoutSelector index="0"/>}
        {!R.prop("1", layout.selectedLayout) && <LayoutSelector index="1"/>}
        </SplitPane>
    )
}

const mapStateToProps = state => {
    return state
  };
  
  export default connect(mapStateToProps, { })(TwoColumnLayout);
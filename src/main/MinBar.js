import React from 'react'
import { connect } from 'react-redux'
import { uminimizeUpdateIndex, hideWindow, updateIndex, hideWindowId, unminimizeWindow } from '../redux/actions'
import * as R from 'ramda'
import {AiOutlineCloseCircle} from 'react-icons/ai'



const MinBar = ({ children, index, uminimizeUpdateIndex,hideWindowId, unminimizeWindow, className, hideWindow }) => {

    return (
        <div className={"noselect min-bar " + className} onClick={()=> {uminimizeUpdateIndex(index) }}>
            <div className="min-bar-close"> <AiOutlineCloseCircle onClick={e=>{hideWindowId(index); e.stopPropagation();}} size={20}/></div>
            <div className="min-bar-title">{children}</div>
        </div>

    )

}

const mapStateToProps = state => {
    const windows = R.prop("windows", state)
    if(R.isNil(windows)){
        return
    }
    const win_array = R.compose(
        R.values,
        R.map((item) => {return item})
       )(windows)
    
    return R.assocPath(["windows", "apps"], win_array, state)
};

export default connect(
    mapStateToProps,
    { unminimizeWindow, hideWindowId, uminimizeUpdateIndex, hideWindow, updateIndex }
)(MinBar)
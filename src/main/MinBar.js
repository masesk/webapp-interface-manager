import React from 'react'
import { connect } from 'react-redux'
import { showWindow } from '../redux/actions'
import * as R from 'ramda'



const MinBar = ({ children, id, showWindow, className }) => {

    return (
        <div className={"noselect min-bar " + className} onClick={()=> showWindow(id)}>
            {children}
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
    
    return R.assoc("windows", win_array, state)
};

export default connect(
    mapStateToProps,
    { showWindow }
)(MinBar)
import React from 'react'
import { connect } from 'react-redux'
import { uminimizeUpdateIndex, hideWindow, updateIndex, hideWindowId, unminimizeWindow } from '../redux/actions'
import * as R from 'ramda'
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Tab } from '@mui/material'
import { Box } from '@mui/material'



const MinBar = ({ children, index, uminimizeUpdateIndex, hideWindowId, unminimizeWindow, className, hideWindow }) => {

    return (
        <Tab onClick={()=> {uminimizeUpdateIndex(index)}} sx={{padding: 0, bgcolor: "background.paper", marginRight: "10px", mr: 1, ml: 1, borderTopRightRadius: "25px", borderTopLeftRadius: "25px"}} label={
            <span style={{display:"flex", minWidth: "150px", justifyContent: "space-between", alignItems: "center"}}>
                <IconButton component="span" onClick={e => { hideWindowId(index); e.stopPropagation(); }}>
                <CloseIcon  size={20} />
                </IconButton>
                <Box sx={{pr: 1, textOverflow: "ellipsis", width: "inherit"}}><p style={{textAlign: "right", width: "150px", whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden"}}>{children}</p></Box>
            </span>
        }/>

    )

}

const mapStateToProps = state => {
    const windows = R.prop("windows", state)
    if (R.isNil(windows)) {
        return
    }
    const win_array = R.compose(
        R.values,
        R.map((item) => { return item })
    )(windows)

    return R.assocPath(["windows", "apps"], win_array, state)
};

export default connect(
    mapStateToProps,
    { unminimizeWindow, hideWindowId, uminimizeUpdateIndex, hideWindow, updateIndex }
)(MinBar)
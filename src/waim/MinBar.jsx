import React from 'react'
import { connect } from 'react-redux'
import { uminimizeUpdateIndex, hideWindow, updateIndex, hideWindowId, unminimizeWindow } from '../redux/actions'
import * as R from 'ramda'
import CloseIcon from '@mui/icons-material/Close';
import { IconButton, Tab, Box } from '@mui/material'
import { styled } from '@mui/material/styles';
import { FOOTER_HEIGHT } from './constant';


const MinBar = ({ children, index, uminimizeUpdateIndex, hideWindowId, unminimizeWindow, minimized, hideWindow }) => {


    const AntTab = styled((props) => <Tab disableRipple {...props} />)(({ theme }) => ({

        height: FOOTER_HEIGHT,
        display: "flex",
        justifyContent: "baseline"
    }))
    return (
        <AntTab onClick={() => { uminimizeUpdateIndex(index) }} sx={{
            paddingInline: 0, mt: 0, padding: 0, bgcolor: !minimized ? "background.paper" : "primary.main", color: !minimized ? "background.paper.contrastText" : "primary.contrastText",
            mr: 1, ml: 1, borderTopRightRadius: "25px", borderTopLeftRadius: "25px"
        }}
            label={
                <span style={{ display: "flex", minWidth: "150px", justifyContent: "space-between", alignItems: "baseline" }}>
                    <Box>
                    <IconButton component="span" onClick={e => { hideWindowId(index); e.stopPropagation(); }}>
                        <CloseIcon size={20} sx={{ color: !minimized ? "background.paper.contrastText" : "primary.contrastText" }} />
                    </IconButton>
                    </Box>
                    <Box sx={{ pr: 1, textOverflow: "ellipsis", width: "inherit" }}>{children}</Box>
                </span>
            } />

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
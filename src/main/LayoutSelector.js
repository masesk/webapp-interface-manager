import React, {useState} from 'react'
import { connect } from 'react-redux'
import { selectLayoutApp } from "../redux/actions"
import { Select, OutlinedInput, Typography, Box, Button, MenuItem } from '@mui/material'
import * as R from 'ramda'

const LayoutSelector = ({windows, selectLayoutApp, oIndex}) => {
    const [selectedApp, setSelectedApp] = useState("")
    return (
        <>
            <Box sx={{ p: 2 }}><Typography variant="overline">SELECT APP</Typography></Box>
            <Box sx={{p : 2, maxWidth: "300px", textAlign: "center"}}>
                <Select
                    fullWidth
                    value={R.pathEq(["apps", selectedApp, "single"], true, windows) && ( R.find(R.propEq("appid", selectedApp))(windows.view) || R.includes(selectedApp, R.values(R.path(["layout", "selectedApps"], windows)))) ? "" : selectedApp}
                    input={<OutlinedInput />}
                >
                    {
                        R.compose(
                            
                            R.map(([key, windowKey]) => { 
                                if(R.pathEq(["apps", windowKey, "single"], true, windows) && ( R.find(R.propEq("appid", windowKey))(windows.view) || R.includes(windowKey, R.values(R.path(["layout", "selectedApps"], windows))))){
                                    return <div key={key}></div>
                                }
                                return <MenuItem value={windowKey} onClick={()=> setSelectedApp(windowKey)} key={key}>{R.prop("title", R.prop(windowKey, windows.apps))}</MenuItem>

                            }),
                            R.toPairs,
                        )(R.keys(windows.apps))
                    }
\

                </Select>
               
                <Box sx={{m: 2}} style={{textAlign: "center"}}>
                <Button onClick={() => {
                    if(R.isEmpty(selectedApp)){
                        return
                    }
                    selectLayoutApp(selectedApp, oIndex)
                }} variant="contained">Select</Button>
                </Box>
            </Box>
        </>
    )
}

const mapStateToProps = state => {
    return state
};

export default connect(mapStateToProps, { selectLayoutApp })(LayoutSelector);

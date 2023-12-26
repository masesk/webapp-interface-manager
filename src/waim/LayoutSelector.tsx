import React, { useEffect, useRef, useState } from 'react'
import { Select, OutlinedInput, Typography, Box, Button, MenuItem, Tooltip } from '@mui/material'
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import * as R from 'ramda'
import { HORIZONTAL_LAYOUT, SELECTED_APP, VERTICAL_LAYOUT } from './redux/constants';
import SplitLayout from './SplitLayout';
import UndefinedAppImage from "../img/unknown.png"
import { addLayout, selectLayoutApp, selectWindows } from './redux/reducers/windowsSlice';
import { useAppDispatch, useAppSelector } from './redux/hooks';


interface LayoutSelectorProps {
    indexPath: number[],
}

const LayoutSelector = ({indexPath} : LayoutSelectorProps) => {
    const [selectedApp, setSelectedApp] = useState("")
    const [selectOpen, setSelectOpen] = useState(false)
    const selectRef = useRef()
    const dispatch = useAppDispatch()
    const windows = useAppSelector(selectWindows)
    React.useEffect(() => {
        setSelectedApp("")
    }, [windows.openApps])

    useEffect(()=> {
        console.log("Index Path: ", indexPath)
    }, [])

    return (
        <>
            {
                R.path(["layout", ...indexPath, "type"], windows) !== undefined && !R.pathEq("SELETEC_APP", ["layout", ...indexPath, "type"], windows) ?
                    <>
                        <SplitLayout layoutType={R.path(["layout", ...indexPath, "type"], windows)} indexPath={indexPath} />
                    </> :
                    <Box sx={{ display: "flex", alignItems: "center", flex: 1, flexDirection: "column", height: "100%", overflowY: "auto" }}>

                        <Box sx={{ p: 2, maxWidth: "300px", textAlign: "center", width: "100%", alignItems: "center", flex: 1, flexDirection: "column", height: "100%" }}>
                            <Box sx={{ pt: 5, pb: 1, textAlign: "left" }}><Typography variant="overline">SELECT APP</Typography></Box>
                            <Select
                                fullWidth
                                inputRef={selectRef}
                                value={selectedApp}
                                open={selectOpen}
                                onClose={() => { setSelectOpen(false) }}
                                onOpen={() => { setSelectOpen(true) }}
                                onChange={() => { }}
                                input={<OutlinedInput />}
                            >
                                {
                                    R.compose(

                                        R.map(([key, windowKey]) => {

                                            return (
                                                <Tooltip value={windowKey} key={`${windowKey}tooltip_layout`} followCursor title={R.pathEq(["apps", windowKey, "single"], true, windows) && (R.gt(R.pathOr(0, ["openApps", windowKey], windows), 0)) ? "Only one instance of app can be opened" : ""}>
                                                    <span key={`${key}_layout_span`}>
                                                        <MenuItem disabled={R.pathEq(["apps", windowKey, "single"], true, windows) && R.gt(R.path(["openApps", windowKey], windows), 0)} value={windowKey} onClick={() => { setSelectedApp(windowKey); setSelectOpen(false) }} key={`${key}_layout`}>
                                                            <Box sx={{ display: "flex", flexDirection: "row", flex: 1, alignItems: "center" }}>
                                                                <Box sx={{ borderRadius: 2, border: "2px solid #9a9a9a", w: 1, h: 1, mr: 1, display: "flex", flex: "column" }}>
                                                                    <img onError={(e) => (e.target.src = UndefinedAppImage)} style={{ width: "20px", height: "20px", borderRadius: 2 }} src={R.pathOr(UndefinedAppImage, ["apps", windowKey, "imageUrl"], windows)} />
                                                                </Box>
                                                                {R.prop("title", R.prop(windowKey, windows.apps))}
                                                            </Box>
                                                        </MenuItem>
                                                    </span>
                                                </Tooltip>
                                            )
                                        }),
                                        R.toPairs,
                                    )(R.keys(windows.apps))
                                }


                            </Select>

                            <Box sx={{ m: 2 }} style={{ textAlign: "center" }}>
                                <Button onClick={() => {
                                    if (R.isEmpty(selectedApp)) {
                                        return
                                    }
                                    dispatch(selectLayoutApp({appid: selectedApp, indexPath}))
                                }} variant="contained">Select</Button>
                            </Box>
                            <Typography variant="h4" sx={{ m: 1 }}>OR</Typography>
                            <Box style={{ textAlign: "center" }}>
                                <Button fullWidth startIcon={<VerticalSplitIcon />} sx={{ m: 1 }} onClick={() => {
                                    dispatch(addLayout({indexPath, layoutType: "VERTICAL_LAYOUT"}))
                                }} variant="contained">Add Vertical Layout</Button>
                                <Button fullWidth startIcon={<HorizontalSplitIcon />} sx={{ m: 1 }} onClick={() => {
                                    dispatch(addLayout({indexPath, layoutType: "HORIZONTAL_LAYOUT"}))
                                }} variant="contained">Add Horizontal Layout</Button>
                            </Box>
                        </Box>
                    </Box>
            }
        </>
    )
}


export default LayoutSelector;

import React, { useEffect, useRef, useState } from 'react'
import { Select, OutlinedInput, Typography, Box, Button, MenuItem, Tooltip, TooltipProps } from '@mui/material'
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import * as R from 'ramda'
import SplitLayout from './SplitLayout';
import UndefinedAppImage from "../img/unknown.png"
import { LayoutType, addLayout, selectLayoutApp, selectWindows } from './redux/reducers/windowsSlice';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { styled } from '@mui/material/styles';

interface LayoutSelectorProps {
    indexPath: number[],
}

interface WaimTooltipProps extends TooltipProps {
    title: string,
    value: any,
    followCursor: boolean

} 

const WaimToolTip = styled((props: WaimTooltipProps) => <Tooltip {...props} />)(
    () => ({
    }),
  );

const LayoutSelector = ({indexPath} : LayoutSelectorProps) => {
    const [selectedApp, setSelectedApp] = useState("")
    const [selectOpen, setSelectOpen] = useState(false)
    const selectRef = useRef()
    const dispatch = useAppDispatch()
    const windows = useAppSelector(selectWindows)
    React.useEffect(() => {
        setSelectedApp("")
    }, [windows.openApps])

    return (
        <>
            {
                R.path(["layout", ...indexPath, "type"], windows) !== undefined && R.path(["layout", ...indexPath, "type"], windows) !== "SELECTED_APP" ?
                    <>
                        <SplitLayout layoutType={R.path(["layout", ...indexPath, "type"], windows) as LayoutType} indexPath={indexPath} />
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
                                            const canOpen: boolean = R.path(["apps", windowKey, "single"], windows) === true && R.gt(R.path(["openApps", windowKey], windows), 0)
                                            return (
                                                <WaimToolTip value={windowKey} key={`${windowKey}tooltip_layout`} followCursor title={canOpen ? "Only one instance of app can be opened" : ""}>
                                                    <span key={`${key}_layout_span`}>
                                                        <MenuItem disabled={canOpen} value={windowKey} onClick={() => { setSelectedApp(windowKey); setSelectOpen(false) }} key={`${key}_layout`}>
                                                            <Box sx={{ display: "flex", flexDirection: "row", flex: 1, alignItems: "center" }}>
                                                                <Box sx={{ borderRadius: 2, border: "2px solid #9a9a9a", w: 1, h: 1, mr: 1, display: "flex", flex: "column" }}>
                                                                    <img onError={(e: any) => (e.target.src = UndefinedAppImage)} style={{ width: "20px", height: "20px", borderRadius: 2 }} src={R.pathOr(UndefinedAppImage, ["apps", windowKey, "imageUrl"], windows)} />
                                                                </Box>
                                                                {R.path([windowKey, "title"], windows.apps)}
                                                            </Box>
                                                        </MenuItem>
                                                    </span>
                                                </WaimToolTip>
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

import React from 'react'
import * as R from 'ramda'

// import { showWindow, toggleShowing, selectLayout, removeAllLayout, addInitialLayout, toggleLayoutEdit } from './redux/actions'
import { InputAdornment, Box, Button, ButtonGroup, Tooltip, IconButton, FormControl, OutlinedInput } from '@mui/material';
import SettingsIcon from '@mui/icons-material/Settings';
import SearchIcon from '@mui/icons-material/Search';

import MenuItem from '@mui/material/MenuItem';

import HelpIcon from '@mui/icons-material/Help';
import Menu from '@mui/material/Menu';
import AppsIcon from '@mui/icons-material/Apps';
import AutoAwesomeMosaicIcon from '@mui/icons-material/AutoAwesomeMosaic';
import VerticalSplitIcon from '@mui/icons-material/VerticalSplit';
import HorizontalSplitIcon from '@mui/icons-material/HorizontalSplit';
import DeleteIcon from '@mui/icons-material/Delete';
// import StopCircleIcon from '@mui/icons-material/StopCircle';
// import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import UndefinedAppImage from "../img/unknown.png"
import { HEADER_BUTTON_SIZE, HEADER_HEIGHT } from './constant';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { LayoutType, addLayoutInitial, createWindow, removeAllLayout, selectWindows } from './redux/reducers/windowsSlice';
import { toggleSettings } from './redux/reducers/settingsSlice';


const Header = () => {
  const windows = useAppSelector(selectWindows)
  const dispatch = useAppDispatch()

  // app anchor for apps dropdown
  const [appsAnchor, setAppsAnchor] = React.useState<HTMLButtonElement | null>(null);

  // layout anchor
  const [layoutAnchor, setLayoutAnchor] = React.useState(null);

  // search strign for searching for a specific app from the apps dropdown
  const [searchString, setSearchString] = React.useState("")

  // list of all default layouts, their type, and icon

  interface LayoutStruct {
    title: string,
    type: LayoutType,
    icon: JSX.Element
  }

  const layouts: LayoutStruct[] = [
    {
      title: "Vertical Split",
      type: "VERTICAL_LAYOUT",
      icon: <VerticalSplitIcon />
    },
    {
      title: "Horizontal Split",
      type: "HORIZONTAL_LAYOUT",
      icon: <HorizontalSplitIcon />
    }
  ]

  return (


    <Box className="header noselect" sx={{ bgcolor: 'background.paper', color: 'text.primary', justifyContent: 'space-between', height: HEADER_HEIGHT }}>
      <Box sx={{ width: "250px", textAlign: "start" }}>





        <ButtonGroup size="small" color="primary" sx={{
          ".MuiButtonGroup-grouped": {
            border: "none"
          },
          ".MuiButtonGroup-grouped: hover": {
            border: "none"
          },
        }}>
          <Button
            size="small"
            id="basic-button"
            sx={{ fontSize: HEADER_BUTTON_SIZE }}
            startIcon={<AppsIcon />}
            aria-controls={appsAnchor ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={appsAnchor ? 'true' : undefined}
            onClick={(event) => { setAppsAnchor(event.currentTarget) }}
          >
            APPS
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={appsAnchor}
            open={Boolean(appsAnchor)}
            onClose={() => { setAppsAnchor(null) }}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {/* Search bar for searching a specific app by its name */}
            <FormControl sx={{ mt: 2, mb: 2, pl: 3, pr: 3 }}>
              <OutlinedInput
                autoFocus={false}
                size="small"
                onChange={(e) => setSearchString(e.target.value)}
                value={searchString}
                placeholder="Search with App Name..."
                startAdornment={(
                  <InputAdornment sx={{ padding: 0 }} position="start">
                    <SearchIcon />
                  </InputAdornment>
                )}
                endAdornment={(
                  <IconButton sx={{ padding: 0 }} onClick={() => { setSearchString("") }}>
                    <CloseIcon />
                  </IconButton>
                )}


              />
            </FormControl>
            {
              // loops each app saved and create a menu entry for it
              R.compose(
                R.map(([key, windowKey]) => {
                  if (R.isNil(searchString)) return

                  // check first if the app name is included in the search
                  if (!R.isEmpty(searchString) && windows.apps[windowKey].title.toLowerCase().includes(searchString.toLowerCase())) {
                    return
                  }
                  return (
                    <Box sx={{ pl: 1, pr: 1 }} key={key}>

                      <Tooltip key={`${windowKey}tooltip`} followCursor title={R.path(["apps", windowKey, "single"], windows) && (R.gt(R.pathOr(0, ["openApps", windowKey], windows), 0)) ? "Only one instance of app can be opened" : ""}>
                        <span key={`${windowKey}span`} style={{ display: "block" }}>

                          <MenuItem key={`${windowKey}menuitem`} disabled={R.pathOr(false, ["apps", windowKey, "single"], windows) && (R.gt(R.pathOr(0, ["openApps", windowKey], windows), 0))} onClick={() => { dispatch(createWindow(windowKey)); setAppsAnchor(null); }}>

                            <Box sx={{ display: "flex", flexDirection: "row", flex: 1, alignItems: "center" }}>
                              <Box sx={{ borderRadius: 3, border: "2px solid #9a9a9a", w: 1, h: 1, mr: 1, display: "flex", flex: "column" }}>
                                <img onError={(e: any) => (e.target.src = UndefinedAppImage)} style={{ width: "50px", height: "50px", borderRadius: 10 }} src={R.pathOr(UndefinedAppImage, ["apps", windowKey, "imageUrl"], windows)} />
                              </Box>
                              {windows.apps[windowKey].title}
                            </Box>

                          </MenuItem>

                        </span>
                      </Tooltip>
                    </Box>
                  )
                }),
                R.toPairs,
              )(R.keys(windows.apps))
            }
          </Menu>


          <Menu
            id="basic-menu"
            anchorEl={layoutAnchor}
            open={Boolean(layoutAnchor)}
            onClose={() => { setLayoutAnchor(null) }}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {
              // loop each layout type and create a menu entry for it
              // disable it if the layout is in edit mode
              R.compose(
                R.map((layout: LayoutStruct) => {
                  return <MenuItem disabled={R.equals(R.prop("layoutEditEnabled", windows), true) || R.hasPath(["layout", "type"], windows)} key={`${layout.type}menuitem`} onClick={() => { dispatch(addLayoutInitial(layout.type)); setLayoutAnchor(null); }}>{layout.icon} {layout.title}</MenuItem>

                })

              )(layouts)
            }
            <MenuItem disabled={!R.hasPath(["layout", "type"], windows) || R.equals(R.prop("layoutEditEnabled", windows), true)} key={"removeLayout"} onClick={() => { dispatch(removeAllLayout()); setLayoutAnchor(null); }}><DeleteIcon />Remove All Layout</MenuItem>
            {/* <MenuItem disabled={!R.hasPath(["layout", "type"], windows)} key={"editLayout"} onClick={() => { toggleLayoutEdit(); setLayoutAnchor(null); }}>
              {R.equals(R.prop("layoutEditEnabled", windows), true) ? <><StopCircleIcon /> Stop Editing </> : <><EditIcon /> Edit Layouts</>}
            </MenuItem> */}
          </Menu>


          <Button
            size="small"
            id="basic-button"
            sx={{ fontSize: HEADER_BUTTON_SIZE }}
            startIcon={<AutoAwesomeMosaicIcon />}
            aria-controls={layoutAnchor ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={layoutAnchor ? 'true' : undefined}
            onClick={(event: any) => { setLayoutAnchor(event.currentTarget) }}
          >
            Layout
          </Button>

        </ButtonGroup>


      </Box>
      <Box sx={{ width: "250px", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <svg width="50.62" height="14.8" viewBox="0 0 53 17" xmlns="http://www.w3.org/2000/svg"><g id="svgGroup" strokeLinecap="round" fillRule="evenodd" font-size="9pt" stroke="currentColor" strokeWidth="0.5mm" fill="currentColor" style={{stroke:"currentColor", strokeWidth:"0.5mm;", fill:"currentColor"}}><path fill="currentColor" d="M 5.27 14.8 L 4.33 14.8 L 0 0 L 0.73 0 L 4.89 14.4 L 4.73 14.4 L 8.95 0 L 9.89 0 L 14.12 14.4 L 13.96 14.4 L 18.13 0 L 18.82 0 L 14.5 14.8 L 13.56 14.8 L 9.33 0.48 L 9.5 0.48 L 5.27 14.8 Z" id="0" vector-effect="non-scaling-stroke"/><path d="M 19.4 14.8 L 18.67 14.8 L 24.3 0 L 25.16 0 L 30.79 14.8 L 30.04 14.8 L 24.6 0.4 L 24.84 0.4 L 19.4 14.8 Z M 28.32 9.52 L 21.14 9.52 L 21.34 8.86 L 28.12 8.86 L 28.32 9.52 Z" id="1" vector-effect="non-scaling-stroke"/><path d="M 33.74 14.8 L 33.06 14.8 L 33.06 0 L 33.74 0 L 33.74 14.8 Z" id="2" vector-effect="non-scaling-stroke"/><path d="M 38.24 14.8 L 37.58 14.8 L 37.58 0 L 38.33 0 L 44.28 12.48 L 43.96 12.48 L 49.87 0 L 50.62 0 L 50.62 14.8 L 49.96 14.8 L 49.96 0.58 L 50.32 0.58 L 44.48 12.8 L 43.72 12.8 L 37.86 0.58 L 38.24 0.58 L 38.24 14.8 Z" id="3" vectorEffect="non-scaling-stroke"/></g></svg>
      </Box>

      <Box sx={{ width: "250px", textAlign: "end" }}>

        <ButtonGroup size="small" sx={{
          ".MuiButtonGroup-grouped": {
            border: "none"
          },
          ".MuiButtonGroup-grouped:hover": {
            border: "none"
          },
        }}>
          <Button sx={{ fontSize: HEADER_BUTTON_SIZE }} onClick={() => dispatch(toggleSettings(true))} startIcon={<SettingsIcon />} size="small">Settings</Button>
          <Button sx={{ fontSize: HEADER_BUTTON_SIZE }} startIcon={<HelpIcon />} size="small">Help</Button>

        </ButtonGroup>
      </Box>
    </Box>

  )

}


export default Header;
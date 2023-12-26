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
//import { ReactComponent as WAIMLogo } from '../img/WAIM.svg'

import { HORIZONTAL_LAYOUT, VERTICAL_LAYOUT } from './redux/constants';
import UndefinedAppImage from "../img/unknown.png"
import { HEADER_BUTTON_SIZE, HEADER_HEIGHT } from './constant';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import windowsSlice, { LayoutType, addLayoutInitial, createWindow, removeAllLayout, selectWindows, toggleLayoutEdit } from './redux/reducers/windowsSlice';
import { toggleSettings } from './redux/reducers/settingsSlice';


const Header = () => {
  const windows = useAppSelector(selectWindows)
  const dispatch = useAppDispatch()
  
  // app anchor for apps dropdown
  const [appsAnchor, setAppsAnchor] = React.useState<HTMLButtonElement>(null);

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





        <ButtonGroup size="small"  color="primary" variant="none">
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
            <FormControl  sx={{ mt: 2, mb: 2, pl: 3, pr: 3 }}>
              <OutlinedInput
                autoFocus={false}
                size="small"
                onChange={(e) => setSearchString(e.target.value)}
                value={searchString}
                placeholder="Search with App Name..."
                startAdornment= {(
                  <InputAdornment sx={{padding: 0}} position="start">
                    <SearchIcon />
                  </InputAdornment>
                )}
                endAdornment= {(
                  <IconButton sx={{padding: 0}}  onClick={() => { setSearchString("") }}>
                    <CloseIcon />
                  </IconButton>
                )}
               

              />
            </FormControl>
            {
              // loops each app saved and create a menu entry for it
              R.compose(
                R.map(([key, windowKey]) => {
                  if(R.isNil(searchString)) return

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
                                <img onError={(e) => (e.target.src = UndefinedAppImage)} style={{ width: "50px", height: "50px", borderRadius: 10 }} src={R.pathOr(UndefinedAppImage, ["apps", windowKey, "imageUrl"], windows)} />
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
                R.map((layout) => {
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
            onClick={(event) => { setLayoutAnchor(event.currentTarget) }}
          >
            Layout
          </Button>

        </ButtonGroup>


      </Box>
      <Box sx={{ width: "250px", textAlign: "center", display: "flex", justifyContent: "center", alignItems: "center" }}> </Box>

      <Box sx={{ width: "250px", textAlign: "end" }}>

        <ButtonGroup variant="none" size="small" >
          <Button sx={{ fontSize: HEADER_BUTTON_SIZE }} onClick={() => dispatch(toggleSettings(true))} startIcon={<SettingsIcon />} size="small">Settings</Button>
          <Button sx={{ fontSize: HEADER_BUTTON_SIZE }} startIcon={<HelpIcon />} size="small">Help</Button>

        </ButtonGroup>
      </Box>
    </Box>

  )

}


export default Header;
import React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { showWindow, toggleShowing, selectLayout, removeAllLayout, addInitialLayout, toggleLayoutEdit } from '../redux/actions'
import { InputAdornment, Box, Button, ButtonGroup, Tooltip, TextField, IconButton } from '@mui/material';
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
import StopCircleIcon from '@mui/icons-material/StopCircle';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import { ReactComponent as WAIMLogo } from '../img/WAIM.svg'
import { HORIZONTAL_LAYOUT, VERTICAL_LAYOUT } from '../redux/constants';
import UndefinedAppImage from "../img/unknown.png"


const Header = ({ windows, showWindow, toggleShowing, removeAllLayout, addInitialLayout, toggleLayoutEdit }) => {
  
  const [appsAnchor, setAppsAnchor] = React.useState(null);
  const [layoutAnchor, setLayoutAnchor] = React.useState(null);
  const [searchString, setSeearchString] = React.useState("")
  const layouts = [
    {
      title: "Vertical Split",
      type: VERTICAL_LAYOUT,
      icon: <VerticalSplitIcon />
    },
    {
      title: "Horizontal Split",
      type: HORIZONTAL_LAYOUT,
      icon: <HorizontalSplitIcon />
    }
  ]

  return (


    <Box className="header noselect" sx={{ bgcolor: 'background.paper', color: 'text.primary', justifyContent: 'space-between' }}>
      <Box sx={{ width: "250px", textAlign: "start" }}>





        <ButtonGroup size="small" variant="none" color="primary">
          <Button
            size="small"
            id="basic-button"
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
            <TextField
              size="small"
              onChange={(e) => setSeearchString(e.target.value)}
              value={searchString}
              placeholder="Search with App Name..."
              InputProps={{
                style: {paddingRight: 0},
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <IconButton onClick={()=> {setSeearchString("")}} position="start">
                    <CloseIcon />
                  </IconButton>
                )
              }}
              sx={{ mt: 2, mb: 2, pl: 3, pr: 3 }}
            />
            {
              R.compose(
                R.map(([key, windowKey]) => {

                  if (!R.isEmpty(searchString) && !R.prop("title", R.prop(windowKey, windows.apps)).toLowerCase().includes(searchString)) {
                    return
                  }
                  return (
                    <Box sx={{ pl: 1, pr: 1 }} key={key}>

                      <Tooltip key={`${windowKey}tooltip`} followCursor title={R.pathEq(["apps", windowKey, "single"], true, windows) && (R.gt(R.pathOr(0, ["openApps", windowKey], windows), 0)) ? "Only one instance of app can be opened" : ""}>
                        <span key={`${windowKey}span`} style={{ display: "block" }}>

                          <MenuItem key={`${windowKey}menuitem`} disabled={R.pathEq(["apps", windowKey, "single"], true, windows) && (R.gt(R.pathOr(0, ["openApps", windowKey], windows), 0))} onClick={() => { showWindow(windowKey); setAppsAnchor(null); }}>

                            <Box sx={{ display: "flex", flexDirection: "row", flex: 1, alignItems: "center" }}>
                              <Box sx={{ borderRadius: 3, border: "2px solid #9a9a9a", w: 1, h: 1, mr: 1, display: "flex", flex: "column" }}>
                                <img onError={(e)=>(e.target.src=UndefinedAppImage)} style={{width: "50px", height: "50px", borderRadius: 10}} src={R.pathOr(UndefinedAppImage, ["apps", windowKey, "imageUrl"], windows)}/>
                              </Box>
                              {R.prop("title", R.prop(windowKey, windows.apps))}
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
              R.compose(
                R.map((layout) => {
                  return <MenuItem disabled={R.equals(R.prop("layoutEditEnabled", windows), true) || R.hasPath(["layout", "type"], windows)} key={`${layout.type}menuitem`} onClick={() => { addInitialLayout(layout.type); setLayoutAnchor(null); }}>{layout.icon} {layout.title}</MenuItem>

                })

              )(layouts)
            }
            <MenuItem disabled={!R.hasPath(["layout", "type"], windows) || R.equals(R.prop("layoutEditEnabled", windows), true)} key={"removeLayout"} onClick={() => { removeAllLayout(); setLayoutAnchor(null); }}><DeleteIcon />Remove All Layout</MenuItem>
            {/* <MenuItem disabled={!R.hasPath(["layout", "type"], windows)} key={"editLayout"} onClick={() => { toggleLayoutEdit(); setLayoutAnchor(null); }}>
              {R.equals(R.prop("layoutEditEnabled", windows), true) ? <><StopCircleIcon /> Stop Editing </> : <><EditIcon /> Edit Layouts</>}
            </MenuItem> */}
          </Menu>


          <Button
            size="small"
            id="basic-button"
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
      <Box sx={{ width: "250px", textAlign: "center" }}> <WAIMLogo width="100px" /></Box>

      <Box sx={{ width: "250px", textAlign: "end" }}>

        <ButtonGroup variant="none" size="small" >
          <Button onClick={() => toggleShowing(true)} startIcon={<SettingsIcon />} size="small">Settings</Button>
          <Button startIcon={<HelpIcon />} size="small">Help</Button>

        </ButtonGroup>
      </Box>
    </Box>

  )

}

const mapStateToProps = state => {
  return state
};

export default connect(
  mapStateToProps,
  { showWindow, toggleShowing, selectLayout, removeAllLayout, addInitialLayout, toggleLayoutEdit }
)(Header)
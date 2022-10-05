import React from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { showWindow, toggleShowing, selectLayout, removeLayout } from '../redux/actions'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { ButtonGroup, Tooltip } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings';

import MenuItem from '@mui/material/MenuItem';

import HelpIcon from '@mui/icons-material/Help';
import Menu from '@mui/material/Menu';
import { VERTICAL_2COLUM } from '../redux/constants'
import twoColLogo from '../img/layouts-2-icon.png'


const Header = ({ windows, showWindow, toggleShowing, selectLayout, removeLayout }) => {
  const [appsAnchor, setAppsAnchor] = React.useState(null);
  const [layoutAnchor, setLayoutAnchor] = React.useState(null);
  const layouts = [
    {
      title: "Vertical Split",
      img: "/img/layouts-2-icon.png",
      type: VERTICAL_2COLUM
    }
  ]
  return (


    <Box className="header" sx={{ bgcolor: 'background.paper', color: 'text.primary', justifyContent: 'space-between' }}>
      <Box>
        <Button
          id="basic-button"
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
          {
            R.compose(
              R.map(([key, windowKey]) => {
                return (
                  <div key={key}>
                  <Tooltip key={`${windowKey}tooltip`} followCursor title={R.pathEq(["apps", windowKey, "single"], true, windows) && ( !R.isNil(R.find(R.propEq("appid", windowKey))(windows.view)) || R.includes(windowKey, R.values(R.path(["layout", "selectedApps"], windows)))) ? "Only one instance of app can be opened" : ""}>
                    <span key={`${windowKey}span`} style={{display: "block"}}>
                      <MenuItem key={`${windowKey}menuitem`} disabled={R.pathEq(["apps", windowKey, "single"], true, windows) && ( !R.isNil(R.find(R.propEq("appid", windowKey))(windows.view)) || R.includes(windowKey, R.values(R.path(["layout", "selectedApps"], windows))))} onClick={() => { showWindow(windowKey); setAppsAnchor(null); }}>{R.prop("title", R.prop(windowKey, windows.apps))}</MenuItem>
                    </span>
                  </Tooltip>
                  </div>
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
                return <MenuItem key={`${layout.type}menuitem`} onClick={() => { selectLayout(layout.type); setLayoutAnchor(null); }}><img key={`${layout.type}img`} alt="2 column" src={twoColLogo}></img>: {layout.title}</MenuItem>

              })

            )(layouts)
          }
          <MenuItem key={"removeLayout"} onClick={() => { removeLayout(); setLayoutAnchor(null); }}>Remove Layout</MenuItem>
        </Menu>


        <Button
          id="basic-button"
          aria-controls={layoutAnchor ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={layoutAnchor ? 'true' : undefined}
          onClick={(event) => { setLayoutAnchor(event.currentTarget) }}
        >
          Layout
        </Button>


      </Box>
      <Box> <Typography variant="h7" >WAIM</Typography></Box>

      <Box>

        <ButtonGroup aria-label="outlined primary button group">
          <Tooltip title="Settings">
            <Button onClick={() => { toggleShowing(true) }} variant="outlined">
              <SettingsIcon />
            </Button>
          </Tooltip>
          <Tooltip title="Help">
            <Button variant="outlined">
              <HelpIcon />
            </Button>
          </Tooltip>
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
  { showWindow, toggleShowing, selectLayout, removeLayout }
)(Header)
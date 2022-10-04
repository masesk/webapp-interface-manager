import React, { useState } from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { showWindow, toggleShowing, selectLayout } from '../redux/actions'
import { AiOutlineSetting, AiOutlineBars } from 'react-icons/ai'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import { ButtonGroup, Tooltip } from '@mui/material'
import SettingsIcon from '@mui/icons-material/Settings';

import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import HelpIcon from '@mui/icons-material/Help';
import Menu from '@mui/material/Menu';
import AddIcon from '@mui/icons-material/Add';
import { VERTICAL_2COLUM } from '../redux/constants'

const Item = styled(Paper)(({ theme }) => ({
}));
const Header = ({ windows, showWindow, toggleShowing, selectLayout }) => {
  const [value, setValue] = useState('');
  const [dense, setDense] = React.useState(false);
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
          onClose={()=>{setAppsAnchor(null)}}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {
            R.compose(
              R.map(([key, windowKey]) => {
                return <MenuItem key={windowKey} onClick={() => { showWindow(windowKey); setAppsAnchor(null); }}>{R.prop("title", R.prop(windowKey, windows.apps))}</MenuItem>

              }),
              R.toPairs,
            )(R.keys(windows.apps))
          }
        </Menu>


        <Menu
          id="basic-menu"
          anchorEl={layoutAnchor}
          open={Boolean(layoutAnchor)}
          onClose={()=>{setLayoutAnchor(null)}}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {
            R.compose(
              R.map((layout) => {
                return <MenuItem key={layout} onClick={() => { console.log(layout.type); selectLayout(layout.type); setLayoutAnchor(null); }}><img src={window.location.origin + "/" + layout.img}></img>: {layout.title}</MenuItem>

              })
            )(layouts)
          }
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
      <Box> <Typography variant="h7">WAIM</Typography></Box>
      
      <Box>

        <ButtonGroup aria-label="outlined primary button group">
          <Tooltip title="Settings">
            <Button variant="outlined">
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
  { showWindow, toggleShowing, selectLayout }
)(Header)
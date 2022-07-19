import React, { useState } from 'react'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { showWindow, toggleShowing } from '../redux/actions'
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

const Item = styled(Paper)(({ theme }) => ({
}));
const Header = ({ windows, showWindow, toggleShowing }) => {
  const [value, setValue] = useState('');
  const [dense, setDense] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (


    <Box className="header" sx={{ bgcolor: 'background.paper', color: 'text.primary', justifyContent: 'space-between' }}>
      <Box>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={(event) => { setAnchorEl(event.currentTarget) }}
        >
          APPS
        </Button>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'basic-button',
          }}
        >
          {
            R.compose(
              R.map(([key, windowKey]) => {
                return <MenuItem key={windowKey} onClick={() => { showWindow(windowKey); setAnchorEl(null); }}>{R.prop("title", R.prop(windowKey, windows.apps))}</MenuItem>

              }),
              R.toPairs,
            )(R.keys(windows.apps))
          }
        </Menu>
        <Button
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={(event) => { setAnchorEl(event.currentTarget) }}
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

    // <Box className="header" sx={{ bgcolor: 'background.paper', color: 'text.primary', }}>
    //   <Box sx={{justifyContent: "flex-start"}}>

    //     <ButtonGroup aria-label="outlined primary button group">
    //       <Tooltip title="Settings">
    //         <Button variant="outlined">
    //           <SettingsIcon />
    //         </Button>
    //       </Tooltip>
    //     </ButtonGroup>

    //       {/* <Dropdown onToggle={(isOpened)=> {!isOpened && setValue('')}} as={ButtonGroup}>
    //                 <Dropdown.Toggle  variant="secondary" id="dropdown-basic">
    //                     <AiOutlineBars size={20}/>
    //             </Dropdown.Toggle>

    //                 <Dropdown.Menu className="bg-dark" as={CustomMenu}>
    //                     {
    //                     R.compose(
    //                     R.map(([key, windowKey]) => {
    //                         return   <Dropdown.Item className="text-white bg-dark" key={windowKey} onClick={ () => showWindow(windowKey)}>{R.prop("title", R.prop(windowKey, windows.apps))}</Dropdown.Item>
    //                     }),
    //                     R.toPairs,
    //                     )(R.keys(windows.apps))
    //                 }
    //                 </Dropdown.Menu>
    //             </Dropdown> */}

    //       <List dense={dense}>

    //         {/* <ListItem
    //           secondaryAction={
    //             <IconButton edge="end" aria-label="delete">
    //               <DeleteIcon />
    //             </IconButton>
    //           }
    //         >
    //           <ListItemAvatar>
    //             <Avatar>
    //               <FolderIcon />
    //             </Avatar>
    //           </ListItemAvatar>
    //           <ListItemText
    //             primary="Single-line item"
    //             secondary={secondary ? 'Secondary text' : null}
    //           />
    //         </ListItem> */}
    //       </List>

    //   </Box>
    //   <div >
    //     <Typography variant="h7">WAIM</Typography>
    //   </div>
    //   <div className="header-apps-button">



    //     <ButtonGroup aria-label="outlined primary button group">
    //       <Tooltip title="Settings">
    //         <Button variant="outlined">
    //           <SettingsIcon />
    //         </Button>
    //       </Tooltip>
    //     </ButtonGroup>
    //     <Button onClick={() => toggleShowing(true)} variant="secondary">

    //     </Button>

    //   </div>
    // </Box>

  )

}

const mapStateToProps = state => {
  return state
};

export default connect(
  mapStateToProps,
  { showWindow, toggleShowing }
)(Header)
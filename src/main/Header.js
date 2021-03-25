import React from 'react'
import { Dropdown, Button } from 'react-bootstrap'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { showWindow, toggleShowing } from '../redux/actions'

const Header = ({windows, showWindow, toggleShowing}) => {
    return (
        <div className="header">
            <div className="header-apps-button">

                <Dropdown>
                    <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                        Apps
                </Dropdown.Toggle>

                    <Dropdown.Menu>
                        {
                        R.compose(
                        R.map(([key, windowKey]) => {
                            return   <Dropdown.Item key={windowKey} onClick={ () => showWindow(windowKey)}>{R.prop("title", R.prop(windowKey, windows.apps))}</Dropdown.Item>
                        }),
                        R.toPairs,
                        )(R.keys(windows.apps))
                    }
                    </Dropdown.Menu>
                </Dropdown>

            </div>
            <div className="header-logo">
                <span>WAIM</span>
            </div>
            <div className="header-apps-button">

                <Button onClick={()=> toggleShowing(true)} variant="secondary">Settings</Button>

            </div>
        </div>

    )

}

const mapStateToProps = state => {
    return state
  };

export default connect(
    mapStateToProps,
    { showWindow, toggleShowing }
  )(Header)
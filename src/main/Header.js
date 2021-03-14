import React from 'react'
import { Dropdown, Button } from 'react-bootstrap'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { showWindow } from '../redux/actions'

function Header({windows, showWindow}) {
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
                          
                            return   <Dropdown.Item key={windowKey} onClick={ () => showWindow(windowKey)}>{R.prop("title", R.prop(windowKey, windows))}</Dropdown.Item>
                        }),
                        R.toPairs,
                        )(R.keys(windows))
                    }
                    </Dropdown.Menu>
                </Dropdown>

            </div>
            <div className="header-logo">
                <span>GWM</span>
            </div>
            <div className="header-apps-button">

                <Button variant="secondary">Settings</Button>

            </div>
        </div>

    )

}

const mapStateToProps = state => {
    return state
  };

export default connect(
    mapStateToProps,
    { showWindow }
  )(Header)
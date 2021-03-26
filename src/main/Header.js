import React, {useState} from 'react'
import { Dropdown, Button, FormControl, ButtonGroup } from 'react-bootstrap'
import * as R from 'ramda'
import { connect } from 'react-redux'
import { showWindow, toggleShowing } from '../redux/actions'
import {AiOutlineSetting, AiOutlineBars} from 'react-icons/ai'



const Header = ({windows, showWindow, toggleShowing}) => {
  const [value, setValue] = useState('');
  const CustomMenu = React.forwardRef(
    ({ children, style, className, 'aria-labelledby': labeledBy }, ref) => {
  
      return (
        <div
          ref={ref}
          style={style}
          className={className}
          aria-labelledby={labeledBy}
        >
          <FormControl
            autoFocus
            className="mx-3 my-2 w-auto"
            placeholder="Type to search..."
            onChange={(e) => setValue(e.target.value)}
            value={value}
          />
          <ul className="list-unstyled">
            {React.Children.toArray(children).filter(
              (child) =>
                !value || child.props.children.toLowerCase().startsWith(value),
            )}
          </ul>
        </div>
      );
    },
  );
    
    return (
        <div className="header">
            <div className="header-apps-button">

                <Dropdown onToggle={(isOpened)=> {!isOpened && setValue('')}} as={ButtonGroup}>
                    <Dropdown.Toggle  variant="secondary" id="dropdown-basic">
                        <AiOutlineBars size={20}/>
                </Dropdown.Toggle>

                    <Dropdown.Menu className="bg-dark" as={CustomMenu}>
                        {
                        R.compose(
                        R.map(([key, windowKey]) => {
                            return   <Dropdown.Item className="text-white bg-dark" key={windowKey} onClick={ () => showWindow(windowKey)}>{R.prop("title", R.prop(windowKey, windows.apps))}</Dropdown.Item>
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

                <Button onClick={()=> toggleShowing(true)} variant="secondary">

                <AiOutlineSetting size={20}/>
                </Button>

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
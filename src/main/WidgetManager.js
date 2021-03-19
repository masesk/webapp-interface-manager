import React from 'react';
import '../css/App.css';
import Window from './Window'
import Header from './Header'
import * as R from 'ramda'
import AddWidget from '../apps/AddWidget'
import { connect } from 'react-redux'
import Settings from './Settings'
import StaticWindow from './StaticWindow'
import {BUILT_IN_APPS} from '../constants'
import MinBar from './MinBar';
import Test from '../apps/Test';

const Widget = ({ windows }) => {
  return (

    <>
      <Header windows={windows} />
      <StaticWindow id="test" >
          <Test />
        </StaticWindow>
        <StaticWindow id="addwidget" >
          <AddWidget />
        </StaticWindow>
      
      {
        R.compose(
          R.map(([key, windowKey]) => {
            if (R.has(windowKey, BUILT_IN_APPS)) {
              return null
            }
            const window = R.prop(windowKey, windows)
            return R.propEq("showing", true, window) && <Window key={window.id}
              id={window.id}
              title={window.title}
              url={window.url}
              width={window.width}
              zIndex={window.zIndex}
              minimized={window.minimized}
              height={window.height} />
          }),
          R.toPairs,
        )(R.keys(windows))
      }
      <Settings/>
      <div className="footer">
      {
        
        R.compose(
          R.map(([key, windowKey]) => {
            const window = R.prop(windowKey, windows)
            if(R.propEq("showing", true, window) || R.propEq("minimized", true, window) ){
              return <MinBar className={!R.propEq("minimized", true, window) ? "showing" : ""} key={key} id={windowKey}>{R.path([windowKey, "title"], windows)}</MinBar>
            }
            return null
          }),
          R.toPairs,
        )(R.keys(windows))
      }
      </div>

    </>
  );
}


const mapStateToProps = state => {
  return state
};

export default connect(mapStateToProps)(Widget);



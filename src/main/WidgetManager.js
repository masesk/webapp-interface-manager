import React, { useState } from 'react';
import '../css/App.css';
import Window from './Window'
import Header from './Header'
import * as R from 'ramda'
import AddWidget from '../apps/AddWidget'
import { connect } from 'react-redux'
import {loadApps} from '../redux/actions'
import Settings from './Settings'
import StaticWindow from './StaticWindow'
import {BUILT_IN_APPS} from '../constants'
import MinBar from './MinBar';
import Test from '../apps/Test';

const WidgetManager = ({ windows, loadApps }) => {
  useState(()=>{
    loadApps()
  }, [])
  return (

    <>
      <Header windows={windows} />
        {/* Add all static windows/apps below */}
        <StaticWindow appid="test" >
          <Test />
        </StaticWindow>
        <StaticWindow appid="addwidget" >
          <AddWidget />
        </StaticWindow>
      
      {
        R.compose(
          R.map(([index, win]) => {
            const appid = R.prop("appid", win)
            const key = R.prop("viewid", win)
            const zIndex = R.prop("zIndex", win)
            if (R.has(appid, BUILT_IN_APPS)) {
              return null
            }
            const window = R.path(["apps", appid], windows)
            return  <Window 
              appid={window.appid}
              title={window.title}
              url={window.url}
              width={window.width}
              zIndex={zIndex}
              index={index}
              key={key}
              viewid={key}
              minimized={R.prop("minimized", win)}
              height={window.height} />
          }),
          R.toPairs,
        )(windows.view)
      }
      <Settings/>
      <div className="footer">
      {
        
         R.compose(
        
          R.map(([index, win]) => {
              const appid = R.prop("appid", win)
              const viewid = R.prop("viewid", win)
              const window = R.path(["apps", appid], windows)
              return <MinBar className={R.propEq("minimized", true, win) ? "" : "showing"} index={viewid} key={index} appid={appid}>{R.prop("title", window)}</MinBar>
          }),
          R.toPairs,

        )(windows.view)
      }
      </div>

    </>
  );
}


const mapStateToProps = state => {
  return state
};

export default connect(mapStateToProps, {loadApps})(WidgetManager);



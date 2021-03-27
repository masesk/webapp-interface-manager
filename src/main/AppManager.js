import React, { useState } from 'react';
import '../css/App.css';
import Window from './Window'
import Header from './Header'
import * as R from 'ramda'
import AddWebApp from '../apps/AddWebApp'
import { connect } from 'react-redux'
import {loadApps} from '../redux/actions'
import Settings from './Settings'
import StaticWindow from './StaticWindow'
import {BUILT_IN_APPS} from '../constants'
import MinBar from './MinBar';
import Sender from '../apps/Sender';
import Receiver from '../apps/Receiver';

const AppManager = ({ windows, loadApps }) => {
  useState(()=>{
    window.messageHandler = {}
    window.messageHandler.publish = (channelName, data) => {
      const event = new Event(channelName, { bubbles: true, cancelable: false })
      event.data = data
      window.dispatchEvent(event)
    }
    window.messageHandler.listen =  (channelName, callback) => {
      window.addEventListener(channelName, (event) => {
        callback(event.data)
      }, false);
    }
    loadApps()
  }, [])
  return (

    <>
      <Header windows={windows} />
        {/* Add all static windows/apps below */}
        <StaticWindow appid="sender" >
          <Sender />
        </StaticWindow>
        <StaticWindow appid="receiver" >
          <Receiver />
        </StaticWindow>
        <StaticWindow appid="addwebapp" >
          <AddWebApp />
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

export default connect(mapStateToProps, {loadApps})(AppManager);



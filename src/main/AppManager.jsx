import React, { useEffect } from 'react';
import '../css/App.css';
import Window from './Window'
import Header from './Header'
import * as R from 'ramda'
import AddWebApp from '../apps/AddWebApp'
import { connect } from 'react-redux'
import { loadApps, addAppDom } from '../redux/actions'
import Settings from './Settings'
import StaticWindow from './StaticWindow'
import { BUILT_IN_APPS } from '../constants'
import MinBar from './MinBar';
import Sender from '../apps/Sender';
import Receiver from '../apps/Receiver';
import TwoColumnLayout from './TwoColumnLayout';
import Tabs from "@mui/material/Tabs"
import { VERTICAL_2COLUM } from '../redux/constants';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";



const AppManager = ({ windows, loadApps, addAppDom }) => {

  useEffect(() => {
    window.messageHandler = {}
    window.messageHandler.publish = (channelName, data) => {
      const event = new Event(channelName, { bubbles: true, cancelable: false })
      event.data = data
      window.dispatchEvent(event)
    }
    window.messageHandler.listen = (channelName, callback) => {
      window.addEventListener(channelName, (event) => {
        callback(event.data)
      }, false);
    }
    {/* Add all static apps below */ }
    loadApps()
    addAppDom("sender", <Sender />)
    addAppDom("receiver", <Receiver />)
    addAppDom("addwebapp", <AddWebApp />)
  }, [addAppDom, loadApps])




  const mainPage = () => {
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
        {(R.equals(R.path(["layout", "selectedLayout"], windows), VERTICAL_2COLUM)) && <TwoColumnLayout />}
        {
          R.compose(
            R.map(([index, win]) => {
              const appid = R.prop("appid", win)
              const key = R.prop("viewid", win)
              const zIndex = R.prop("zIndex", win)
              if (R.has(appid, BUILT_IN_APPS) && !R.hasPath([appid, "url"], BUILT_IN_APPS)) {
                return null
              }
              const window = R.path(["apps", appid], windows)
              return <Window
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
        <Settings />
        <div className="footer">
          <Tabs
            variant="scrollable"
            scrollButtons="auto"
            value={false}
            aria-label="scrollable auto tabs example"
          >

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
          </Tabs>
        </div>
      </>
    )
  }

  const pageWrapper = (element) => {
    return(
      <div style={{height: "100vh"}}>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {element}
      </div>
    )
  }

  const framePageWrapper = (url) => {
    return pageWrapper(<iframe src={url} width="100%" height="100%" style={{border: "0px"}}/>)
  }

  const createPages = () => {
    const main = mainPage()
    let pages = [{
      path: "/",
      element: main,
      errorElement: main
    }]
    R.compose(
      R.map(([key, value])=> {
       pages = R.append({path: key, element: pageWrapper(value)}, pages)
      //  /console.log(key, value)
      }),
      R.toPairs
    )(windows.appDoms)

    R.compose(
      R.map(([key, value])=> {
        if(R.has("url", value)){
          pages = R.append({path: key, element: framePageWrapper(value.url)}, pages)
          
        }
      }, 
    ),
    R.toPairs
    )(windows.apps)
    return pages
  }

  const router = createBrowserRouter(createPages());

  return (


    <>
      <RouterProvider router={router} />
    </>
  );
}


const mapStateToProps = state => {
  return state
};

export default connect(mapStateToProps, { loadApps, addAppDom })(AppManager);



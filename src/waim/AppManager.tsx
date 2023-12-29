import React, { useEffect, useRef } from 'react';
import '../css/App.css';
import * as R from 'ramda'
import AddWebApp from "../apps/AddWebApp.jsx"
import ChatClient from '../apps/ChatClient.jsx';
import MainPage from './MainPage';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { addAppDom, loadApps, selectWindows } from './redux/reducers/windowsSlice';
import { useAppSelector, useAppDispatch } from './redux/hooks';
import StandaloneApp from './StandaloneApp.js';


interface PageEntry {
  path: string,
  element: React.ReactElement,
  errorElement?: React.ReactElement,
}

interface FramePageWrapperProps {
  url: string
}

const AppManager = () => {
  
  const dispatch = useAppDispatch()
  const windows = useAppSelector(selectWindows)
  // this will be called initially, and when the addAppDom or loadApps methods are changed
  // pass your app id and react dom below if you want to render a react component as an app
  // don't forget to add your app in src/constants.js
  useEffect(() => {
    {/* Add all static apps below */ }
    dispatch(loadApps())
    dispatch(addAppDom({appid: "chatclient",  appDom: React.createElement(ChatClient as any)}))
    dispatch(addAppDom({appid: "addwebapp", appDom: React.createElement(AddWebApp as any)}))
  }, [addAppDom, loadApps])



  // the page wrapper allows for each application to occupy the entire screen
  // this is especially useful when the app is running outside of WAIM framework
  // but still going through the React Router
  const pageWrapper = (element: React.ReactElement) => {
    return (
      <div style={{ height: "100vh" }}>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {element}
      </div>
    )
  }

  // Apps that reside on different domains or pre-built and acecssible through a URL
  // will need to be wrapped aroudn an iframe first
  const FramePageWrapper = ({url} : FramePageWrapperProps) => {
    const frameRef = useRef<HTMLIFrameElement>(null)
    return pageWrapper(<iframe ref={frameRef} onLoad={() => {
      try {
        const contentWindow: any = frameRef!.current!.contentWindow
        const localWindow: any = window
        contentWindow.waim = localWindow.waim
      } catch (e) {
        console.error(e)
      }
    }} src={url} width="100%" height="100%" style={{ border: "0px" }} />)
  }


  // the error boundary function determines the error code and shows a generic error message
  // when going through React Router
  function ErrorBoundary() {
    const error = useRouteError();
    if (isRouteErrorResponse(error)) {
      return (
        <div>
          <h1>Error!</h1>
          <h2>{error.status}</h2>
          <p>{error.statusText}</p>
          {error.data?.message && <p>{error.data.message}</p>}
        </div>
      );
    } else {
      return <div>Unknown Error</div>;
    }
  }

  // Create pages for each app
  // the app id is used to add a react router page
  // for example an app with an id test_app_1 can be acccessed directly
  // through http://yourdomain/test_app_1
  // In production, don't forget to configure your proxy to pass calls to this application
  // for all IDs
  const createPages = () => {
    let pages: PageEntry[] = []
    pages.push({
      path: "/",
      element: <MainPage />,
      errorElement: <ErrorBoundary/>
    })
    R.compose(
      R.map(([key, value]) => {
        pages.push({ path: `${key}`, element: <StandaloneApp>{pageWrapper(value)}</StandaloneApp> })
      }),
      R.toPairs
    )(windows.appDoms)

    R.compose(
      R.map(([key, value]) => {
        if (R.has("url", value)) {
          pages.push({ path: `${key}`, element: <StandaloneApp>{<FramePageWrapper url={value.url as string}/>}</StandaloneApp> })
        }
      },
      ),
      R.toPairs
    )(windows.apps)
    pages.push({
      path: "*",
      element: <></>,
      errorElement: <ErrorBoundary/>
    })
    return pages
  }

  // Create the browser router and pass it to the router provider
  const router = createBrowserRouter(createPages());

  return (

    <>
      <RouterProvider router={router} />
    </>
  );
}


// connect to the redux store
export default AppManager;



import React, { useEffect } from 'react';
import '../css/App.css';
import * as R from 'ramda'
import AddWebApp from '../apps/AddWebApp'
import { connect } from 'react-redux'
import { loadApps, addAppDom } from '../redux/actions'
import ChatClient from '../apps/ChatClient';
import MainPage from './MainPage';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";



const AppManager = ({ windows, loadApps, addAppDom }) => {

  // this will be called initially, and when the addAppDom or loadApps methods are changed
  // pass your app id and react dom below if you want to render a react component as an app
  // don't forget to add your app in src/constants.js
  useEffect(() => {
    {/* Add all static apps below */ }
    loadApps()
    addAppDom("chatclient", <ChatClient />)
    addAppDom("addwebapp", <AddWebApp />)
  }, [addAppDom, loadApps])



  // the page wrapper allows for each application to occupy the entire screen
  // this is especially useful when the app is running outside of WAIM framework
  // but still going through the React Router
  const pageWrapper = (element) => {
    return (
      <div style={{ height: "100vh" }}>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {element}
      </div>
    )
  }

  // Apps that reside on different domains or pre-built and acecssible through a URL
  // will need to be wrapped aroudn an iframe first
  const framePageWrapper = (url) => {
    return pageWrapper(<iframe src={url} width="100%" height="100%" style={{ border: "0px" }} />)
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
    let pages = []
    R.compose(
      R.map(([key, value]) => {
        pages = R.append({ path: `${key}`, element: pageWrapper(value) }, pages)
      }),
      R.toPairs
    )(windows.appDoms)

    R.compose(
      R.map(([key, value]) => {
        if (R.has("url", value)) {
          pages = R.append({ path: `${key}`, element: framePageWrapper(value.url) }, pages)
        }
      },
      ),
      R.toPairs
    )(windows.apps)
    pages = R.append({
      path: "*",
      element: <MainPage />,
      errorElement: <ErrorBoundary/>
    }, pages)
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


const mapStateToProps = state => {
  return state
};

// connect to the redux store
export default connect(mapStateToProps, { loadApps, addAppDom })(AppManager);



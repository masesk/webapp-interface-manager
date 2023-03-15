import React, { useEffect } from 'react';
import '../css/App.css';
import * as R from 'ramda'
import AddWebApp from '../apps/AddWebApp'
import { connect } from 'react-redux'
import { loadApps, addAppDom } from '../redux/actions'
import Sender from '../apps/Sender';
import Receiver from '../apps/Receiver';
import MainPage from './MainPage';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";



const AppManager = ({ windows, loadApps, addAppDom }) => {

  useEffect(() => {
    {/* Add all static apps below */ }
    loadApps()
    addAppDom("sender", <Sender />)
    addAppDom("receiver", <Receiver />)
    addAppDom("addwebapp", <AddWebApp />)
  }, [addAppDom, loadApps])



  const pageWrapper = (element) => {
    return (
      <div style={{ height: "100vh" }}>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {element}
      </div>
    )
  }

  const framePageWrapper = (url) => {
    return pageWrapper(<iframe src={url} width="100%" height="100%" style={{ border: "0px" }} />)
  }


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

  const createPages = () => {
    let pages = [{
      path: "/",
      element: <MainPage />,
      errorElement: <ErrorBoundary/>
    }]
    R.compose(
      R.map(([key, value]) => {
        pages = R.append({ path: `/${key}`, element: pageWrapper(value) }, pages)
        //  /console.log(key, value)
      }),
      R.toPairs
    )(windows.appDoms)

    R.compose(
      R.map(([key, value]) => {
        if (R.has("url", value)) {
          pages = R.append({ path: `/${key}`, element: framePageWrapper(value.url) }, pages)

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



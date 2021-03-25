import { connect } from 'react-redux'
import React from 'react';
import * as R from 'ramda'
import Window from './Window'


const StaticWindow = ({ windows, children, appid }, ref) => {

  return (
    <>
    {
        R.compose(
        R.map(([index, win]) => {
        
          const fappid = R.prop("appid", win)
          const key = R.prop("viewid", win)
          const zIndex = R.prop("zIndex", win)
          if (R.equals(appid, fappid)) {
            const window = R.path(["apps", appid], windows)
            return <Window 
              appid={window.appid}
              title={window.title}
              width={window.width}
              key={key}
              zIndex={zIndex}
              viewid={key}
              index={index}
              minimized={R.prop("minimized", win)}
              url={window.url}
              height={window.height}>{children}</Window>
          }

        }),
        R.toPairs,
    )(windows.view)
        }
     
    </>
  )
}


const mapStateToProps = state => {
  return state
};


const connectAndForwardRef = (
  mapStateToProps = null,
  mapDispatchToProps = null,
  mergeProps = null,
  options = {},
) => component => connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  {
    ...options,
    forwardRef: true,
  },
)(React.forwardRef(component));

const ConnectedWindow = connectAndForwardRef(mapStateToProps, null)(StaticWindow)

export default ConnectedWindow;

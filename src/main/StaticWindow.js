import { connect } from 'react-redux'
import React from 'react';
import * as R from 'ramda'
import Window from './Window'


const StaticWindow = ({ windows, children, id }, ref) => {
    
    return(
        <>
        {R.pathEq(["apps", id, "showing"], true, windows) &&
        <Window 
          title={R.path(["apps",id, "title"], windows)}
          id={R.path(["apps", id, "id"], windows)}
          width={R.path(["apps", id, "width"], windows)}
          ref={ref}
          height={R.path(["apps", id, "height"], windows)}
          zIndex={R.findIndex(R.equals(id))(R.prop("order", windows))}
          minimized={R.path(["apps", id, "minimized"], windows)}
        >
          {children}
        </Window>
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
  
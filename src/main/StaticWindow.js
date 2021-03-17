import { connect } from 'react-redux'
import React from 'react';
import * as R from 'ramda'
import Window from './Window'


const StaticWindow = ({ windows, children, id }, ref) => {
    
    return(
        <>
        {R.pathEq([id, "showing"], true, windows) &&
        <Window 
          title={R.path([id, "title"], windows)}
          id={R.path([id, "id"], windows)}
          width={R.path([id, "width"], windows)}
          ref={ref}
          height={R.path([id, "height"], windows)}
          zIndex={R.path([id, "zIndex"], windows)}
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
  
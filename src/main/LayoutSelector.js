import React from 'react'
import {connect} from 'react-redux'
import {selectLayout} from "../redux/actions"

const LayoutSelector = (layout, selectLayout) => {
    return(
        "SELECT APP"
    )
}

const mapStateToProps = state => {
    return state
  };
  
  export default connect(mapStateToProps, { selectLayout })(LayoutSelector);
  
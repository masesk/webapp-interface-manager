import React from 'react';
import '../css/App.css';
import Window from './Window'
import Header from './Header'
import * as R from 'ramda'
import AddWidget from './AddWidget'
import { connect } from 'react-redux'
import Settings from './Settings'
import StaticWindow from './StaticWindow'

const Widget = ({ windows }) => {
  return (

    <>
      <Header windows={windows} />
      
        <StaticWindow id="addwidget" >
          <AddWidget />
        </StaticWindow>
      
      {
        R.compose(
          R.map(([key, windowKey]) => {
            if (R.equals(windowKey, "addwidget")) {
              return null
            }
            const window = R.prop(windowKey, windows)
            return <Window key={window.id}
              id={window.id}
              title={window.title}
              url={window.url}
              width={window.width}
              zIndex={window.zIndex}
              height={window.height} />
          }),
          R.toPairs,
        )(R.keys(windows))
      }
      <Settings/>

    </>
  );
}


const mapStateToProps = state => {
  const { windows } = state
  return { windows: R.filter(R.propEq("showing", true), windows) }
};

export default connect(mapStateToProps)(Widget);



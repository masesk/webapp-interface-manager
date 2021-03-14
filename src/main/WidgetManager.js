import React, { useEffect } from 'react';
import '../css/App.css';
import Window from './Window'
import Header from './Header'
import * as R from 'ramda'
import useDynamicRefs from 'use-dynamic-refs';
import AddWidget from './AddWidget'
import { connect } from 'react-redux'

const Widget = ({ windows }) => {
  const [getRef, setRef] = useDynamicRefs();




  const addWidgetWindow = {
    id: "addwidget",
    title: "Add Widget",
    width: 800,
    height: 500,
    showing: true
  }

  const clickCallback = (id) => {
    R.forEach(key => {
      const keyRef = getRef(key)
      if (R.isNil(R.path(["current", "style"], keyRef))) {
        return
      }
      if (key === id) {
        keyRef.current.style.zIndex = 1;
      }
      else {
        keyRef.current.style.zIndex = 0;
      }
    }, R.append(R.keys(windows)))
  }

  useEffect(() => {
    console.log(windows)
  }, [windows])



  return (

    <>
      <Header windows={windows} />
      {R.pathEq(["addwidget", "showing"], true, windows) &&
        <Window initTitle={addWidgetWindow.title}
          id={addWidgetWindow.id}
          initWidth={addWidgetWindow.width} ref={setRef(addWidgetWindow.id)}
          initHeight={addWidgetWindow.height}
          clickCallback={clickCallback}
        >
          <AddWidget />
        </Window>
      }
      {
        R.compose(
          R.map(([key, windowKey]) => {
            if (R.equals(windowKey, "addwidget")) {
              return null
            }
            const window = R.prop(windowKey, windows)
            return <Window ref={setRef(windowKey)} key={window.id}
              id={window.id}
              initTitle={window.title}
              initUrl={window.url} initWidth={window.width} clickCallback={clickCallback}
              initHeight={window.height} />
          }),
          R.toPairs,
        )(R.keys(windows))
      }


    </>
  );
}


const mapStateToProps = state => {
  const { windows } = state
  return { windows: R.filter(R.propEq("showing", true), windows) }
};

export default connect(mapStateToProps)(Widget);



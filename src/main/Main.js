import React, { useState } from 'react';
import '../css/App.css';
import Window from './Window'
import Header from './Header'
import * as R from 'ramda'


function App() {
  const [windows, setWindows] = useState([
    {
      "title": "User Manager",
      "width": 500,
      "height": 300
    }
  ])
  return (
    <>
      <Header/>
      {
        R.map(window => {
          return <Window  initTitle={window.title} initWidth={window.width} initHeight={window.height} />
        }, windows)
      }
      <button onClick={()=>setWindows(R.append(windows[0], windows))}>SPAWN NEW </button>
    </>
  );
}

export default App;



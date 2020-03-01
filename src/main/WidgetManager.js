import React, { useState, useEffect, useRef } from 'react';
import '../css/App.css';
import Window from './Window'
import Header from './Header'
import * as R from 'ramda'
import { Form, Button } from 'react-bootstrap'


function Widget() {
  const title = useRef();
  const url = useRef();
  const [windows, setWindows] = useState({})


  const updateWindow = () => {
    setWindows(R.assoc(title, {
      title: title.current.value,
      width: 800,
      height: 500,
      url: url.current.value
    }, windows))

  }

  const addWidgetWindow = {
    "title": "Add Widget",
    "width": 800,
    "height": 500,
    "component": (<Form className="p-5">
      <Form.Group>
        <Form.Label>Widget Title</Form.Label>
        <Form.Control ref={title} placeholder="Widget Title Name" />
      </Form.Group>

      <Form.Group>
        <Form.Label>Widget URL</Form.Label>
        <Form.Control ref={url}  placeholder="Widget URL" />
      </Form.Group>
      <Button type="submit" variant="secondary" 
        onClick={(e) => {updateWindow(); e.preventDefault()}}
      >
        Submit
      </Button>
    </Form >)
}


return (

  <>
    <Header />
    <Window initComponent={addWidgetWindow.component} initTitle={addWidgetWindow.title}
     initUrl={addWidgetWindow.url}
     initWidth={addWidgetWindow.width} initHeight={addWidgetWindow.height} />
    {
      R.compose(
        R.map(([key, windowKey]) => {
          const window = R.prop(windowKey, windows)
          return <Window key={key} initComponent={window.component} initTitle={window.title} 
            initUrl={window.url} initWidth={window.width} 
            initHeight={window.height} />
        }),
        R.toPairs,
      )(R.keys(windows))
    }

  </>
);
}

export default Widget;



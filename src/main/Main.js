import React, { useState } from 'react';
import '../css/App.css';
import Window from './Window'
import Header from './Header'
import * as R from 'ramda'
import { Form, Button } from 'react-bootstrap'


function App() {
  const [title, setTitle] = useState("Mases Krikorian Website")
  const [url, setUrl] = useState("http://masesk.com")

  const [windows, setWindows] = useState([
    {
      "title": "Add Widget",
      "width": 800,
      "height": 500,
      "component": (
        <Form className="p-5">
          <Form.Group>
            <Form.Label>Widget Title</Form.Label>
            <Form.Control value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Widget Title Name" />
          </Form.Group>

          <Form.Group>
            <Form.Label>Widget URL</Form.Label>
            <Form.Control value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Widget URL" />
          </Form.Group>
          <Button variant="secondary" onClick={() => setWindows(R.append({
            "title": title,
            width: 800,
            height: 500,
            url: url
          }, windows))}>
            Submit
        </Button>
        </Form>)
    },
  ])





  return (
    <>
      <Header onClick={() => console.log("WINDOW CLICK!")} />
      {
        R.compose(
          R.map(([key, window]) => {
            return <Window key={key} initComponent={window.component} initTitle={window.title} initUrl={window.url} initWidth={window.width} initHeight={window.height} />
          }),
          R.toPairs,
      )(windows)
      }

    </>
  );
}

export default App;



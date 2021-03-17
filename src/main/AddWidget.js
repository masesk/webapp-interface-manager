import React, { useRef, useState } from 'react';
import { Form, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { createWindow } from "../redux/actions";
import * as R from 'ramda'
const AddWidget = ({ createWindow }) => {
  const title = useRef();
  const url = useRef();
  const id = useRef();
  const [titleError, setTitleError] = useState(false)
  const [idError, setIdError] = useState(false)
  const [urlError, setUrlError] = useState(false)
  return (
    <Form className="p-5">
      <Form.Group>
        <Form.Label>Widget ID</Form.Label>
        <Form.Control ref={id} placeholder="Widget ID" isInvalid={idError} onChange={e => setIdError(false)} />
        <Form.Control.Feedback type="invalid">
          ID cannot be empty or a duplicate
            </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Widget Title</Form.Label>
        <Form.Control ref={title} placeholder="Widget Title Name" isInvalid={titleError} onChange={e => setTitleError(false)} />
        <Form.Control.Feedback type="invalid">
          Title cannot be empty
            </Form.Control.Feedback>
      </Form.Group>

      <Form.Group>
        <Form.Label>Widget URL</Form.Label>
        <Form.Control ref={url} placeholder="Widget URL" required isInvalid={urlError} onChange={e => setUrlError(false)} />
        <Form.Control.Feedback type="invalid">
          URL cannot be empty
            </Form.Control.Feedback>
      </Form.Group>
      <Button variant="secondary"
        onClick={e => {
          let error = false
          if (R.isEmpty(id.current.value)) {
            setIdError(true)
            error = true
          }
          if (R.isEmpty(title.current.value)) {
            setTitleError(true)
            error = true
          }
          if (R.isEmpty(url.current.value)) {
            setUrlError(true)
            error = true
          }
          if(error){
            console.log("error")
            return
          }
          createWindow(id.current.value, title.current.value, 800, 500, url.current.value, true)
          }
        }
      >
        Submit
      </Button>
    </Form >)
}

export default connect(
  null,
  { createWindow }
)(AddWidget)
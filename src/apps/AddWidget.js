import React, { useEffect, useRef, useState } from 'react';
import { Form, Button, Col } from 'react-bootstrap'
import { connect } from 'react-redux'
import { createWindow, updateIndex } from "../redux/actions";
import * as R from 'ramda'
const AddWidget = ({ createWindow }) => {
  const title = useRef();
  const url = useRef();
  const id = useRef();
  const width = useRef()
  const height = useRef()
  const [titleError, setTitleError] = useState(false)
  const [idError, setIdError] = useState(false)
  const [urlError, setUrlError] = useState(false)
  const [whError, setWhError] = useState(false)
  const [single, setSingle] = useState(false)
  const [deletable, setDeletable] = useState(true)
  const [editable, setEditable] = useState(true)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    setSuccess(false)
  }, [single, deletable])
  return (
    <Form className="p-5">
      <Form.Group>
        <Form.Label>Widget ID</Form.Label>
        <Form.Control ref={id} placeholder="Widget ID" isInvalid={idError} onChange={e => {setIdError(false); setSuccess(false)}} />
        <Form.Control.Feedback type="invalid">
          ID cannot be empty or a duplicate
            </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Widget Title</Form.Label>
        <Form.Control ref={title} placeholder="Widget Title Name" isInvalid={titleError} onChange={e => {setTitleError(false); setSuccess(false)}} />
        <Form.Control.Feedback type="invalid">
          Title cannot be empty
            </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Width and Height</Form.Label>
        <Form.Row>
          <Col>
            <Form.Control ref={width} onChange={e => {setWhError(false);  setSuccess(false)}} isInvalid={whError} placeholder="Width" />
            <Form.Control.Feedback type="invalid">
              Width cannot be empty AND must be integers
            </Form.Control.Feedback>
          </Col>
          <Col>
            <Form.Control ref={height} onChange={e => {setWhError(false) ; setSuccess(false)}} isInvalid={whError} placeholder="Height" />
            <Form.Control.Feedback type="invalid">
              Height cannot be empty AND must be integers
            </Form.Control.Feedback>
          </Col>
        </Form.Row>
      </Form.Group>

      <Form.Group>
        <Form.Label>Widget URL</Form.Label>
        <Form.Control ref={url} placeholder="Widget URL" required isInvalid={urlError} onChange={e => {setUrlError(false); setSuccess(false)}} />
        <Form.Control.Feedback type="invalid">
          URL cannot be empty
            </Form.Control.Feedback>
      </Form.Group>
      <Form.Group>
        <Form.Label>Single Instance</Form.Label>
        <Form.Check checked={single} onChange={e => setSingle(!single)} type="checkbox" label="Allow Single Instance of the App?" />
      </Form.Group>
      <Form.Group>
        <Form.Label>Deletable</Form.Label>
        <Form.Check checked={deletable} onChange={e => setDeletable(!deletable)} type="checkbox" label="Allow app to be deleted?" />
      </Form.Group>
      <Form.Group>
        <Form.Label>Editable</Form.Label>
        <Form.Check checked={editable} onChange={e => setEditable(!editable)} type="checkbox" label="Allow app to be edited from the settings?" />
      </Form.Group>

      <Button variant="secondary"
        onClick={e => {
          const isValidNumber = R.both(R.is(Number), R.complement(R.equals(NaN)));
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
          if (R.isEmpty(width.current.value) || R.isEmpty(height.current.value) || !isValidNumber(Number(width.current.value)) || !isValidNumber(Number(height.current.value))) {
            setWhError(true)
            error = true
          }
          if (error) {
            return
          }
          createWindow(id.current.value, title.current.value, Number(width.current.value), Number(height.current.value), url.current.value, single, deletable, editable)
          updateIndex(id.current.value)
          setSuccess(true)
        }
        }
      >
        Submit
      </Button>
      {success && <Form.Group><Form.Label className="text-success">
        Widget successfully created
            </Form.Label></Form.Group>}

    </Form >)
}

export default connect(
  null,
  { createWindow }
)(AddWidget)
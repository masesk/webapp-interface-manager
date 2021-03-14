import React, {useRef} from 'react';
import { Form, Button } from 'react-bootstrap'
import { connect } from 'react-redux'
import { createWindow } from "../redux/actions";
const AddWidget = ({createWindow}) =>{
    const title = useRef();
    const url = useRef();
    const id = useRef();
    return(
    <Form className="p-5">
        <Form.Group>
            <Form.Label>Widget ID</Form.Label>
            <Form.Control ref={id} placeholder="Widget ID" />
          </Form.Group>
          <Form.Group>
            <Form.Label>Widget Title</Form.Label>
            <Form.Control ref={title} placeholder="Widget Title Name" />
          </Form.Group>

          <Form.Group>
            <Form.Label>Widget URL</Form.Label>
            <Form.Control ref={url} placeholder="Widget URL" />
          </Form.Group>
          <Button variant="secondary"
            onClick={ e => createWindow(id.current.value, title.current.value, 800, 500, url.current.value, true)}
          >
            Submit
      </Button>
        </Form >)
}

export default connect(
  null,
  { createWindow }
)(AddWidget)
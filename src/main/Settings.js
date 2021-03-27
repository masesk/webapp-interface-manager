import React, { useState, useEffect, useRef } from 'react'
import { Button, Modal, Row, Col, Container, Form } from 'react-bootstrap'
import { connect } from 'react-redux'
import { toggleShowing, deleteWindow, resetDefault, updateWindow } from '../redux/actions'
import { AiOutlineDelete, AiOutlineEdit, AiOutlineCheck } from 'react-icons/ai'
import * as R from 'ramda'





const Settings = ({ windows, settings, toggleShowing, deleteWindow, resetDefault, updateWindow }) => {


    const [editableRow, setEditableRow] = useState(-1)


    const renderButtons = (appid, index) => {
        return (
            <>
                {
                     R.pathEq(["apps", appid, "editable"], true, windows) && 
                     <Button style={{ marginRight: 5 }} onClick={() => {
                                if(!R.equals(appid, editableRow)){
                                    setEditableRow(index)
                                }
                                else{ 
                                    updateWindow(appid, titleRef.current.value, Number(widthRef.current.value), 
                                        Number(heightRef.current.value), urlRef.current.value, singletonRef.current.checked,
                                       deletableRef.current.checked, R.path([appid, "editable"], window))
                                    setEditableRow(-1)
                                }
                            }} 
                        variant= {R.equals(appid, editableRow) ? "success" : "secondary"} target="_blank" rel="noopener noreferrer">
                         {R.equals(appid, editableRow) ? <AiOutlineCheck/> : <AiOutlineEdit size={20} />}
                    </Button>
                }
                {
                    R.pathEq(["apps", appid, "deletable"], true, windows) &&
                    <Button onClick={() => setAppName(appid)} variant="secondary" target="_blank" rel="noopener noreferrer"><AiOutlineDelete size={20} /></Button>
                }
            </>
        );

    }



    const titleRef = useRef()
    const widthRef = useRef()
    const heightRef = useRef()
    const urlRef = useRef()
    const deletableRef = useRef()
    const singletonRef = useRef()

    const [showingConfirm, setShowingConfirm] = useState(false)
    const [appName, setAppName] = useState("")
    const [showingConfirmReset, setShowingConfirmReset] = useState(false)
    const handleClose = () => {
        toggleShowing(false)
        setEditableRow(-1)
    }
    const handleCloseConfirm = () => setShowingConfirm(false)
    const handleCloseConfirmReset = () => setShowingConfirmReset(false)
    const handleDelete = () => {
        deleteWindow(R.path(["apps", appName, "appid"], windows))
        setShowingConfirm(false)
    }

    const handleResetDefault = () => {
        resetDefault()
        setShowingConfirmReset(false)
    }

    useEffect(() => {
        if (!R.isEmpty(appName))
            setShowingConfirm(true)
    }, [appName])

    useEffect(() => {
        if (!showingConfirm)
            setAppName("")
    }, [showingConfirm])

    return (
        <>
            <div>
                <Modal
                    show={settings.showing}
                    onHide={handleClose}
                    backdrop="static"
                    keyboard={false}
                    size="lg"
                    className="full-modal"
                    variant="secondary"
                >
                    <Modal.Header closeButton>
                        <Container style={{ marginLeft: 0 }}>
                            <Row>
                                <Col md={{ offset: 0 }}>
                                    <Modal.Title>Settings</Modal.Title>
                                </Col>
                                <Col md={{ offset: 3 }}>
                                    <Button onClick={() => setShowingConfirmReset(true)} variant="secondary">Reset to Default</Button>
                                </Col>
                            </Row></Container>

                    </Modal.Header>
                    <Modal.Body>
                        <table cellPadding="10" className="w-100">
                            <tbody>
                                <tr>
                                    <th>App ID</th>
                                    <th>Title</th>
                                    <th>Width</th>
                                    <th>Height</th>
                                    <th>URL</th>
                                    <th>Singleton</th>
                                    <th>Deletable</th>
                                    <th>Controls</th>
                                </tr>
                                {
                                    R.compose(R.map(([index, window]) => {
                                        return (
                                            <tr key={index}>

                                                <th>{R.prop("appid", window)}</th>
                                                {R.equals(index, editableRow) ? <th><Form.Control defaultValue={R.prop("title", window)} ref={titleRef} placeholder="Title" /></th> : <th>{R.prop("title", window)}</th>}
                                                {R.equals(index, editableRow) ? <th><Form.Control defaultValue={R.prop("width", window)} ref={widthRef} placeholder="Width" /></th> : <th>{R.prop("width", window)}</th>}
                                                {R.equals(index, editableRow) ? <th><Form.Control defaultValue={R.prop("height", window)} ref={heightRef} placeholder="Height" /></th> : <th>{R.prop("height", window)}</th>}
                                                {R.equals(index, editableRow) ? <th><Form.Control defaultValue={R.prop("url", window)} ref={urlRef} placeholder="URL" /></th> : <th>{R.prop("url", window)}</th>}
                                                {R.equals(index, editableRow) ? <th><Form.Check   defaultChecked={R.prop("single", window)} ref={singletonRef} /></th>: <th>{R.toString(R.propOr(false, "single", window))}</th>}
                                                {R.equals(index, editableRow) ? <th><Form.Check   defaultChecked={R.prop("deletable", window)} ref={deletableRef} /></th>: <th>{R.toString(R.propOr(false, "deletable", window))}</th>}
                                                <th>{renderButtons(R.prop("appid", window), index)}</th>
                                            </tr>)
                                    }),
                                        R.toPairs

                                    )(windows.apps)
                                }
                            </tbody>
                        </table>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal
                    show={showingConfirm}
                    onHide={handleCloseConfirm}
                    backdrop="static"
                    keyboard={false}
                    size="lg"
                    variant="secondary"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Confirmation</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to delete <b>{appName}</b>? All instances will be closed.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseConfirm}>
                            Close
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>Delete</Button>
                    </Modal.Footer>
                </Modal>
                <Modal
                    show={showingConfirmReset}
                    onHide={handleCloseConfirmReset}
                    backdrop="static"
                    keyboard={false}
                    size="lg"
                    variant="secondary"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>Reset to Default</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you sure you want to reset to default? All apps added and/or removed will be reset. Any open instance will be closed.
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleCloseConfirmReset}>
                            No
                        </Button>
                        <Button variant="danger" onClick={handleResetDefault}>Reset</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>

    )

}

const mapStateToProps = state => {
    return state
};

export default connect(
    mapStateToProps,
    { toggleShowing, deleteWindow, resetDefault, updateWindow }
)(Settings)
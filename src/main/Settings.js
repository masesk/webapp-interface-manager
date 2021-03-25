import React, { useState, useEffect } from 'react'
import { Button, Modal, Row, Col, Container } from 'react-bootstrap'
import { connect } from 'react-redux'
import { toggleShowing, deleteWindow, resetDefault } from '../redux/actions'
import BootstrapTable from 'react-bootstrap-table-next';
import { AiOutlineDelete } from 'react-icons/ai'

import * as R from 'ramda'





const Settings = ({ windows, settings, toggleShowing, deleteWindow, resetDefault }) => {
    const linkFormatter = (cell, row) => {
        return (
            <>
                
               { 
                R.pathEq(["apps", R.prop("appid", row), "deletable"], true, windows) &&
                    <Button onClick={() => setAppName(R.prop("appid", row))} variant="secondary" target="_blank" rel="noopener noreferrer"><AiOutlineDelete size={20} /></Button>
                }
            </>
        );

    }

    const columns = [{
        dataField: 'appid',
        text: 'ID'
    }, {
        dataField: 'title',
        text: 'Title'
    }, {
        dataField: 'url',
        text: 'URL'
    },
    {
        dataField: 'control',
        text: 'Controls',
        align: 'center',
        editable: false,
        formatter: linkFormatter,
    },
    
    
    ];
    
    const [showingConfirm, setShowingConfirm] = useState(false)
    const [appName, setAppName] = useState("")
    const [showingConfirmReset, setShowingConfirmReset] = useState(false)
    const handleClose = () => toggleShowing(false);
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

    useEffect(()=> {
        if(!R.isEmpty(appName))
            setShowingConfirm(true)
    }, [appName])

    useEffect(()=>{
        if(!showingConfirm)
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
                        <Container style={{marginLeft: 0}}>
                    <Row>
                        <Col md={{offset: 0 }}>
                        <Modal.Title>Settings</Modal.Title>
                        </Col>
                        <Col md= {{offset: 3 }}>
                        <Button onClick={()=>setShowingConfirmReset(true)}variant="secondary">Reset to Default</Button>
                        </Col>
                    </Row></Container>

                    </Modal.Header>
                    <Modal.Body>
                        <BootstrapTable
                            keyField="appid"
                            data={R.compose(
                                R.values,
                                R.map((item) => { return item })
                            )(windows.apps)}
                            columns={columns}
                        />
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
    { toggleShowing, deleteWindow, resetDefault }
)(Settings)
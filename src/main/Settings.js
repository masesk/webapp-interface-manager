import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { toggleShowing, deleteWindow, resetDefault, updateWindow } from '../redux/actions'
import { AiOutlineDelete, AiOutlineEdit, AiOutlineCheck } from 'react-icons/ai'
import * as R from 'ramda'
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Container } from '@mui/material'




const Settings = ({ windows, settings, toggleShowing, deleteWindow, resetDefault, updateWindow }) => {


    const [editableRow, setEditableRow] = useState(-1)


    const [expanded, setExpanded] = React.useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const renderButtons = (appid, index) => {
        return (
            <>
                {/* {
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
                } */}
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

            <Modal
                open={false}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    minHeight: "100vh",
                    bgcolor: "background.default"
                }}

            >
                <Container sx={{
                    position: 'absolute', left: '50%', top: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                General settings
                            </Typography>
                            <Typography sx={{ color: 'text.secondary' }}>I am an accordion</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Nulla facilisi. Phasellus sollicitudin nulla et quam mattis feugiat.
                                Aliquam eget maximus est, id dignissim quam.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2bh-content"
                            id="panel2bh-header"
                        >
                            <Typography sx={{ width: '33%', flexShrink: 0 }}>Users</Typography>
                            <Typography sx={{ color: 'text.secondary' }}>
                                You are currently not an owner
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Donec placerat, lectus sed mattis semper, neque lectus feugiat lectus,
                                varius pulvinar diam eros in elit. Pellentesque convallis laoreet
                                laoreet.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel3bh-content"
                            id="panel3bh-header"
                        >
                            <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                Advanced settings
                            </Typography>
                            <Typography sx={{ color: 'text.secondary' }}>
                                Filtering has been entirely disabled for whole web server
                            </Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                                amet egestas eros, vitae egestas augue. Duis vel est augue.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    <Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel4bh-content"
                            id="panel4bh-header"
                        >
                            <Typography sx={{ width: '33%', flexShrink: 0 }}>Personal data</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Nunc vitae orci ultricies, auctor nunc in, volutpat nisl. Integer sit
                                amet egestas eros, vitae egestas augue. Duis vel est augue.
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                </Container>


            </Modal>


            {/* <div>
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
            </div> */}
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
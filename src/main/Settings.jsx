import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { toggleShowing, deleteWindow, resetDefault, updateWindow } from '../redux/actions'
import * as R from 'ramda'
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import { Modal, Typography, Button, Tab, Tabs, TableContainer, TableBody, TableCell, TableRow, TableHead, Paper, Table, IconButton, Switch, TextField, Grid, Divider, Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent, Box } from '@mui/material'




const Settings = ({ windows, settings, toggleShowing, deleteWindow, resetDefault, updateWindow }) => {


    const [editableRow, setEditableRow] = useState(-1)



    const renderButtons = (appid, index) => {
        return (
            <>
                {
                    R.pathEq(["apps", appid, "editable"], true, windows) &&
                    <Button style={{ marginRight: 5 }} onClick={() => {
                        if (!R.equals(appid, editableRow)) {
                            setEditableRow(index)
                        }
                        else {
                            updateWindow(appid, titleRef.current.value, Number(widthRef.current.value),
                                Number(heightRef.current.value), urlRef.current.value, singletonRef.current.checked,
                                deletableRef.current.checked, R.path([appid, "editable"], window))
                            setEditableRow(-1)
                        }
                    }}
                        variant={R.equals(appid, editableRow) ? "success" : "secondary"} target="_blank" rel="noopener noreferrer">
                        {R.equals(appid, editableRow) ? <CheckIcon /> : <EditIcon size={20} />}
                    </Button>
                }
                {
                    R.pathEq(["apps", appid, "deletable"], true, windows) &&
                    <Button onClick={() => setAppName(appid)} variant="secondary" target="_blank" rel="noopener noreferrer"><DeleteIcon size={20} /></Button>
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
                open={R.propOr(false, "showing", settings)}
                onClose={handleClose}
                sx={{
                    minHeight: "100vh",
                    bgcolor: "background.default",
                    zIndex: 998
                }}

            >
                <TableContainer component={Paper} sx={{ overflow: "hidden", p: 2 }}>





                    <Grid container spacing={3} sx={{ height: 50 }}>
                        <Grid item xs={5}>
                            <Typography variant="h4">SETTINGS</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Button variant="contained" size="small" color="success" onClick={() => setShowingConfirmReset(true)}>Reset to default</Button>
                        </Grid>
                        <Grid item xs={3}>
                            <IconButton sx={{ float: "right" }} onClick={() => { toggleShowing() }}>
                                <CloseIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Divider sx={{ mb: 2, mt: 2 }} />
                    <Box sx={{ height: "calc(100vh - 125px)", overflow: "auto" }}>
                        <Tabs sx={{bgcolor: "background.paper"}} value={0} onChange={()=> {console.log()}}>
                            <Tab label="Apps"  />
                        </Tabs>
            
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>App ID</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Width</TableCell>
                                    <TableCell>Height</TableCell>
                                    <TableCell>URL</TableCell>
                                    <TableCell>Singleton</TableCell>
                                    <TableCell>Deletable</TableCell>
                                    <TableCell>Controls</TableCell>

                                </TableRow>
                            </TableHead>
                            <TableBody>

                                {
                                    R.compose(R.map(([index, window]) => {
                                        return (
                                            <TableRow key={index}>

                                                <TableCell>{R.prop("appid", window)}</TableCell>
                                                {R.equals(index, editableRow) ? <TableCell><TextField size="small" defaultValue={R.prop("title", window)} inputRef={titleRef} placeholder="Title" /></TableCell> : <TableCell>{R.prop("title", window)}</TableCell>}
                                                {R.equals(index, editableRow) ? <TableCell><TextField size="small" defaultValue={R.prop("width", window)} inputRef={widthRef} placeholder="Width" /></TableCell> : <TableCell>{R.prop("width", window)}</TableCell>}
                                                {R.equals(index, editableRow) ? <TableCell><TextField size="small" defaultValue={R.prop("height", window)} inputRef={heightRef} placeholder="Height" /></TableCell> : <TableCell>{R.prop("height", window)}</TableCell>}
                                                {R.equals(index, editableRow) ? <TableCell><TextField size="small" defaultValue={R.prop("url", window)} inputRef={urlRef} placeholder="URL" /></TableCell> : <TableCell>{R.prop("url", window)}</TableCell>}
                                                {R.equals(index, editableRow) ? <TableCell><Switch defaultChecked={R.prop("single", window)} inputRef={singletonRef} /></TableCell> : <TableCell>{R.toString(R.propOr(false, "single", window))}</TableCell>}
                                                {R.equals(index, editableRow) ? <TableCell><Switch defaultChecked={R.prop("deletable", window)} inputRef={deletableRef} /></TableCell> : <TableCell>{R.toString(R.propOr(false, "deletable", window))}</TableCell>}
                                                <TableCell>{renderButtons(R.prop("appid", window), index)}</TableCell>
                                            </TableRow>)
                                    }),
                                        R.toPairs

                                    )(windows.apps)
                                }
                            </TableBody>
                        </Table>      
                    </Box>
                </TableContainer>


            </Modal>

            <Dialog
                open={showingConfirmReset}
                sx={{ zIndex: 999 }}
                onClose={() => setShowingConfirmReset(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Reset to default?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Resetting to default will remove all added apps and reset any changes.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="error" variant="contained" onClick={() => handleResetDefault()}>Yes</Button>
                    <Button onClick={() => setShowingConfirmReset(false)}>No</Button>
                </DialogActions>
            </Dialog>

            <Dialog
                open={showingConfirm}
                sx={{ zIndex: 999 }}
                onClose={() => setShowingConfirm(false)}
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle>{"Detele app?"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-slide-description">
                        Deleting app will close all instances of the app and removed all of its data.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="error" variant="contained" onClick={() => handleDelete()}>Yes</Button>
                    <Button onClick={() => setShowingConfirm(false)}>No</Button>
                </DialogActions>
            </Dialog>
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
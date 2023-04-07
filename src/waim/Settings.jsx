import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { toggleShowing, deleteApp, resetDefault, updateApp } from '../redux/actions'
import * as R from 'ramda'
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    FormControlLabel, FormControl, Slide, Typography, Button, Tab, Tabs, TableContainer,
    TableBody, TableCell, TableRow, TableHead, Paper, Table, IconButton, Switch, TextField,
    Grid, Divider, Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent, Box, ButtonGroup
} from '@mui/material'
import UndefinedAppImage from "../img/unknown.png"



const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});


const Settings = ({ windows, settings, toggleShowing, deleteApp, resetDefault, updateApp }) => {


    const [editableRow, setEditableRow] = useState(-1)


    const renderButtons = (appid, index) => {
        return (
            <ButtonGroup variant="contained">
                {
                    R.pathEq(["apps", appid, "editable"], true, windows) &&
                    <Button variant="primary" onClick={() => {
                        if (!R.equals(appid, editableRow)) {
                            setEditableRow(index)
                        }
                        else {
                            updateApp(editableRow, titleRef.current.value, Number(widthRef.current.value),
                                Number(heightRef.current.value), urlRef.current.value, singletonRef.current.checked,
                                deletableRef.current.checked, R.path([editableRow, "editable"], window))
                            setEditableRow(-1)
                        }
                    }}>
                        <EditIcon size={20} />
                    </Button>
                }
                {
                    R.pathEq(["apps", appid, "deletable"], true, windows) &&
                    <Button variant="primary" onClick={() => setAppName(appid)}><DeleteIcon size={20} /></Button>
                }
            </ButtonGroup>
        );

    }


    const EditingPanel = () => {
        const [errors, setErrors] = useState({})
        return (
            <Dialog size="lg" fullWidth open={editableRow !== -1} onClose={() => setEditableRow(-1)}>
                <DialogTitle>Editing {R.path(["apps", editableRow, "title"], windows)}</DialogTitle>
                <DialogContent>
                    <DialogContentText>

                    </DialogContentText>
                    <TextField
                        margin="dense"
                        label="Title"
                        fullWidth
                        variant="filled"
                        required
                        inputRef={titleRef}
                        error={R.propOr(false, "title", errors)}
                        defaultValue={R.path(["apps", editableRow, "title"], windows)}

                    />
                    <TextField
                        margin="dense"
                        label="Width"
                        fullWidth
                        type="number"
                        variant="filled"
                        required
                        inputRef={widthRef}
                        error={R.propOr(false, "width", errors)}
                        defaultValue={R.path(["apps", editableRow, "width"], windows)}

                    />
                    <TextField
                        margin="dense"
                        label="Height"
                        fullWidth
                        type="number"
                        variant="filled"
                        required
                        inputRef={heightRef}
                        error={R.propOr(false, "height", errors)}
                        defaultValue={R.path(["apps", editableRow, "height"], windows)}

                    />
                    <TextField
                        margin="dense"
                        label="URL"
                        fullWidth
                        variant="filled"
                        inputRef={urlRef}
                        error={R.propOr(false, "url", errors)}
                        defaultValue={R.path(["apps", editableRow, "url"], windows)}

                    />
                    <TextField
                        margin="dense"
                        label="Image URL"
                        fullWidth
                        variant="filled"
                        inputRef={imageUrlRef}
                        error={R.propOr(false, "imageUrl", errors)}
                        defaultValue={R.path(["apps", editableRow, "imageUrl"], windows)}

                    />
                    <div><FormControlLabel control={<Switch inputRef={singletonRef} defaultChecked={R.path(["apps", editableRow, "single"], windows)} margin="dense" />} label="Singleton" /></div>
                    <div><FormControlLabel control={<Switch inputRef={deletableRef} defaultChecked={R.path(["apps", editableRow, "deletable"], windows)} margin="dense" />} label="Deletable" /></div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditableRow(-1)}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={() => {

                        const isValidNumber = R.both(R.is(Number), R.complement(R.equals(NaN)));
                        let tmpErrors = {}
                        if (R.isEmpty(titleRef.current.value)) {
                            tmpErrors = R.assoc("title", true, tmpErrors)
                        }
                        if (R.isEmpty(widthRef.current.value) || !isValidNumber(Number(widthRef.current.value))) {
                            tmpErrors = R.assoc("width", true, tmpErrors)
                        }

                        if (R.isEmpty(heightRef.current.value) || !isValidNumber(Number(heightRef.current.value))) {
                            tmpErrors = R.assoc("height", true, tmpErrors)
                        }
                        if (!R.isEmpty(tmpErrors)) {
                            setErrors(tmpErrors)
                            return
                        }



                        updateApp(editableRow, titleRef.current.value, Number(widthRef.current.value),
                            Number(heightRef.current.value), urlRef.current.value, singletonRef.current.checked,
                            deletableRef.current.checked, R.path([editableRow, "editable"], window), imageUrlRef.current.value); setEditableRow(-1)
                    }}>Save</Button>
                </DialogActions>
            </Dialog>
        )
    }



    const titleRef = useRef()
    const widthRef = useRef()
    const heightRef = useRef()
    const urlRef = useRef()
    const imageUrlRef = useRef()
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
        deleteApp(R.path(["apps", appName, "appid"], windows))
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

            <Dialog
                open={R.propOr(false, "showing", settings)}
                onClose={handleClose}
                fullScreen
                TransitionComponent={Transition}
                sx={{
                    bgcolor: "background.default"
                }}

            >




                <Box sx={{ p: 2 }}>
                    <Grid container spacing={3} sx={{ height: 50 }}>
                        <Grid item xs={5}>
                            <Typography variant="h6">SETTINGS</Typography>
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
                    <Box>
                        <Tabs sx={{ bgcolor: "background.paper" }} value={0}>
                            <Tab label="Apps" />
                        </Tabs>
                        <Box component={Paper}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>App ID</TableCell>
                                            <TableCell>Image</TableCell>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Width</TableCell>
                                            <TableCell>Height</TableCell>
                                            <TableCell>URL</TableCell>
                                            <TableCell>Singleton</TableCell>
                                            <TableCell>Controls</TableCell>

                                        </TableRow>
                                    </TableHead>
                                    <TableBody>

                                        {
                                            R.compose(R.map(([index, window]) => {
                                                return (
                                                    <TableRow key={index}>

                                                        <TableCell title={R.prop("appid", window)}>{R.prop("appid", window)}</TableCell>
                                                        <TableCell className="settings-cell" title={R.prop("imageUrl", window)}><img onError={(e)=>(e.target.src=UndefinedAppImage)} width="20px" height="20px" src={R.propOr(UndefinedAppImage, "imageUrl", window)}/></TableCell>
                                                        <TableCell className="settings-cell" title={R.prop("title", window)}>{R.prop("title", window)}</TableCell>
                                                        <TableCell className="settings-cell" title={R.prop("width", window)}>{R.prop("width", window)}</TableCell>
                                                        <TableCell className="settings-cell" title={R.prop("height", window)}>{R.prop("height", window)}</TableCell>
                                                        <TableCell className="settings-cell" title={R.prop("url", window)}>{R.prop("url", window)}</TableCell>
                                                        <TableCell> {R.prop("single", window) && <CheckIcon />}</TableCell>
                                                        <TableCell>{renderButtons(R.prop("appid", window), index)}</TableCell>
                                                    </TableRow>)
                                            }),
                                                R.toPairs

                                            )(windows.apps)
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    </Box>
                </Box>


            </Dialog>

            <Dialog
                open={showingConfirmReset}
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
            <EditingPanel />
        </>

    )

}

const mapStateToProps = state => {
    return state
};

export default connect(
    mapStateToProps,
    { toggleShowing, deleteApp, resetDefault, updateApp }
)(Settings)
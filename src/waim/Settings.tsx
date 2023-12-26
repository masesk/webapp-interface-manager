import React, { useState, useEffect, useRef } from 'react'
// import { toggleShowing, deleteApp, resetDefault, updateApp } from './redux/actions'
import * as R from 'ramda'
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    FormControlLabel, Slide, Typography, Button, Tab, Tabs, TableContainer,
    TableBody, TableCell, TableRow, TableHead, Paper, Table, IconButton, Switch, TextField,
    Grid, Divider, Dialog, DialogActions, DialogTitle, DialogContentText, DialogContent, Box, ButtonGroup
} from '@mui/material'
import { TransitionProps } from '@mui/material/transitions';
import UndefinedAppImage from "../img/unknown.png"
import { selectSettings, toggleSettings } from './redux/reducers/settingsSlice';
import { useAppDispatch, useAppSelector } from './redux/hooks';
import { deleteApp, resetDefault, selectWindows, updateApp } from './redux/reducers/windowsSlice';



const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<any, any>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

interface SettingsProps {
    windows: any,
    settings: any
}


const Settings = () => {
    
    const windows = useAppSelector(selectWindows)
    const settings = useAppSelector(selectSettings)
    const dispatch = useAppDispatch()

    const [editableRow, setEditableRow] = useState<string>("")

    const renderButtons = (appid: string, index: string) => {
        return (
            <ButtonGroup variant="contained">
                {
                    R.path(["apps", appid, "editable"], windows) && 
                    <Button onClick={() => {
                        if (!R.equals<string>(appid, editableRow)) {
                            setEditableRow(index)
                        }
                        else {
                            dispatch(updateApp(
                                {
                                    appid: editableRow,
                                    title: titleRef.current?.value,
                                    width: Number(widthRef.current?.value),
                                    height: Number(heightRef.current?.value),
                                    url: urlRef.current?.value,
                                    single: singletonRef.current?.checked,
                                    deletable: deletableRef.current?.checked,
                                    editable: R.pathOr(true, [editableRow, "editable"], window),
                                    imageUrl: imageUrlRef.current?.value

                                }))
                            setEditableRow("")
                        }
                    }}>
                        <EditIcon fontSize={"small"} />
                    </Button>
                }
                {
                    R.path(["apps", appid, "deletable"], windows) &&
                    <Button onClick={() => setAppName(appid)}><DeleteIcon fontSize={"small"} /></Button>
                }
            </ButtonGroup>
        );

    }


    const EditingPanel = () => {
        const [errors, setErrors] = useState({})
        return (
            <Dialog TransitionComponent={Transition} fullWidth open={!R.isEmpty(editableRow)} onClose={() => setEditableRow("")}>
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
                    <div><FormControlLabel control={<Switch inputRef={singletonRef} defaultChecked={R.path(["apps", editableRow, "single"], windows)} />} label="Singleton" /></div>
                    <div><FormControlLabel control={<Switch inputRef={deletableRef} defaultChecked={R.path(["apps", editableRow, "deletable"], windows)}  />} label="Deletable" /></div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditableRow("")}>Cancel</Button>
                    <Button variant="contained" color="primary" onClick={() => {

                        const isValidNumber = R.both(R.is(Number), R.complement(R.equals(NaN)));
                        let tmpErrors = {}
                        if (R.isEmpty(titleRef.current?.value)) {
                            tmpErrors = R.assoc("title", true, tmpErrors)
                        }
                        if (R.isEmpty(widthRef.current?.value) || !isValidNumber(Number(widthRef.current?.value))) {
                            tmpErrors = R.assoc("width", true, tmpErrors)
                        }

                        if (R.isEmpty(heightRef.current?.value) || !isValidNumber(Number(heightRef.current?.value))) {
                            tmpErrors = R.assoc("height", true, tmpErrors)
                        }
                        if (!R.isEmpty(tmpErrors)) {
                            setErrors(tmpErrors)
                            return
                        }



                        dispatch(updateApp(
                            {
                                appid: editableRow,
                                title: titleRef.current?.value,
                                width: Number(widthRef.current?.value),
                                height: Number(heightRef.current?.value),
                                url: urlRef.current?.value,
                                single: singletonRef.current?.checked,
                                deletable: deletableRef.current?.checked,
                                editable: R.pathOr(true, [editableRow, "editable"], window),
                                imageUrl: imageUrlRef.current?.value

                            })); setEditableRow("")
                    }}>Save</Button>
                </DialogActions>
            </Dialog>
        )
    }



    const titleRef = useRef<HTMLInputElement>()
    const widthRef = useRef<HTMLInputElement>()
    const heightRef = useRef<HTMLInputElement>()
    const urlRef = useRef<HTMLInputElement>()
    const imageUrlRef = useRef<HTMLInputElement>()
    const deletableRef = useRef<HTMLInputElement>()
    const singletonRef = useRef<HTMLInputElement>()

    const [showingConfirm, setShowingConfirm] = useState(false)
    const [appName, setAppName] = useState("")
    const [showingConfirmReset, setShowingConfirmReset] = useState(false)
    const handleClose = () => {
        dispatch(toggleSettings(false))
        setEditableRow("")
    }
    const handleDelete = () => {
        dispatch(deleteApp(R.path(["apps", appName, "appid"], windows)))
        setShowingConfirm(false)
    }

    const handleResetDefault = () => {
        dispatch(resetDefault())
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
                TransitionComponent={Transition}
                fullScreen
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
                            <IconButton sx={{ float: "right" }} onClick={() => { dispatch(toggleSettings(false)) }}>
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
                                                        <TableCell className="settings-cell" title={R.prop("imageUrl", window)}><img onError={(e:any)=>(e.target.src=UndefinedAppImage)} width="20px" height="20px" src={R.propOr(UndefinedAppImage, "imageUrl", window)}/></TableCell>
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

export default Settings;
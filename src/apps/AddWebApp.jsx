import React, { useEffect, useRef, useState } from 'react';
import { TextField, Box, Button, Switch, FormControlLabel, Typography, Backdrop, CircularProgress } from '@mui/material';
import * as R from 'ramda'
const AddWebApp = () => {
  const title = useRef();
  const url = useRef();
  const id = useRef();
  const width = useRef()
  const height = useRef()
  const imageUrl = useRef()
  const [titleError, setTitleError] = useState(false)
  const [idError, setIdError] = useState(false)
  const [urlError, setUrlError] = useState(false)
  const [whError, setWhError] = useState(false)
  const [single, setSingle] = useState(false)
  const [deletable, setDeletable] = useState(true)
  const [editable, setEditable] = useState(true)
  const [waimExists, setWaimExists] = useState(true)
  const [awaitingCreationResponse, setAwaitingCreationResponse] = useState(false)
  const messageHandlerRef = useRef()
  const lastSentId = useRef()

  useEffect(() => {
    const waim = window.waim
    if (waim === undefined) {
      setWaimExists(false)
      return
    }
    const messageHandler = waim.messageHandler
    if (messageHandler === undefined) {
      setWaimExists(false)
      return
    }

    messageHandlerRef.current = messageHandler
    messageHandlerRef.current.listen("__create_new_app_response__", (data) => {
      if (data.id === lastSentId.current) {
        setAwaitingCreationResponse(false)
      }
    })
    setWaimExists(true)
  }, [waimExists])


  useEffect(() => {
    return () => {

    }
  }, [])

  useEffect(() => {
    if (awaitingCreationResponse) {
      messageHandlerRef.current.publish("__create_new_app__",
        {
          id: id.current.value,
          title: title.current.value,
          width: Number(width.current.value),
          height: Number(height.current.value),
          url: url.current.value,
          single, deletable, editable, 
          imageUrl: imageUrl.current.value

        }

      )
    }
  }, [awaitingCreationResponse])

  return (

    <Box
      component="form"
      sx={{
        p: 5,
        h: "100%",
        overflow: 'auto',
        zIndex: 0
      }}
      noValidate
      autoComplete="off"
      height="100%"
      bgcolor={"background.paper"}
    >

      {waimExists ? <div>

        <div>
          {awaitingCreationResponse && <Backdrop
            sx={{ color: '#fff', zIndex: 999, position: "absolute" }}
            open={true}
          >
            <CircularProgress color="inherit" />
          </Backdrop>}
          <TextField
            helperText={idError === true ? "ID cannot be empty" : ""}
            label="App ID"
            size="small"
            fullWidth
            variant="filled"
            error={idError}
            inputRef={id}
          /></div>
        <div>
          <TextField
            error={titleError}
            label="Title"
            size="small"
            fullWidth
            variant="filled"
            inputRef={title}
            helperText={titleError === true ? "Title cannot be empty" : ""}
          /></div>
        <div>
          <TextField
            label="Default Width"
            error={whError}
            size="small"
            type="number"
            fullWidth
            variant="filled"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            helperText={whError === true ? "Height cannot be empty and must be a number" : ""}
            inputRef={width}
          />
        </div>
        <div>
          <TextField
            error={whError}
            label="Default Height"
            size="small"
            type="number"
            fullWidth
            variant="filled"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            helperText={whError === true ? "Height cannot be empty and must be a number" : ""}
            inputRef={height}
          /></div>
        <div>
          <TextField
            label="URL"
            size="small"
            fullWidth
            variant="filled"
            error={urlError}
            helperText={urlError === true ? "Must be URL and cannot be empty" : ""}
            inputRef={url}
          />
          </div>
          <div>
          <TextField
            label="Image URL"
            size="small"
            fullWidth
            variant="filled"
            inputRef={imageUrl}
          />
          </div>
        <div>
          <FormControlLabel control={<Switch onChange={(e) => setSingle(e.target.checked)} />} label="Singleton" /></div>
        <div> <FormControlLabel control={<Switch defaultChecked={true} onChange={(e) => setEditable(e.target.checked)} />} label="Editable" /></div>
        <div><FormControlLabel control={<Switch defaultChecked={true} onChange={(e) => setDeletable(e.target.checked)} />} label="Deletable" /></div>
        <div>
          <Button variant="contained" color="success"
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

              lastSentId.current = id.current.value
              setAwaitingCreationResponse(true)


            }
            }
          >
            Submit
          </Button>
         
        </div>
      </div> : <Typography variant="h5">Cannot add new apps unless you are running within the WAIM framework</Typography>}
    </Box>

  )
}

export default AddWebApp;
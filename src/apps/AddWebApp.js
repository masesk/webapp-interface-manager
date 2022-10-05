import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux'
import { createWindow, updateIndex } from "../redux/actions";
import { FormControl, InputLabel, TextField, Box, Button, Switch, FormControlLabel } from '@mui/material';
import * as R from 'ramda'
const AddWebApp = ({ createWindow }) => {
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
      <div>
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
          helperText={urlError == true ? "Must be URL and cannot be empty" : ""}
          inputRef={url}
        /></div>
      <div>
        <FormControlLabel control={<Switch />} label="Singleton" /></div>
      <div> <FormControlLabel control={<Switch />} label="Editable" /></div>
      <div><FormControlLabel control={<Switch />} label="Deletable" /></div>
      <div>
        <Button variant="contained" color="success"
          onClick={e => {
            const isValidNumber = R.both(R.is(Number), R.complement(R.equals(NaN)));
            let error = false
            console.log(id.current.value)
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
        {success && <div>App created successfully!</div>}
      </div>
    </Box>

  )
}

export default connect(
  null,
  { createWindow }
)(AddWebApp)
import React, { useEffect, useState, useRef } from 'react';
import { TextField, Box, FormGroup, IconButton } from "@mui/material"
import SendIcon from '@mui/icons-material/Send';
const ChatClient = () => {
  const [messages, setMessages] = useState("Welcome to the Chat!\n")
  const [name, setName] = useState("")
  const [message, setMessage] = useState("")
  const chatboxRef = useRef()
  const messageHandlerRef = useRef({
    publish: (data) => { console.warn("Not properly hooked to waim message handler") },
    listen: (channelName, callback) => { console.warn("Not properly hooked to waim message handler") }
  })
  useEffect(() => {
    const waim = window.waim
    if (waim === undefined) return
    const messageHandler = waim.messageHandler
    if (messageHandler === undefined) return
    messageHandlerRef.current = messageHandler
    messageHandlerRef.current.listen("chatbox_messages", ({ name, message }) => {
      setMessages(f => { return f + `${name}: ${message}\n` })
    })
  }, [])

  useEffect(()=> {
    chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight
  }, [messages])

  const sendMessage = () => {
    messageHandlerRef.current.publish("chatbox_messages", {name, message})
    setMessage("")
  }

  return (
    <Box sx={{ p: "5%", bgcolor: "background.paper", height: "100%" }} >
      <FormGroup row={false}>
        <TextField fullWidth sx={{ mb: 2 }} id="name" label="Name" variant="outlined" value={name} onChange={(e)=> {setName(e.target.value)}} />
        <Box sx={{ height: "inherit", display: "block" }}>
          <TextField
            fullWidth
            inputRef={chatboxRef}
            sx={{ textAlign: "left", height: "300px", display: "block" }}
            multiline
            rows={10}
            value={messages}
            onChange={()=> console.log(chatboxRef)}
            InputProps={{
              readOnly: true,
              style: {
                height: "300px",
                textAlign: "start",
                display: "block"
              }
            }} />
        </Box>
        <TextField 
        onKeyDown={(e) => {
          if(e.key == "Enter") sendMessage()
        }}
        fullWidth id="message" label="Message" variant="outlined" value={message} onChange={(e) => setMessage(e.target.value)} 
        InputProps={{ endAdornment: <IconButton onClick={()=> {
          sendMessage()
        }}><SendIcon /></IconButton> }} />
      </FormGroup>
    </Box>
  )
}

export default ChatClient;
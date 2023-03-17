import React, { useEffect, useState, useRef } from 'react';
const Sender = () => {
   const [count, setCount] = useState(0)
   const messageHandlerRef = useRef({
      publish: (data)=> {console.warn("Not properly hooked to waim message handler")},
      listen: (channelName, callback) => {console.warn("Not properly hooked to waim message handler")}
   })

   useEffect(() => {
      const waim = window.waim
      if (waim === undefined) return
      const messageHandler = waim.messageHandler
      if (messageHandler === undefined) return
      messageHandlerRef.current = messageHandler
   }, [window.waim])

   useEffect(() => {
      messageHandlerRef.current.publish("count", count)
   }, [count])
   return (
      <>
         <p>Button has been clicked {count} times!</p>
         <button onClick={() => {
            setCount(count + 1)
         }}>Click me!</button>
      </>
   )
}

export default Sender;
import React, {useEffect, useState } from 'react';
const Sender = () => {
  const [count, setCount] = useState(0)
  const messageHandler = window.messageHandler
  useEffect(()=>{
   if(messageHandler !== undefined){
      messageHandler.publish("count", count)
   }
  }, [count, messageHandler])
  return (
      <>
      <p>Button has been clicked {count} times!</p>
      <button onClick={()=>{
         setCount(count+1)
      }}>Click me!</button>
      </>
   )
}

export default Sender;
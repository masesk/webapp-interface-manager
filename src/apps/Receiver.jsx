import React, {useEffect, useState } from 'react';
const Receiver = () => {
  const [count, setCount] = useState(0)
  const messageHandler = window.messageHandler
  useEffect(()=>{
    if(messageHandler !== undefined){
        messageHandler.listen("count", (count)=> {
            setCount(f => {return count})
        })
    }
  }, [messageHandler])
  return (
      <>
      <p>Button has been clicked {count} times!</p>
      </>
   )
}

export default Receiver;
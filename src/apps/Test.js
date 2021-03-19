import React, {useState } from 'react';
const Test = () => {
  const [count, setCount] = useState(0)
  return (
      <>
      <p>Button has been clicked {count} times!</p>
      <button onClick={()=>setCount(count+1)}>Click me!</button>
      </>
   )
}

export default Test;
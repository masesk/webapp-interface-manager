import React, { useState, useRef, useEffect } from 'react';
import '../css/App.css';
import { MdClose, MdCropSquare, MdRemove, MdFilterNone } from 'react-icons/md';
import { Spinner } from 'react-bootstrap'
import '../css/boostrap.min.css'
import * as R from 'ramda'
import { hideWindow, updateIndex, minimizeWindow } from "../redux/actions";

import { connect } from "react-redux";

function Window({ title, width, height, url, id, children, minimized, updateIndex, hideWindow, minimizeWindow, zIndex}) {
  const frameRef = useRef()
  const windowRef = useRef()
  const topRef = useRef()
  const ref = useRef()
  const [dimension, setDimension] = useState({ width: width, height: height })
  const [loading, setLoading] = useState(true)
  const [frameStyle, setFrameStyle] = useState(
    {zIndex: zIndex, width: width + 6, paddingBottom: `${height + 4}px`}
  )
  const [maximized, setMaximized] = useState(false)

  const max = useRef(false)

  const isInitialMount = useRef(true);
  const saveDimensions = useRef({})
  const currentX = useRef()
  const currentY = useRef()
  const initialX = useRef()
  const initialY = useRef()
  const xOffset = useRef(0)
  const yOffset = useRef(0)
  const active = useRef(false)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (maximized) {

        setFrameStyle(f => R.merge(f, {
          transform: "none",
          width: "100%",
          height: "calc(100% - 40px)"
        }))

        windowRef.current.style.width = "100%"
        windowRef.current.style.height = "calc(100% - 40px)"
        topRef.current.style.width = "100%"
        setTranslate(0, 0)

      }
      else {
        setFrameStyle(f => R.merge(f, {
          transform: "none",
          width: null,
          height: null,
          paddingBottom : `${dimension.height + 4}px`

        }))
        setTranslate(currentX.current, currentY.current)

      }
    }
  }, [maximized])

  useEffect(() => {
    setFrameStyle(f => R.merge(f, {
      zIndex: zIndex
    }))
  }, [zIndex])

  useEffect(()=> {
    if(minimized){
      setFrameStyle(f => R.merge(f, {
        display: "none"
      }))
    }
    else{
      setFrameStyle(f=> R.merge(f, {
        display: "block"
      }))
    }
  }, [minimized])

  useEffect(()=> {
    window.addEventListener('resize', ()=>{
        if(max.current){
          setDimension({ width: window.parent.innerWidth, height: window.parent.innerHeight - 75 })
        }
      
    });
  }, [])


  function dragStart(e) {
    active.current = true;
    ref.current.style.zIndex = 1
    e.stopPropagation()
    if (e.type === "touchstart") {
      initialX.current = e.touches[0].clientX - xOffset.current;
      initialY.current = e.touches[0].clientY - yOffset.current;
    } else {
      initialX.current = e.clientX - xOffset.current;
      initialY.current = e.clientY - yOffset.current;
    }
    if(zIndex !== 1){
      updateIndex(id)
    }

  }
  

  const dragEnd = (e) => {
    initialX.current = currentX.current;
    initialY.current = currentY.current;

    active.current = false;
    //updateIndex(id)
  }

  const drag = (e) => {
    if (active.current && !maximized) {
      e.preventDefault();

      if (e.type === "touchmove") {
        currentX.current = e.touches[0].clientX - initialX.current;
        currentY.current = e.touches[0].clientY - initialY.current;
      } else {
        currentX.current = e.clientX - initialX.current;
        currentY.current = e.clientY - initialY.current;
      }

      xOffset.current = currentX.current;
      yOffset.current = currentY.current;

      setTranslate(currentX.current, currentY.current);
    }
  }

  const setTranslate = (xPos, yPos) => {
    ref.current.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    
  }

  const stopPropagation = (event) => {
    if (event.stopPropagation) event.stopPropagation();
    if (event.preventDefault) event.preventDefault();
    event.cancelBubble = true;
    event.returnValue = false;
  }


  return (
    <>
       <div className="frame" style={frameStyle} ref={ref}>
        <div onMouseDown={dragStart} onMouseUp={dragEnd} ref={topRef} onMouseMove={drag} className="topbar" style={{ width: `${dimension.width}px`}}>
          <MdClose onMouseDown={(event) => { stopPropagation(event) }} onClick={()=> {hideWindow(id)}} className="hover" size={21} />
          {maximized ? <MdFilterNone className="hover" size={21} onClick={() => {
            max.current = false
            setMaximized(!maximized)
            setDimension({ width: saveDimensions.current.width, height: saveDimensions.current.height })

          }
          } />
            : <MdCropSquare onClick={() => {
              max.current = true
              saveDimensions.current = { width: dimension.width, height: dimension.height }
              setMaximized(!maximized)
              setDimension({ width: window.parent.innerWidth - 7, height: window.parent.innerHeight - 75 })

            }} className="hover" size={21} />

          }
          <MdRemove onClick={()=>{minimizeWindow(id)}} className="hover" size={21} />
          <h5 className={"float-right"}>{title}</h5>

        </div>
        <div className="window" ref={windowRef} style={{ width: `${dimension.width}px`, height: `${dimension.height}px` }}>
          {children && children}
          {loading && !children && <Spinner size="lg" animation="border" variant="secondary" className="frameloading" />}
          <iframe ref={frameRef} onLoad={() => setLoading(false)} frameBorder="0" title={title} src={url} className={"framestyle"} height={`${dimension.height}px`} width={`${dimension.width}px`} />
        </div>
      </div>
    </>
  );
}


const connectAndForwardRef = (
  mapStateToProps = null,
  mapDispatchToProps = null,
  mergeProps = null,
  options = {},
) => component => connect(
  mapStateToProps,
  mapDispatchToProps,
  mergeProps,
  {
    ...options,
    forwardRef: true,
  },
)(React.forwardRef(component));

const ConnectedWindow = connectAndForwardRef(null, {hideWindow, updateIndex, minimizeWindow})(Window)

export default ConnectedWindow;

//export default React.forwardRef(Window);


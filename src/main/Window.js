import React, { useState, useRef, useEffect } from 'react';
import '../css/App.css';
import { MdClose, MdCropSquare, MdRemove, MdFilterNone } from 'react-icons/md';
import { Spinner } from 'react-bootstrap'
import '../css/boostrap.min.css'
import * as R from 'ramda'
import { hideWindow } from "../redux/actions";


import { connect } from "react-redux";
//import { VISIBILITY_FILTERS } from "../constants";

function Window({ initTitle, initWidth, initHeight, initUrl, id, children, clickCallback, hideWindow}, ref) {
  const frameRef = useRef()
  const windowRef = useRef()
  const topRef = useRef()
  const [dimension, setDimension] = useState({ width: initWidth, height: initHeight })
  const [title, setTitle] = useState(initTitle)

  const [url, setURL] = useState(initUrl)
  const [loading, setLoading] = useState(true)
  const [frameStyle, setFrameStyle] = useState({
    paddingBottom: `${dimension.height + 4}px`
  })
  const [maximized, setMaximized] = useState(false)

  const isInitialMount = useRef(true);
  const saveDimensions = useRef({})
  const currentX = useRef()
  const currentY = useRef()
  const initialX = useRef()
  const initialY = useRef()
  const xOffset = useRef(0)
  const yOffset = useRef(0)

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (maximized) {

        setFrameStyle(R.merge(frameStyle, {
          transform: "none",
          width: "100%",
          height: "100%"
        }))

        windowRef.current.style.width = "100%"
        windowRef.current.style.height = "100%"
        topRef.current.style.width = "100%"
        setTranslate(0, 0)

      }
      else {
        setFrameStyle(R.merge(frameStyle, {
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
    
  }, [])


  var active = false;
  function dragStart(e) {
    clickCallback(id)
    e.stopPropagation()
    if (e.type === "touchstart") {
      initialX.current = e.touches[0].clientX - xOffset.current;
      initialY.current = e.touches[0].clientY - yOffset.current;
    } else {
      initialX.current = e.clientX - xOffset.current;
      initialY.current = e.clientY - yOffset.current;
    }

    active = true;
  }

  function dragEnd(e) {
    initialX.current = currentX.current;
    initialY.current = currentY.current;

    active = false;
  }

  function drag(e) {
    if (active && !maximized) {
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

  function setTranslate(xPos, yPos) {
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
        <div onMouseDown={dragStart} onMouseLeave={dragEnd} onMouseUp={dragEnd} ref={topRef} onMouseMove={drag} className="topbar" style={{ width: `${dimension.width}px` }}>
          <MdClose onMouseDown={(event) => { stopPropagation(event) }} onClick={()=> {hideWindow(id); console.log("should be hiding")}} className="hover" size={21} />
          {maximized ? <MdFilterNone className="hover" size={21} onClick={() => {

            setMaximized(!maximized)
            setDimension({ width: saveDimensions.current.width, height: saveDimensions.current.height })

          }
          } />
            : <MdCropSquare onClick={() => {
              saveDimensions.current = { width: dimension.width, height: dimension.height }
              setMaximized(!maximized)
              setDimension({ width: window.parent.innerWidth - 7, height: window.parent.innerHeight - 75 })

            }} className="hover" size={21} />

          }
          <MdRemove className="hover" size={21} />
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

const ConnectedWindow = connectAndForwardRef(null, {hideWindow})(Window)

export default ConnectedWindow;

//export default React.forwardRef(Window);


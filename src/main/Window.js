import React, { useState, useRef, useEffect } from 'react';
import '../css/App.css';
import { MdClose, MdCropSquare, MdRemove, MdFilterNone } from 'react-icons/md';
import { Spinner } from 'react-bootstrap'
import '../css/boostrap.min.css'
import * as R from 'ramda'
import { hideWindow, updateIndex, minimizeWindow } from "../redux/actions";

import { connect } from "react-redux";

function Window({ title, width, height, url, appid, children, minimized, updateIndex, hideWindow, minimizeWindow, zIndex, index, viewid }) {
  const frameRef = useRef()
  const windowRef = useRef()
  const topRef = useRef()
  const ref = useRef()
  const [dimension, setDimension] = useState({ width: width, height: height })
  const [loading, setLoading] = useState(true)
  const [frameStyle, setFrameStyle] = useState(
    {
      pointerEvents: "none",
      top: 0,
      position: "absolute", zIndex: zIndex, width: `${width + 600}px`, paddingBottom: `${height + 500}px`, paddingTop: `300px`, paddingLeft: "300px"
    }
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
          top: 50,
          width: "100%",
          height: "calc(100% - 30px)",
          paddingBottom: 0,
          paddingTop: 0,
          paddingLeft: 0

        }))

        windowRef.current.style.width = "100%"
        topRef.current.style.width = "100%"
        setTranslate(0, 0)

      }
      else {
        setTranslate(currentX.current, currentY.current)
        setFrameStyle(f => R.merge(f, {
          top: 0,
          height: null,
          position: "absolute",
          width: `${width + 600}px`,
          paddingBottom: `${height + 500}px`,
          paddingTop: `300px`,
          paddingLeft: "300px",


        }))

      }
    }
  }, [maximized])

  useEffect(() => {
    setFrameStyle(f => R.merge(f, {
      zIndex: zIndex
    }))
  }, [zIndex])

  useEffect(() => {
    if (minimized) {
      setFrameStyle(f => R.merge(f, {
        display: "none"
      }))
    }
    else {
      setFrameStyle(f => R.merge(f, {
        display: "block"
      }))
    }
  }, [minimized])



  useEffect(() => {
    setTranslate(-300, -250)
    xOffset.current = -300
    yOffset.current = -250
    currentX.current = -300
    currentY.current = -250
    window.addEventListener('resize', () => {
      if (max.current) {
        setDimension({ width: window.parent.innerWidth - 7, height: window.parent.innerHeight - 137 })
      }

    });
  }, [])


  function dragStart(e) {
    active.current = true;
    e.stopPropagation()
    if (e.type === "touchstart") {
      initialX.current = e.touches[0].clientX - xOffset.current;
      initialY.current = e.touches[0].clientY - yOffset.current;
    } else {
      initialX.current = e.clientX - xOffset.current;
      initialY.current = e.clientY - yOffset.current;
    }
    updateIndex(viewid)
    setFrameStyle(
      R.assoc("pointerEvents", "auto", frameStyle)
    )

  }


  const dragEnd = (e) => {
    initialX.current = currentX.current;
    initialY.current = currentY.current;

    active.current = false;
    stopPropagation(e)
    setFrameStyle(
      R.assoc("pointerEvents", "none", frameStyle)
    )
  }

  const drag = (e) => {
    if (active.current && !maximized) {
      stopPropagation(e)

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



  const stopPropagation = (e) => {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault) e.preventDefault();
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
  }


  return (
    <>
      <div className="frame" onMouseMove={drag} style={frameStyle} ref={ref}>
        <div className="frame-border" style={
          R.compose(
            R.assoc("paddingTop", 4),
            R.assoc("paddingLeft", 4),
            R.assoc("paddingRight", 4),
            R.assoc("width", (maximized ? R.prop("width", frameStyle) : null)),
            R.assoc("top", null),
            R.assoc("paddingBottom", `${height + 5}px`),
            R.assoc("pointerEvents", "auto")
          )(frameStyle)

        }>
          <div onMouseDown={dragStart} onMouseUp={dragEnd} ref={topRef} onMouseMove={drag} className="topbar" style={{ width: `${dimension.width}px` }}>
            <MdClose onMouseDown={(event) => { stopPropagation(event) }} onClick={() => { hideWindow(index) }} className="hover" size={21} />
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
                setDimension({ width: window.parent.innerWidth - 7, height: window.parent.innerHeight -  137})

              }} className="hover" size={21} />

            }
            <MdRemove onClick={() => { minimizeWindow(index) }} className="hover" size={21} />
            <h5 className={"float-right"}>{title}</h5>

          </div>
          <div className="window" ref={windowRef} style={{ width: `${dimension.width}px`, height: `${dimension.height}px`, pointerEvents: (R.propEq("pointerEvents", "auto", frameStyle) ? "none" : "auto"), overflow: (R.isNil(children) ? "hidden" : "auto")  }}>
            {children && children}
            {loading && !children && <Spinner size="lg" animation="border" variant="secondary" className="frameloading" />}
            {!children && <iframe key={viewid}  ref={frameRef} onLoad={() => setLoading(false)} frameBorder="0" title={title} src={url} className={"framestyle"} height={`${dimension.height}px`} width={`${dimension.width}px`}/>}
          </div>
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

const ConnectedWindow = connectAndForwardRef(null, { hideWindow, updateIndex, minimizeWindow })(Window)

export default ConnectedWindow;

//export default React.forwardRef(Window);


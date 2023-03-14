import React, { useState, useRef, useEffect } from 'react';
import '../css/App.css';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import * as R from 'ramda'
import { hideWindow, updateIndex, minimizeWindow } from "../redux/actions";
import {Box} from '@mui/material';
import { MAX_HEIGHT_PX, MAX_WIDTH_PX } from '../constants';
import { connect } from "react-redux";

function Window({ title, width, height, url, appid, children, minimized, updateIndex, hideWindow, minimizeWindow, zIndex, index, viewid }) {
  const frameRef = useRef()
  const windowRef = useRef()
  const topRef = useRef()
  const ref = useRef()
  const dimension = useRef({ width, height })
  const [loading, setLoading] = useState(true)
  const [frameStyle, setFrameStyle] = useState(
    {
      pointerEvents: "none",
      top: 0,
      position: "fixed", zIndex: zIndex, width: `${dimension.current.width + 600}px`, paddingBottom: `${dimension.current.height + 500}px`, paddingTop: `300px`, paddingLeft: "300px"
    }
  )
  const [maximized, setMaximized] = useState(false)

  const max = useRef(false)

  const isInitialMount = useRef(true);
  const savedimension = useRef({})
  const currentX = useRef()
  const currentY = useRef()
  const initialX = useRef()
  const initialY = useRef()
  const xOffset = useRef(0)
  const yOffset = useRef(0)
  const active = useRef(false)
  const resizeDrag = useRef(false)

  const initialRx = useRef(0)
  const initialRy = useRef(0)

  
  const expandDragChangeX = useRef(0)
  const expandDragChangeY = useRef(0)

  const resizeShadowRef = useRef()

  useEffect(() => {
    dimension.current = { width, height }
    setTranslate(-300, -250)
    xOffset.current = -300
    yOffset.current = -250
    currentX.current = -300
    currentY.current = -250
    window.addEventListener('resize', () => {
      if (max.current) {
        dimension.current.width = window.parent.innerWidth - 7
        dimension.current.height = window.parent.innerHeight - 137
        setFrameStyle(f => R.merge(f, {

          transform: "none",
          top: 50,
          width: "100%",
          height: "calc(100% - 30px)",
          paddingBottom: 0,
          paddingTop: 0,
          paddingLeft: 0

        }))
      }

    });

    window.addEventListener('mouseup', expandDragEnd);
  }, [])

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
          height: `${dimension.current.height + 600}px`,
          position: "fixed",
          width: `${dimension.current.width + 600}px`,
          paddingBottom: `${dimension.current.height + 500}px`,
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





  const expandDragStart = (e) => {
    if (e.type === "touchstart") {
      initialRx.current = e.touches[0].clientX;
      initialRy.current = e.touches[0].clientY;
    } else {
      initialRx.current = e.clientX;
      initialRy.current = e.clientY;
    }
    resizeDrag.current = true
    stopPropagation(e)
    setFrameStyle(R.clone(frameStyle))
    updateIndex(viewid)

  }

  const expandDragEnd = (e) => {
    if (!resizeDrag.current) {
      return
    }
    let changeX;
    let changeY;
    if (e.type === "touchend") {
      changeX = e.changedTouches[0].clientX - initialRx.current
      changeY = e.changedTouches[0].clientY - initialRy.current
    } else {
      changeX = e.clientX - initialRx.current;
      changeY = e.clientY - initialRy.current;
    }
    if (R.isNil(changeX) || R.isNil(changeY)) {
      return
    }
    stopPropagation(e)
    resizeDrag.current = false
    dimension.current.width = dimension.current.width + changeX
    dimension.current.height = dimension.current.height + changeY
    if (dimension.current.width < MAX_WIDTH_PX) {
      dimension.current.width = MAX_WIDTH_PX
    }
    if (dimension.current.height < MAX_HEIGHT_PX) {
      dimension.current.height = MAX_HEIGHT_PX
    }
    setFrameStyle(f => R.merge(f, {
      width: `${dimension.current.width + 600}px`, paddingBottom: `${dimension.current.height + 500}px`, height: `${dimension.current.height}px`
    }))
  }

  const expandDrag = (e) => {
    if(!resizeDrag.current || maximized){
      return
    }
    stopPropagation(e)
    if(e.type === "touchmove"){
      expandDragChangeX.current = e.changedTouches[0].clientX - initialRx.current;
      expandDragChangeY.current = e.changedTouches[0].clientY - initialRy.current;
    }else{
      expandDragChangeX.current = (e.clientX - initialRx.current);
      expandDragChangeY.current = (e.clientY - initialRy.current);
    }
    changeResizeShadowSize(expandDragChangeX.current, expandDragChangeY.current)
  }



  

  const dragStart = (e) => {
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
    if (!active.current) {
      return
    }
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


  const changeResizeShadowSize = (x,y) => {
    resizeShadowRef.current.style.width = `${dimension.current.width + x}px`
    resizeShadowRef.current.style.height = `${dimension.current.height + y + 48}px`
  }



  const stopPropagation = (e) => {
    if (e.stopPropagation) e.stopPropagation();
    if(e.preventDefault && (e.type !== "touchstart" && e.type !== "touchend" && e.type !== "touchmove")){
      e.preventDefault();
    }
    e.cancelBubble = true;
    e.returnValue = false;
    return false;
  }

  let messageHandler = {}
  messageHandler.publish = (channelName, data) => {
    const win = R.pathEq(["messageHandler", "publish"], undefined, window) ? window.parent.window : window
    const event = new Event(channelName, { bubbles: true, cancelable: false })
    event.data = data
    win.dispatchEvent(event)
  }
  messageHandler.listen = (channelName, callback) => {
    const win = R.pathEq(["messageHandler", "publish"], undefined, window) ? window.parent.window : window
    win.addEventListener(channelName, (event) => {
      callback(event.data)
    }, false);
  }
  return (
    <>
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: resizeDrag.current ? 999 : -999,
        pointerEvents: resizeDrag.current ? "auto" : "none"
      }}
      onMouseMove={expandDrag}
      onTouchMove={expandDrag}
      />
      <Box className="frame" onMouseMove={drag} sx={frameStyle} ref={ref}>
        <div className="frame-border" style={
          R.compose(
            R.assoc("resize", "both"),
            R.assoc("paddingTop", maximized ? 0 : 2),
            R.assoc("paddingLeft", maximized ? 0 : 2),
            R.assoc("paddingRight", maximized ? 0 : 2),
            R.assoc("width", (maximized ? "100%" : null)),
            R.assoc("top", null),
            R.assoc("height", dimension.current.height + 48),
            R.assoc("paddingBottom", `${dimension.current.height + 5}px`),
            R.assoc("pointerEvents", (resizeDrag.current ? "none" : "auto"))
          )(frameStyle)

        }>
          {!maximized && <div className="resize-arrow" onMouseDown={expandDragStart} onMouseUp={expandDragEnd} onTouchStart={expandDragStart} onTouchEnd={expandDragEnd}>
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="stroke" size="35" color="blue" height="35" width="35" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#bfbfbf" strokeWidth="2" points="8 20 20 20 20 8"></polyline></svg>
          </div>}
          {resizeDrag.current && <div ref={resizeShadowRef} style={{position: "fixed", background: "black", opacity: "0.5", zIndex: 999}}/>}
          <div onMouseDown={dragStart} onMouseUp={dragEnd} onMouseMove={drag} onTouchStart={dragStart} onTouchEnd={dragEnd} onTouchMove={drag} ref={topRef} className="topbar" style={{ width: maximized ? "100%" : `${R.propOr(width, "width", dimension.current)}px` }}>
            <Box sx={{ justifyContent: 'space-between' }}>
              <Box sx={{float: "right"}}>
                <CloseIcon onMouseDown={(event) => { stopPropagation(event) }} onClick={() => { hideWindow(index) }} className="hover" size={21} />
                {maximized ? <FilterNoneIcon className="hover" size={21} onClick={() => {
                  max.current = false
                  setMaximized(!maximized)
                  dimension.current.width = savedimension.current.width
                  dimension.current.height = savedimension.current.height

                }
                } />
                  : <CropSquareIcon onClick={() => {
                    max.current = true
                    savedimension.current = { width: dimension.current.width, height: dimension.current.height }
                    setMaximized(!maximized)
                    dimension.current = { width: window.parent.innerWidth - 7, height: window.parent.innerHeight - 137 }

                  }} className="hover" size={21} />

                }
                <RemoveIcon onClick={() => { minimizeWindow(index) }} className="hover" size={21} />
              </Box>
              <Box className="noselect">
                {title}
              </Box>
            </Box>

          </div>
          <div className="window" ref={windowRef} style={{ width: maximized ? "100%" : `${R.propOr(width, "width", dimension.current)}px`, height: `${R.propOr(height, "height", dimension.current)}px`, pointerEvents: (R.propEq("pointerEvents", "auto", frameStyle) || resizeDrag.current ? "none" : "auto"), overflow: (R.isNil(children) ? "hidden" : "auto") }}>
            {children && children}

            {loading && !children && <div size="lg" animation="border" variant="secondary" className="frameloading" />}
            {!children && <iframe key={viewid} ref={frameRef} onLoad={() => {
              setLoading(false);
              try {
                frameRef.current.contentWindow.messageHandler = window.messageHandler
              } catch (e) {
                console.error(e)
              }
            }} frameBorder="0" title={title} src={url} className={"framestyle"} height={`${R.propOr(height, "height", dimension.current)}px`} width={`${R.propOr(width, "width", dimension.current)}px`} />}
          </div>
        </div>
      </Box>
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


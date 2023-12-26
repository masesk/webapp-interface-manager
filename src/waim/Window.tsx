import React, { useState, useRef, useEffect } from 'react';
import '../css/App.css';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import FilterNoneIcon from '@mui/icons-material/FilterNone';
import CropSquareIcon from '@mui/icons-material/CropSquare';
import * as R from 'ramda'
import { Box, Typography } from '@mui/material';
import { MAX_HEIGHT_PX, MAX_WIDTH_PX } from '../constants';
import UndefinedAppImage from "../img/unknown.png"

import { FOOTER_HEIGHT, HEADER_HEIGHT, MAXIMIZED_STYLE, WINDOW_HEIGHT_MAXIMIZED_OFFSET, WINDOW_TOPBAR_HEIGHT } from './constant';
import { useAppDispatch } from './redux/hooks';
import { hideWindowWithViewId, hideWindowWithIndex, minimizeWindow, updateIndex } from './redux/reducers/windowsSlice';

interface WindowDimensions{
  width: number,
  height: number
}

interface WindowProperties extends WindowDimensions{
  title: string,
  url: string,
  appid: string,
  children: any,
  minimized: boolean,
  zIndex: number,
  index: number,
  viewid: number,
  imageUrl: string
}


const Window = ({ title, width, height, url, children, minimized, zIndex, index, viewid, imageUrl} : WindowProperties) => {
  const dispatch = useAppDispatch()
  const frameRef = useRef<HTMLIFrameElement>(null)
  const windowRef = useRef<HTMLDivElement>(null)
  const topRef = useRef<HTMLDivElement>(null)
  const ref = useRef<HTMLDivElement>(null)
  const dimension = useRef<WindowDimensions>({ width, height })
  const [loading, setLoading] = useState<boolean>(true)
  const [frameStyle, setFrameStyle] = useState<React.CSSProperties>(
    {
      pointerEvents: "none",
      top: 0,
      position: "fixed", zIndex: zIndex, width: `${dimension.current.width + 600}px`, paddingBottom: `${dimension.current.height + 500}px`, paddingTop: `300px`, paddingLeft: "300px", resize: "both"
    }
  )
  const [maximized, setMaximized] = useState(false)

  const max = useRef<boolean>(false)

  const isInitialMount = useRef<boolean>(true);
  const savedimension = useRef<WindowDimensions>()
  const currentX = useRef<number>(-300)
  const currentY = useRef<number>(-300 + HEADER_HEIGHT)
  const initialX = useRef<number>(0)
  const initialY = useRef<number>(0)
  const xOffset = useRef<number>(0)
  const yOffset = useRef<number>(0)
  const active = useRef<boolean>(false)
  const resizeDrag = useRef<boolean>(false)

  const initialRx = useRef(0)
  const initialRy = useRef(0)


  const expandDragChangeX = useRef<number>(0)
  const expandDragChangeY = useRef<number>(0)

  const resizeShadowRef = useRef<HTMLDivElement>(null)


  useEffect(() => {
    dimension.current = { width, height }
    setTranslate(-300,  -300 + HEADER_HEIGHT)
    xOffset.current = -300
    yOffset.current = -300 + HEADER_HEIGHT
    currentX.current = -300
    currentY.current = -300 + HEADER_HEIGHT
    window.addEventListener('resize', () => {
      if (max.current) {
        dimension.current.width = window.parent.innerWidth
        dimension.current.height = window.parent.innerHeight - FOOTER_HEIGHT - HEADER_HEIGHT - WINDOW_TOPBAR_HEIGHT - WINDOW_HEIGHT_MAXIMIZED_OFFSET
        setFrameStyle(f => R.mergeLeft(f,
          MAXIMIZED_STYLE
        ))
      }

    });

    window.addEventListener('mouseup', expandDragEnd);
  }, [])

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      if (maximized) {
        
        setFrameStyle(f => R.mergeRight(f,
          MAXIMIZED_STYLE
        ))
        windowRef!.current!.style.width = "100%"
        topRef!.current!.style.width = "100%"
        setTranslate(0, 0)

      }
      else {
        setTranslate(currentX.current, currentY.current)
        setFrameStyle(f => R.mergeRight(f, {
          top: 0,
          height: `${dimension.current.height + 600}px`,
          position: "fixed",
          width: `${dimension.current.width + 600}px`,
          paddingBottom: `${dimension.current.height + 500}px`,
          paddingTop: `300px`,
          paddingLeft: "300px",


        }) as React.CSSProperties)

      }
    }
  }, [maximized])

  useEffect(() => {
    setFrameStyle(f => R.mergeRight(f, {
      zIndex: zIndex
    }))
  }, [zIndex])

  useEffect(() => {
    if (minimized) {
      setFrameStyle(f => R.mergeRight(f, {
        display: "none"
      }))
    }
    else {
      setFrameStyle(f => R.mergeRight(f, {
        display: "block"
      }))
    }
  }, [minimized])





  const expandDragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>): void => {
    if (e.type === "touchstart") {
      initialRx.current = (e as React.TouchEvent<HTMLDivElement>).touches[0].clientX;
      initialRy.current = (e as React.TouchEvent<HTMLDivElement>).touches[0].clientY;
    } else {
      initialRx.current = (e as React.MouseEvent<HTMLDivElement>).clientX;
      initialRy.current = (e as React.MouseEvent<HTMLDivElement>).clientY;
    }
    resizeDrag.current = true
    stopPropagation(e)
    setFrameStyle(R.clone(frameStyle))
    dispatch(updateIndex(viewid))

  }

  const expandDragEnd = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement> | MouseEvent) => {
    if (!resizeDrag.current) {
      return
    }
    let changeX;
    let changeY;
    if (e.type === "touchend") {
      changeX = (e as React.TouchEvent<HTMLDivElement>).changedTouches[0].clientX - initialRx.current
      changeY = (e as React.TouchEvent<HTMLDivElement>).changedTouches[0].clientY - initialRy.current
    } else {
      changeX = (e as React.MouseEvent<HTMLDivElement>).clientX - initialRx.current;
      changeY = (e as React.MouseEvent<HTMLDivElement>).clientY - initialRy.current;
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
    setFrameStyle(f => R.mergeLeft(f, {
      width: `${dimension.current.width + 600}px`, paddingBottom: `${dimension.current.height + 500}px`, height: `${dimension.current.height}px`
    }))
  }

  const expandDrag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (!resizeDrag.current || maximized) {
      return
    }
    stopPropagation(e)
    if (e.type === "touchmove") {
      expandDragChangeX.current = (e as React.TouchEvent<HTMLDivElement>).changedTouches[0].clientX - initialRx.current;
      expandDragChangeY.current = (e as React.TouchEvent<HTMLDivElement>).changedTouches[0].clientY - initialRy.current;
    } else {
      expandDragChangeX.current = ((e as React.MouseEvent<HTMLDivElement>).clientX - initialRx.current);
      expandDragChangeY.current = ((e as React.MouseEvent<HTMLDivElement>).clientY - initialRy.current);
    }
    changeResizeShadowSize(expandDragChangeX.current, expandDragChangeY.current)
  }





  const dragStart = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    active.current = true;
    e.stopPropagation()
    if (e.type === "touchstart") {
      initialX.current = (e as React.TouchEvent<HTMLDivElement>).touches[0].clientX - xOffset.current;
      initialY.current = (e as React.TouchEvent<HTMLDivElement>).touches[0].clientY - yOffset.current;
    } else {
      initialX.current = (e as React.MouseEvent<HTMLDivElement>).clientX - xOffset.current;
      initialY.current = (e as React.MouseEvent<HTMLDivElement>).clientY - yOffset.current;
    }
    dispatch(updateIndex(viewid))
    setFrameStyle(
      R.assoc("pointerEvents", "auto", frameStyle)
    )

  }

  const dragEnd = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
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

  const drag = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (active.current && !maximized) {
      stopPropagation(e)

      if (e.type === "touchmove") {
        currentX.current = (e as React.TouchEvent<HTMLDivElement>).touches[0].clientX - initialX.current;
        currentY.current = (e as React.TouchEvent<HTMLDivElement>).touches[0].clientY - initialY.current;
      } else {
        currentX.current = (e as React.MouseEvent<HTMLDivElement>).clientX - initialX.current;
        currentY.current = (e as React.MouseEvent<HTMLDivElement>).clientY - initialY.current;
      }

      xOffset.current = currentX.current;
      yOffset.current = currentY.current;

      setTranslate(currentX.current, currentY.current);
    }
  }

  const setTranslate = (xPos: number, yPos: number) => {
    ref!.current!.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";

  }


  const changeResizeShadowSize = (x: number, y: number) => {
    resizeShadowRef!.current!.style.width = `${dimension.current.width + x}px`
    resizeShadowRef!.current!.style.height = `${dimension.current.height + y + 32}px`
  }



  const stopPropagation = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement> | React.TouchEvent<SVGElement> | React.MouseEvent<SVGElement> | MouseEvent) => {
    if (e.stopPropagation) e.stopPropagation();
    if (e.preventDefault && (e.type !== "touchstart" && e.type !== "touchend" && e.type !== "touchmove")) {
      e.preventDefault();
    }
    // e.cancelBubble = true;
    // e.returnValue = false;
    return false;
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
            R.assoc("paddingTop", maximized ? 0 : 2),
            R.assoc("paddingLeft", maximized ? 0 : 2),
            R.assoc("paddingRight", maximized ? 0 : 2),
            R.assoc("width", (maximized ? "100%" : null)),
            R.assoc("top", null),
            R.assoc("height", dimension.current.height + WINDOW_TOPBAR_HEIGHT + 4),
            R.assoc("paddingBottom", `${dimension.current.height + 5}px`),
            R.assoc("pointerEvents", (resizeDrag.current ? "none" : "auto"))
          )(frameStyle)

        }>
          {!maximized &&
          <>
          
          <div className="resize-arrow">
            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" className="stroke" color="blue" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><polyline fill="none" stroke="#bfbfbf" strokeWidth="2" points="8 20 20 20 20 8"></polyline></svg>
          </div>
          <div className="resize-arrow-container" onMouseDown={expandDragStart} onMouseUp={expandDragEnd} onTouchStart={expandDragStart} onTouchEnd={expandDragEnd}/>
          </>
          }
          {resizeDrag.current && <div ref={resizeShadowRef} style={{ position: "fixed", background: "black", opacity: "0.5", zIndex: 999 }} />}
          <div onMouseDown={dragStart} onMouseUp={dragEnd} onMouseMove={drag} onTouchStart={dragStart} onTouchEnd={dragEnd} onTouchMove={drag} ref={topRef} className="topbar" style={{ width: maximized ? "100%" : `${R.propOr(width, "width", dimension.current)}px` }}>
            <Box sx={{ display: "flex", justifyContent: 'space-between', alignItems: "center", height: WINDOW_TOPBAR_HEIGHT }}>
              <Box className="noselect" sx={{ display: "flex", justifyItems: "center", alignItems: "center", p: "4px", height: WINDOW_TOPBAR_HEIGHT }}>
                <img onError={(e: any) => (e.target.src = UndefinedAppImage)} style={{ width: "15px", height: "15px", borderRadius: 2, marginRight: "5px" }} src={(R.isEmpty(imageUrl) || R.isNil(imageUrl)) ? UndefinedAppImage : imageUrl} />
                <Typography variant="body2">{title}</Typography>
              </Box>
              <Box sx={{ display: "flex" }}>
                <span style={{ display: "flex", marginRight: "7px" }}><CloseIcon onMouseDown={(event) => { stopPropagation(event) }} onClick={() => { dispatch(hideWindowWithIndex(index)) }} className="hover" sx={{ fontSize: 15 }} /></span>
                <span style={{ display: "flex", marginRight: "7px" }}>
                  {maximized ? <FilterNoneIcon className="hover" sx={{ fontSize: 15 }} onClick={() => {
                    max.current = false
                    setMaximized(!maximized)
                    dimension!.current!.width = savedimension.current!.width
                    dimension!.current!.height = savedimension.current!.height

                  }
                  } />
                    : <CropSquareIcon onClick={() => {
                      max.current = true
                      savedimension.current = { width: dimension.current.width, height: dimension.current.height }
                      setMaximized(!maximized)
                      dimension.current = { width: window.parent.innerWidth, height: window.parent.innerHeight - FOOTER_HEIGHT - HEADER_HEIGHT - WINDOW_TOPBAR_HEIGHT - WINDOW_HEIGHT_MAXIMIZED_OFFSET  }

                    }} className="hover" sx={{ fontSize: 15 }} />

                  }
                </span>
                <span style={{ display: "flex", marginRight: "7px" }}>
                  <RemoveIcon onClick={() => { dispatch(minimizeWindow(index)) }} className="hover" sx={{ fontSize: 15 }} />
                </span>
              </Box>
            </Box>

          </div>
          <div className="window" ref={windowRef} style={{ width: maximized ? "100%" : `${R.propOr(width, "width", dimension.current)}px`, height: `${R.propOr(height, "height", dimension.current)}px`, pointerEvents: (R.propEq("auto", "pointerEvents", frameStyle) || resizeDrag.current ? "none" : "auto"), overflow: (R.isNil(children) ? "hidden" : "auto") }}>
            {children && children}

            {loading && !children && <div className="frameloading" />}
            {!children && <iframe key={viewid} ref={frameRef} onLoad={() => {
              setLoading(false);
              try {
                const contentWindow: any = frameRef!.current!.contentWindow
                const localWindow: any = window
                contentWindow.waim = localWindow.waim
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



export default Window;

//export default React.forwardRef(Window);


import React, { useState, useRef, useEffect } from 'react';
import '../css/App.css';
import { MdClose, MdCropSquare, MdRemove, MdFilterNone } from 'react-icons/md';
import  {Spinner} from 'react-bootstrap'
import '../css/boostrap.min.css'
import * as R from 'ramda'
function Window({ initTitle, initWidth, initHeight, initUrl, id, initComponent, children, clickCallback }, ref) {
    const frameRef = useRef()
    const windowRef = useRef()
    const topRef = useRef()
    const [dimension, setDimension] = useState({ width: initWidth, height: initHeight })
    const [title, setTitle] = useState(initTitle)
    const [visible, setVisible] = useState(true)
    const [url, setURL] = useState(initUrl)
    const [loading, setLoading] = useState(true)
    const [frameStyle, setFrameStyle] = useState({
        paddingBottom: `${dimension.height + 1.5}px`
    })
    const [transform, setTransform] = useState(null)
    const [maximized, setMaximized] = useState(false)

    const isInitialMount = useRef(true);
    const saveDimensions = useRef({})

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
                frameRef.current.style.width = "100%"
                frameRef.current.style.height = "100%"

            }
            else {
                setFrameStyle(R.merge(frameStyle, { 
                  transform: transform, paddingBottom: `${dimension.height + 1.5}px`,
                  width: dimension.width,
                  height: dimension.height 
                }))

            }
        }
    }, [maximized])


    var active = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;
    function dragStart(e) {
        clickCallback(id)
        e.stopPropagation()
        if (e.type === "touchstart") {
          initialX = e.touches[0].clientX - xOffset;
          initialY = e.touches[0].clientY - yOffset;
        } else {
          initialX = e.clientX - xOffset;
          initialY = e.clientY - yOffset;
        }

        active = true;
      }
  
      function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        
        active = false;
      }
  
      function drag(e) {
        if (active && !maximized) {
          e.preventDefault();
        
          if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
          } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
          }
  
          xOffset = currentX;
          yOffset = currentY;
  
          setTranslate(currentX, currentY);
        }
      }
  
      function setTranslate(xPos, yPos) {
        ref.current.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
      }

    const stopPropagation = (event) =>{
        if (event.stopPropagation) event.stopPropagation();
        if (event.preventDefault) event.preventDefault();
        event.cancelBubble = true;
        event.returnValue = false;
    }

    
    return (
        <>
        {visible && <div className="frame" style={frameStyle} ref={ref}>
                <div onMouseDown={dragStart} onMouseLeave={dragEnd} onMouseUp={dragEnd} ref={topRef} onMouseMove={drag} className="topbar" style={{ width: `${dimension.width}px` }}>
                    <MdClose onMouseDown={(event) => {stopPropagation(event)}} onClick={() => setVisible(false)} className="hover" size={21} />
                    {maximized ? <MdFilterNone className="hover" size={21} onClick={() => {
                        
                        setMaximized(!maximized)
                        setDimension({width: saveDimensions.current.width, height: saveDimensions.current.height})

                    }
                    } />
                        : <MdCropSquare onClick={() => {
                            saveDimensions.current = {width: dimension.width, height: dimension.height}
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
                <iframe ref={frameRef} onLoad={()=>setLoading(false)} frameBorder="0" title={title} src={url} className={"framestyle"} height={`${dimension.height}px`} width={`${dimension.width}px`}/>
                </div>
            </div>}
           
        </>
    );
}

export default React.forwardRef(Window);



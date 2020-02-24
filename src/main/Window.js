import React, { useState, useRef, useEffect } from 'react';
import '../css/App.css';
import { MdClose, MdCropSquare, MdRemove, MdFilterNone } from 'react-icons/md';
import '../css/boostrap.min.css'
import * as R from 'ramda'
function Window({ initTitle, initWidth, initHeight }) {
    const elemRef = useRef(null)
    const [dimension, setDimension] = useState({ width: initWidth, height: initHeight })
    const [title, setTitle] = useState(initTitle)
    const [dragStartY, setDragStartY] = useState(null)
    const [dragStartTop, setDragStartTop] = useState(null)
    const [dragStartX, setDragStartX] = useState(null)
    const [dragStartLeft, setDragStartLeft] = useState(null)
    const [visible, setVisible] = useState(true)
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
                    transform: `translateY(0px) translateX(0px)`
                    , paddingBottom: `${dimension.height + 1.5}px`
                }))

            }
            else {
                setFrameStyle(R.merge(frameStyle, { transform: transform, paddingBottom: `${dimension.height + 1.5}px` }))

            }
        }
    }, [maximized])







    const getWindowScrollY = () => {
        const doc = document.documentElement;
        return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    }

    const getWindowScrollX = () => {
        const doc = document.documentElement;
        return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    }

    const initialiseDrag = event => {
        stopPropagation(event)
        if (maximized) {
            return
        }
        const { target, clientY, clientX } = event;
        const { offsetTop, offsetLeft } = target;
        const { top, left } = elemRef.current.getBoundingClientRect();
        setDragStartTop(top - offsetTop);
        setDragStartLeft(left - offsetLeft);
        setDragStartY(clientY)
        setDragStartX(clientX)
        window.addEventListener('mousemove', startDragging, false);
        window.addEventListener('mouseup', stopDragging, false);

    }



    const stopPropagation = (event) =>{
        if (event.stopPropagation) event.stopPropagation();
        if (event.preventDefault) event.preventDefault();
        event.cancelBubble = true;
        event.returnValue = false;
    }

    const startDragging = ({ clientY, clientX }) => {
        let newTop = dragStartTop + clientY - dragStartY + getWindowScrollY()-30;
        let newLeft = dragStartLeft + clientX - dragStartX + getWindowScrollX();
        if (newTop < 0) newTop = 0;
        if (newLeft < 0) newLeft = 0;
        elemRef.current.style.transform = `translateY(${newTop}px) translateX(${newLeft}px)`;
        setTransform(`translateY(${newTop}px) translateX(${newLeft}px)`)
        //elemRef.current.style.transform = `translateX(${newLeft}px)`;
        //scrollIfElementBottom(newTop, newLeft);
    }

    const stopDragging = () => {
        window.removeEventListener('mousemove', startDragging, false);
        window.removeEventListener('mouseup', stopDragging, false);
    }

    const scrollIfElementBottom = (newTop, newLeft) => {
        window.scroll({
            top: newTop,
            left: newLeft,

        });
    };



    return (
        <>
            {visible && <div className="frame" style={frameStyle} ref={elemRef}>
                <div onMouseDown={initialiseDrag} className="topbar" style={{ width: `${dimension.width}px` }}>
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
                <div className="window" style={{ width: `${dimension.width}px`, height: `${dimension.height}px` }}>
                    Content
            </div>
            </div>}
        </>
    );
}

export default Window;



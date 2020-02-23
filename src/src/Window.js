import React, { useState, useRef } from 'react';
import '../css/App.css';
import { MdClose, MdCropSquare, MdRemove } from 'react-icons/md';
import '../css/boostrap.min.css'
function Window() {
    const elemRef = useRef(null)
    const [dragStartY, setDragStartY] = useState(null)
    const [dragStartTop, setDragStartTop] = useState(null)
    const [dragStartX, setDragStartX] = useState(null)
    const [dragStartLeft, setDragStartLeft] = useState(null)

    const getWindowScrollY = () => {
        const doc = document.documentElement;
        return (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    }

    const getWindowScrollX = () => {
        const doc = document.documentElement;
        return (window.pageXOffset || doc.scrollLeft) - (doc.clientLeft || 0);
    }

    const initialiseDrag = event => {
        const { target, clientY, clientX } = event;
        const { offsetTop, offsetLeft } = target;
        const { top, left } = elemRef.current.getBoundingClientRect();
        setDragStartTop(top - offsetTop);
        setDragStartLeft(left - offsetLeft);
        setDragStartY(clientY)
        setDragStartX(clientX)
        window.addEventListener('mousemove', startDragging, false);
        window.addEventListener('mouseup', stopDragging, false);
        if(event.stopPropagation) event.stopPropagation();
        if(event.preventDefault) event.preventDefault();
        event.cancelBubble=true;
        event.returnValue=false;
    }

    const startDragging = ({ clientY, clientX }) => {
        let newTop = dragStartTop + clientY - dragStartY + getWindowScrollY();
        let newLeft = dragStartLeft + clientX - dragStartX + getWindowScrollX();
        if (newTop < 0) newTop = 0;
        if (newLeft < 0) newLeft = 0;
        elemRef.current.style.transform = `translateY(${newTop}px) translateX(${newLeft}px)`;
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
        <div className="frame" ref={elemRef}>
            <div onMouseDown={initialiseDrag} className="topbar">
                <MdClose className="hover" size={21} />
                <MdCropSquare className="hover" size={21} />
                <MdRemove className="hover" size={21} />
                <h5 className={"float-right"}>Title</h5>

            </div>
            <div className="window">
                Content 
            </div>
        </div>
    );
}

export default Window;



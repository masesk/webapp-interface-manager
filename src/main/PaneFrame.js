import React, { useRef, useState } from 'react'



export const PaneFrame = ({ title, url, allowPointerEvents }) => {
    const [loadingFrame, setLoadingFrame] = useState(true)
    const frameRef = useRef();
    return (
        <>
            {loadingFrame && <div size="lg" animation="border" variant="secondary" className="frameloading" />}
            <iframe ref={frameRef} onLoad={() => {
                setLoadingFrame(false);
                try {
                    frameRef.current.contentWindow.messageHandler = window.messageHandler
                } catch (e) {
                    console.error(e)
                }
            }} frameBorder="0" title={title}
                width="100%"
                style={allowPointerEvents ? {pointerEvents: "auto"} : {pointerEvents: "none"}}
                src={url} className={"framestyle"} height="100%" />
        </>
    )
}

export default PaneFrame
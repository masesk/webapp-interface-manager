import React, { useRef, useState } from 'react'
import * as R from 'ramda'


export const PaneFrame = ({ title, url, allowPointerEvents }) => {
    const [loadingFrame, setLoadingFrame] = useState(true)
    const frameRef = useRef();
    const paneStyle = {pointerEvents : "auto", height: "calc(100%)"}
    return (
        <>
            {loadingFrame && <div size="lg" animation="border" variant="secondary" className="frameloading" />}
            <iframe ref={frameRef} onLoad={() => {
                setLoadingFrame(false);
                try {
                    frameRef.current.contentWindow.waim = window.waim
                } catch (e) {
                    console.error(e)
                }
            }} frameBorder="0" title={title}
                width="100%"
                style={!allowPointerEvents ? R.assoc("pointerEvents", "none", paneStyle) : paneStyle}
                src={url} className={"framestyle"} height="100%" />
        </>
    )
}

export default PaneFrame
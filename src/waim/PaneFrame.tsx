import React, { useRef, useState } from 'react'
import * as R from 'ramda'

interface PaneFrameProps {
    title: string,
    url: string,
    allowPointerEvents: boolean
}

export const PaneFrame = ({ title, url, allowPointerEvents }: PaneFrameProps) => {
    const [loadingFrame, setLoadingFrame] = useState(true)
    const frameRef = useRef<HTMLIFrameElement>(null);
    const paneStyle : React.CSSProperties = {pointerEvents : "auto", height: "calc(100%)"}
    return (
        <>
            {loadingFrame && <div className="frameloading" />}
            <iframe ref={frameRef} onLoad={() => {
                setLoadingFrame(false);
                try {
                    const contentWindow: any = frameRef!.current!.contentWindow
                    const localWindow: any = window
                    contentWindow.waim = localWindow.waim
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
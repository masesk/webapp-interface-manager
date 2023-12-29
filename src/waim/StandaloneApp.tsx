import { useEffect, useState } from "react"

interface StandaloneAppProps {
    children: JSX.Element | JSX.Element[]
}

const StandaloneApp = ({children} : StandaloneAppProps) => {
    const [initialized, setInitailized] = useState(false)
    useEffect(()=> {
        const localWindow: any = window
        localWindow.waim = {}
        localWindow.waim.messageHandler = {}
        const callbackMap: Map<string, Function> = new Map()
        localWindow.addEventListener("storage", (e: any) => {
            if(e.key !== "message") return
            const message = JSON.parse(e.newValue)
            if(callbackMap.has(message.channelName) === false) return
            const callback = callbackMap.get(message.channelName) as Function
            callback(message.data)
        })
    
        localWindow.waim.messageHandler.publish = (channelName: string, data: any) => {
            let message = {
                channelName,
                data,
                time: Date.now() 
            }

            localWindow.localStorage.setItem("message", JSON.stringify(message))
            const callback = callbackMap.get(message.channelName) as Function
            callback(message.data)
        }
        localWindow.waim.messageHandler.listen = (channelName: string, callback: Function) => {
            callbackMap.set(channelName, callback)
        }
        console.log("WAIM Standalone Applicaiton Initialized")
        setInitailized(true)
    }, [])
    return(
        <>{initialized ?  <>{children}</> : <></>}</>
    )
}

export default StandaloneApp
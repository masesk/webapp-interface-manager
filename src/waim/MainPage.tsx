import { useEffect, useRef } from "react"
import Window from './Window'
import Header from './Header'
import Settings from './Settings'
import StaticWindow from './StaticWindow'
import { AppsInterface, BUILT_IN_APPS } from '../constants'
import MinBar from './MinBar';
import SplitLayout from './SplitLayout';
// import { createApp, updateIndex, createNotification, removeNotification } from "./redux/actions"
import { Snackbar, Box, Alert, Tabs } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import * as R from 'ramda'
import { FOOTER_HEIGHT, HEADER_HEIGHT } from "./constant"
import { useAppDispatch, useAppSelector } from "./redux/hooks"
import { createApp, createNotificaiton, removeNotification, selectWindows, updateIndex } from "./redux/reducers/windowsSlice"

export class WaimEvent extends Event{
    data: any
}

const MainPage = () => {
    const windowsAppRefs = useRef<AppsInterface>()
    const windows = useAppSelector(selectWindows)
    const dispatch = useAppDispatch()
    useEffect(() => {
        if (window === undefined) return
        const localWindow: any = window
        localWindow.waim = {}
        localWindow.waim.messageHandler = {}
        localWindow.waim._broker = new EventTarget();
        localWindow.waim.messageHandler.publish = (channelName: string, data: any) => {
            const event = new WaimEvent(channelName, { bubbles: true, cancelable: false })
            event.data = data
            localWindow.waim._broker.dispatchEvent(event)
        }
        localWindow.waim.messageHandler.listen = (channelName: string, callback: Function) => {
            localWindow.waim._broker.addEventListener(channelName, (event: WaimEvent) => {
                callback(event.data)
            }, false);
        }

        localWindow.waim.messageHandler.stopListeningAll = (channelName: string) => {
            localWindow.waim._broker.removeEventListener(channelName)
        }
        localWindow.waim.messageHandler.listen("__create_notification__", (data: any) => {
            const { message, type, duration } = data
            dispatch(createNotificaiton({message, type, duration}))
            return
        })

        localWindow.waim.messageHandler.listen("__create_new_app__", (data: any) => {
            if (R.has(data.id, windowsAppRefs.current)) {
                localWindow.waim.messageHandler.publish("__create_new_app_response__", { id: data.id, status: "failure" })
                localWindow.waim.messageHandler.publish("__create_notification__", {
                    message: <span>New application with ID <span style={{fontWeight:"bold"}}>{data.id}</span> cannot be created because it already exists!</span>,
                    type: "error",
                    duration: 4000
                })
                return
            }
            dispatch(createApp(data))
            dispatch(updateIndex(data.id))
            localWindow.waim.messageHandler.publish("__create_new_app_response__", { id: data.id, status: "success" })
            localWindow.waim.messageHandler.publish("__create_notification__", {
                message: <span>New application with ID <span style={{fontWeight:"bold"}}>{data.id}</span> was successfully created!</span>,
                type: "success",
                duration: 4000
            })
        })
        console.info("WAIM successfully loaded")

    }, [])
    
    useEffect(()=> {
        windowsAppRefs.current = windows.apps
    }, [windows.apps])

    return (
        <>
            <Header />
            {/* Add all static windows/apps below */}
            {
                R.compose(
                    R.map(([key, value]) => {
                        return (
                            <StaticWindow key={`static_app_${key}`} appid={key}>
                                {value}
                            </StaticWindow>
                        )
                    }),
                    R.toPairs
                )(windows.appDoms)
            }
            {
                (!R.isNil(R.path(["layout", "type"], windows))) && 
                <div id="paneGrandParent" style={{height: `calc(100vh - ${FOOTER_HEIGHT + HEADER_HEIGHT}px)`}}>
                <SplitLayout indexPath={[]} layoutType={R.path(["layout", "type"], windows)} />
                </div>
            }
            {
                R.compose(
                    R.map(([index, win]) => {
                        const appid = R.prop("appid", win)
                        const key = R.prop("viewid", win)
                        const zIndex = R.prop("zIndex", win)
                        if (R.has(appid, BUILT_IN_APPS) && !R.hasPath([appid, "url"], BUILT_IN_APPS)) {
                            return null
                        }
                        const window = R.path(["apps", appid], windows)
                        return <Window
                            appid={window.appid}
                            title={window.title}
                            url={window.url || ""}
                            width={window.width}
                            zIndex={zIndex}
                            index={index}
                            key={key}
                            viewid={key}
                            minimized={R.prop("minimized", win)}
                            height={window.height}
                            imageUrl={window.imageUrl || ""}
                            />
                    }),
                    R.toPairs,
                )(windows.view)
            }
            
            <div className="footer" style={{height: FOOTER_HEIGHT}}>
                <Tabs
                    variant="scrollable"
                    scrollButtons="auto"
                    value={false}
                    sx={{ minHeight: FOOTER_HEIGHT, height: FOOTER_HEIGHT }}
                >

                    {

                        R.compose(

                            R.map(([index, win]) => {
                                const appid = R.prop("appid", win)
                                const viewid = R.prop("viewid", win)
                                const window = R.path(["apps", appid], windows)
                                return <MinBar minimized={R.prop("minimized", win)} index={viewid} key={index}>{R.prop("title", window)}</MinBar>
                            }),
                            R.toPairs,

                        )(windows.view)
                    }
                </Tabs>
            </div>
            <Box sx={{ position: "absolute", right: 0, bottom: 0 }}>
                {
                    R.compose(
                        R.map(([key, value]) => {
                            return <Snackbar
                                autoHideDuration={value.duration}
                                sx={{ "position": "relative", maxWidth: "300px" }}
                                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                                message={value.message}
                                key={`notification_${key}`}
                                onClose={()=> {dispatch(removeNotification(key))}}
                                open={R.has(key, windows.notifications)}
                            >

                                <Alert severity={value.type} onClose={() => { dispatch(removeNotification(key));}} closeText="close" sx={{ width: '100%' }} slotProps={{ closeIcon: <CloseIcon /> }}>
                                    {value.message}


                                </Alert>
                            </Snackbar>
                        }),
                        R.toPairs,
                    )(windows.notifications)
                }
            </Box>
            <Settings />
        </>
    )
}


export default MainPage;
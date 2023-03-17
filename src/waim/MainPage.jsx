import { useEffect, useRef } from "react"
import { connect } from 'react-redux'
import Window from './Window'
import Header from './Header'
import Settings from './Settings'
import StaticWindow from './StaticWindow'
import { BUILT_IN_APPS } from '../constants'
import MinBar from './MinBar';
import TwoColumnLayout from './TwoColumnLayout';
import { VERTICAL_2COLUM } from '../redux/constants';
import { createApp, updateIndex, createNotification, removeNotification } from "../redux/actions"
import { Snackbar, Box, Alert, Tabs } from "@mui/material"
import CloseIcon from "@mui/icons-material/Close"
import * as R from 'ramda'
const MainPage = ({ windows, createApp, updateIndex, createNotification, removeNotification }) => {
    const windowsAppRefs = useRef()
    useEffect(() => {
        if (window === undefined) retunr
        window.waim = {}
        window.waim.messageHandler = {}
        window.waim._broker = new EventTarget();
        window.waim.messageHandler.publish = (channelName, data) => {
            const event = new Event(channelName, { bubbles: true, cancelable: false })
            event.data = data
            window.waim._broker.dispatchEvent(event)
        }
        window.waim.messageHandler.listen = (channelName, callback) => {
            window.waim._broker.addEventListener(channelName, (event) => {
                callback(event.data)
            }, false);
        }

        window.waim.messageHandler.stopListeningAll = (channelName) => {
            window.waim._broker.removeEventListener(channelName)
        }
        window.waim.messageHandler.listen("__create_notification__", (data) => {
            const { message, type, duration } = data
            createNotification(message, type, duration)
            return
        })

        window.waim.messageHandler.listen("__create_new_app__", (data) => {
            console.log(data.id, windowsAppRefs.current, R.has(data.id, windowsAppRefs.current))
            if (R.has(data.id, windowsAppRefs.current)) {
                window.waim.messageHandler.publish("__create_new_app_response__", { id: data.id, status: "failure" })
                window.waim.messageHandler.publish("__create_notification__", {
                    message: <span>New application with ID <span style={{fontWeight:"bold"}}>{data.id}</span> cannot be created because it already exists!</span>,
                    type: "error",
                    duration: 4000
                })
                return
            }
            createApp(...Object.values(data))
            updateIndex(data.id)
            window.waim.messageHandler.publish("__create_new_app_response__", { id: data.id, status: "success" })
            window.waim.messageHandler.publish("__create_notification__", {
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
            <Header windows={windows} />
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
            {(R.equals(R.path(["layout", "selectedLayout"], windows), VERTICAL_2COLUM)) && <TwoColumnLayout />}
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
                            url={window.url}
                            width={window.width}
                            zIndex={zIndex}
                            index={index}
                            key={key}
                            viewid={key}
                            minimized={R.prop("minimized", win)}
                            height={window.height} />
                    }),
                    R.toPairs,
                )(windows.view)
            }
            <Settings />
            <div className="footer">
                <Tabs
                    variant="scrollable"
                    scrollButtons="auto"
                    value={false}
                >

                    {

                        R.compose(

                            R.map(([index, win]) => {
                                const appid = R.prop("appid", win)
                                const viewid = R.prop("viewid", win)
                                const window = R.path(["apps", appid], windows)
                                return <MinBar minimized={R.prop("minimized", win)} index={viewid} key={index} appid={appid}>{R.prop("title", window)}</MinBar>
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
                                onClose={()=> {removeNotification(key)}}
                                open={R.has(key, windows.notifications)}
                            >

                                <Alert severity={value.type} onClose={() => { removeNotification(key);}} closeText="close" sx={{ width: '100%' }} slotProps={{ closeIcon: <CloseIcon /> }}>
                                    {value.message}


                                </Alert>
                            </Snackbar>
                        }),
                        R.toPairs,
                    )(windows.notifications)
                }
            </Box>
        </>
    )
}

const mapStateToProps = state => {
    return state
};

export default connect(mapStateToProps, { createApp, updateIndex, createNotification, removeNotification })(MainPage);
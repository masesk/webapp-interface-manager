import { useEffect } from "react"
import { connect } from 'react-redux'
import Window from './Window'
import Header from './Header'
import Settings from './Settings'
import StaticWindow from './StaticWindow'
import { BUILT_IN_APPS } from '../constants'
import MinBar from './MinBar';
import TwoColumnLayout from './TwoColumnLayout';
import Tabs from "@mui/material/Tabs"
import { VERTICAL_2COLUM } from '../redux/constants';
import * as R from 'ramda'
const MainPage = ({ windows }) => {
    useEffect(() => {
        if (window === undefined) retunr
        window.messageHandler = {}
        window.messageHandler.publish = (channelName, data) => {
            const event = new Event(channelName, { bubbles: true, cancelable: false })
            event.data = data
            window.dispatchEvent(event)
        }
        window.messageHandler.listen = (channelName, callback) => {
            window.addEventListener(channelName, (event) => {
                callback(event.data)
            }, false);
        }
        console.log("HERE?")
    }, [])

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
                                return <MinBar className={R.propEq("minimized", true, win) ? "" : "showing"} index={viewid} key={index} appid={appid}>{R.prop("title", window)}</MinBar>
                            }),
                            R.toPairs,

                        )(windows.view)
                    }
                </Tabs>
            </div>
        </>
    )
}

const mapStateToProps = state => {
    return state
};

export default connect(mapStateToProps, {})(MainPage);
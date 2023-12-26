import * as R from 'ramda'
import Window from './Window'
import { useAppSelector } from './redux/hooks'
import { selectWindows } from './redux/reducers/windowsSlice'

type ChildrenProps = JSX.Element | JSX.Element[]

interface WindowDimensions{
  width: number,
  height: number
}

interface WindowProperties extends WindowDimensions{
  title: string,
  url: string,
  appid: string,
  children: any,
  minimized: boolean,
  updateIndex: any,
  hideWindow: any,
  minimizeWindow: any,
  zIndex: number,
  index: number,
  viewid: string,
  imageUrl: string
}

interface StaticWindowProps {
    windows: WindowProperties[],
    children: ChildrenProps,
    appid: string
}

const StaticWindow = ({children, appid }: StaticWindowProps) => {
  const windows = useAppSelector(selectWindows)
  return (
    <>
    {
        R.compose(
        R.map(([index, win]) => {
        
          const fappid = R.prop("appid", win)
          const key = R.prop("viewid", win)
          const zIndex = R.prop("zIndex", win)
          if (R.equals(appid, fappid)) {
            const window: WindowProperties = R.path<WindowProperties>(["apps", appid], windows)
            return <Window 
              appid={window.appid}
              title={window.title}
              width={window.width}
              key={key}
              zIndex={zIndex}
              viewid={key}
              index={index}
              minimized={R.prop("minimized", win)}
              url={window.url}
              height={window.height}
              imageUrl={window.imageUrl}
              >{children}</Window>
          }
          return

        }),
        R.toPairs,
    )(windows.view)
        }
     
    </>
  )
}


// const connectAndForwardRef = (
//   mapStateToProps = null,
//   mapDispatchToProps = null,
//   mergeProps = null,
//   options = {},
// ) => component => connect(
//   mapStateToProps,
//   mapDispatchToProps,
//   mergeProps,
//   {
//     ...options,
//     forwardRef: true,
//   },
// )(React.forwardRef(component));

// const ConnectedWindow = connectAndForwardRef(mapStateToProps, null)(StaticWindow)

// export default ConnectedWindow;


export default StaticWindow

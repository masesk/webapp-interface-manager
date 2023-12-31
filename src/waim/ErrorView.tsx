import { Alert, AlertTitle } from "@mui/material"

const ErrorView = () => {
    return (
        <Alert sx={{m: 2}} severity="error">
            <AlertTitle>Error</AlertTitle>
            This app has crashed within the WAIM framework. <strong>Restart the app and/or read the browser console for more information!</strong>
        </Alert>
    )
}

export default ErrorView
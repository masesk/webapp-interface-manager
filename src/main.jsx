import React from 'react';
import ReactDOM from 'react-dom/client';
import AppManager from './waim/AppManager';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import store from "./redux/store";
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import { grey, blueGrey } from '@mui/material/colors';


// create a palette for themes
// the mode can be used to specifcy specific color schemes
// currently only dark and light are supported
const getDesignTokens = (mode) => ({
  palette: {
    mode,
    primary: {
      ...grey,
      ...(mode === 'dark' && {
        main: grey[300],
      }),
    },
    ...(mode === 'light' && {
      background: {
        default: grey[300],
        paper: blueGrey[200],
      },
    }),
    ...(mode === 'dark' && {
      background: {
        default: grey[700],
        paper: grey[800],
      },
    }),
    text: {
      ...(mode === 'light'
        ? {
          primary: grey[900],
          secondary: grey[800],
        }
        : {
          primary: '#fff',
          secondary: grey[300],
        }),
    }
  },
  overrides: {
    MuiOutlinedInput: {
      root: {
        // Hover state
        "&:hover $notchedOutline": {
          borderColor: "#9a9a9a"
        },
        // Focused state
        "&$focused $notchedOutline": {
          borderColor: "#9a9a9a"
        }
      },
      // Default State
      notchedOutline: {
        borderColor: "#9a9a9a"
      }
    }
  }
});

// we pass the value of the mode here
const theme = createTheme(getDesignTokens('dark'));

// generate the root dom
const root = ReactDOM.createRoot(document.getElementById("root"));

// pass it to the redux store provider, theme provide, and css baseline components
root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppManager />
    </ThemeProvider>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

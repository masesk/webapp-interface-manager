import React from 'react';
import ReactDOM from 'react-dom';
import AppManager from './main/AppManager';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import store from "./redux/store";
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { amber, deepOrange, grey, blue, indigo, blueGrey } from '@mui/material/colors';


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

const theme = createTheme(getDesignTokens('dark'));


ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppManager />
    </ThemeProvider>
  </Provider>

  , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

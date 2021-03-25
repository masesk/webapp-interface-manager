import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import WidgetManager from './main/WidgetManager';
import * as serviceWorker from './serviceWorker';
import { Provider } from "react-redux";
import store from "./redux/store";

ReactDOM.render( <Provider store={store}><WidgetManager /></Provider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

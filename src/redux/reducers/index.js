import { combineReducers } from "redux";
import windows from "./windows";
import settings from "./settings"
import layout from "./layout"

export default combineReducers({ windows, settings, layout });

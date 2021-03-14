import { CREATE_WINDOW, SHOW_WINDOW, HIDE_WINDOW } from "../actionTypes";
import * as R from 'ramda'

const initialState = {

  "addwidget": {
    id: "addwidget",
    title: "Add Widget",
    width: 800,
    height: 500,
    showing: false
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case SHOW_WINDOW: {
      const {id} = action.payload
      return R.assocPath([id, "showing"], true, state)
    }

    case HIDE_WINDOW: {
      const {id} = action.payload
      return R.assocPath([id, "showing"], false, state)
    }
    case CREATE_WINDOW:{
      const window = {
        id: action.payload.id,
        title: action.payload.title,
        width: action.payload.width,
        height: action.payload.height,
        url: action.payload.url,
        showing: true
      }
      return R.assoc(action.payload.id, window, state)
    }
    default:
      return state;
  }
}

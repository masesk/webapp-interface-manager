import { TOGGLE_SETTINGS} from "../actionTypes";
import * as R from 'ramda'

const initialState = {
    showing: false
};

export default function(state = initialState, action) {
  switch (action.type) {
    case TOGGLE_SETTINGS: {
      const {showing} = action.payload
      return R.assoc("showing", showing, state)
    }
    default:
      return state;
  }
}

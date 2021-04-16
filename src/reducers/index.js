import homeReducer from "./homeReducer";
import detailsReducer from "./detailsReducer";
import { combineReducers } from "redux";

export default combineReducers({
  home: homeReducer,
  details: detailsReducer
});

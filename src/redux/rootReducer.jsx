import { combineReducers } from "redux";
import {
  tournamentIdReducer,
  userDataReducer,
  tournamentDataReducer,
  refreshResultReducer,
  clubNameReducer,
  clubRefreshReducer,
} from "./reducer";

const rootRed = combineReducers({
  userDataReducer,
  tournamentIdReducer,
  tournamentDataReducer,
  refreshResultReducer,
  clubNameReducer,
  clubRefreshReducer,
});

export default rootRed;

import {
  CLUB_NAME,
  CLUB_REFRESH,
  REFRESH_RESULT,
  RESULT_OWNER_ID,
  TOURNAMENT_DATA,
  TOURNAMENT_DATE,
  TOURNAMENT_ID,
  USER_DATA,
} from "./constant";

export const userDataReducer = (state = [], action) => {
  if (action.type === USER_DATA) {
    return action.payload;
  } else {
    return state;
  }
};

export const tournamentIdReducer = (state = [], action) => {
  if (action.type === TOURNAMENT_ID) {
    return action.payload;
  } else {
    return state;
  }
};

export const tournamentDataReducer = (state = [], action) => {
  if (action.type === TOURNAMENT_DATA) {
    return action.payload;
  } else {
    return state;
  }
};

export const refreshResultReducer = (state = [], action) => {
  if (action.type === REFRESH_RESULT) {
    return action.payload;
  } else {
    return state;
  }
};

export const clubNameReducer = (state = [], action) => {
  if (action.type === CLUB_NAME) {
    return action.payload;
  } else {
    return state;
  }
};

export const clubRefreshReducer = (state = [], action) => {
  if (action.type === CLUB_REFRESH) {
    return action.payload;
  } else {
    return state;
  }
};

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

export const userDataDispatcher = (userData) => {
  return {
    type: USER_DATA,
    payload: userData,
  };
};

export const tournamentIdDispatcher = (tournamentId) => {
  return {
    type: TOURNAMENT_ID,
    payload: tournamentId,
  };
};

export const tournamentDataDispatcher = (tournamentDat) => {
  return {
    type: TOURNAMENT_DATA,
    payload: tournamentDat,
  };
};

export const refreshResultDispatcher = (refreshResult) => {
  return {
    type: REFRESH_RESULT,
    payload: refreshResult,
  };
};

export const clunNameDispatcher = (clubName) => {
  return {
    type: CLUB_NAME,
    payload: clubName,
  };
};

export const clunRefreshDispatcher = (clubRefresh) => {
  return {
    type: CLUB_REFRESH,
    payload: clubRefresh,
  };
};

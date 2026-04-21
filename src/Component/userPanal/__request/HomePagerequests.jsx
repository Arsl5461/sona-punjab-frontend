import axiosInstance from "../../../helper/AxiosConfig";

const normalizeScreenStatus = (value) => {
  if (typeof value !== "string") return "";
  return value.trim().toLowerCase().replace(/\s+/g, "");
};

/**
 * True when this row is the one meant for the public home screen.
 * Backend sends `status: "Active"` (Create/Edit tournament → "On Screen").
 */
const isHomeScreenTournament = (t) => {
  if (!t || typeof t !== "object") return false;
  const raw = t.status ?? t.Status ?? t.tournamentStatus;
  if (typeof raw === "string") {
    const n = normalizeScreenStatus(raw);
    if (n === "active" || n === "onscreen" || n === "on") return true;
    if (n === "non-active" || n === "inactive" || n === "off" || n === "offscreen")
      return false;
  }
  if (raw === true) return true;
  if (t.screenOn === true || t.isScreenOn === true || t.displayOnHome === true)
    return true;
  return false;
};

/**
 * When the API returns several tournaments (or the wrong one first), prefer the
 * row flagged for the public home screen instead of blindly using index 0.
 */
const pickTournamentFromList = (list) => {
  if (!Array.isArray(list) || list.length === 0) return null;
  const candidates = list.filter((x) => x && typeof x === "object");
  if (!candidates.length) return null;
  const onScreen = candidates.find(isHomeScreenTournament);
  if (onScreen) return onScreen;
  return candidates[0];
};

/**
 * Backend responses vary by route/version: sometimes the tournament is the
 * JSON root, sometimes `{ data: doc }`, `{ data: [doc] }`, or `{ tournaments: [...] }`.
 * Home and tournament-view must always receive one plain tournament object.
 */
export const unwrapTournamentPayload = (body) => {
  if (body == null) return null;
  if (Array.isArray(body)) return pickTournamentFromList(body);
  if (typeof body !== "object") return null;

  if (body.data != null) {
    const inner = body.data;
    if (Array.isArray(inner)) return pickTournamentFromList(inner);
    if (typeof inner === "object") return inner;
  }

  const singleKeys = ["activeTournament", "screenTournament", "currentTournament"];
  for (const key of singleKeys) {
    const v = body[key];
    if (v && typeof v === "object" && !Array.isArray(v) && (v._id || v.tournamentName))
      return v;
  }

  const listKeys = ["tournaments", "tournament", "tournamentList", "result"];
  for (const key of listKeys) {
    const v = body[key];
    if (Array.isArray(v) && v.length && typeof v[0] === "object")
      return pickTournamentFromList(v);
    if (v && typeof v === "object" && !Array.isArray(v) && (v._id || v.tournamentName))
      return v;
  }

  if (body._id || body.tournamentName || Array.isArray(body.dates)) return body;

  return null;
};

export const getCurrentTournamentsReq = async () => {
  try {
    const response = await axiosInstance.get(
      `/sona-punjab/get-active-tournament`
    );
    return unwrapTournamentPayload(response.data);
  } catch (error) {
    console.error("Error in fetching current Tournaments", error.message);
    return null;
  }
};

export const getSingleTournamentReq = async (tournamentId) => {
  try {
    const response = await axiosInstance.get(
      `/sona-punjab/get-single-tournaments/${tournamentId}`
    );
    return unwrapTournamentPayload(response.data);
  } catch (error) {
    console.error("Error in fetching single Tournaments", error.message);
    return null;
  }
};

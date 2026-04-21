import axiosInstance from "../../../helper/AxiosConfig";

/**
 * Backend responses vary by route/version: sometimes the tournament is the
 * JSON root, sometimes `{ data: doc }`, `{ data: [doc] }`, or `{ tournaments: [...] }`.
 * Home and tournament-view must always receive one plain tournament object.
 */
export const unwrapTournamentPayload = (body) => {
  if (body == null) return null;
  if (Array.isArray(body)) return body[0] ?? null;
  if (typeof body !== "object") return null;

  if (body.data != null) {
    const inner = body.data;
    if (Array.isArray(inner)) return inner[0] ?? null;
    if (typeof inner === "object") return inner;
  }

  const listKeys = ["tournaments", "tournament", "tournamentList", "result"];
  for (const key of listKeys) {
    const v = body[key];
    if (Array.isArray(v) && v.length && typeof v[0] === "object") return v[0];
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

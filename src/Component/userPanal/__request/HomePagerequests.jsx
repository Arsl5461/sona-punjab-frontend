import axiosInstance from "../../../helper/AxiosConfig";

export const getCurrentTournamentsReq = async () => {
  try {
    const response = await axiosInstance.get(
      `/sona-punjab/get-active-tournament`
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetching current Tournaments", error.message);
    return { data: null, error: "Error in fetching current Tournaments" };
  }
};

export const getSingleTournamentReq = async (tournamentId) => {
  try {
    const response = await axiosInstance.get(
      `/sona-punjab/get-single-tournaments/${tournamentId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetching single Tournaments", error.message);
    return { data: null, error: "Error in fetching single Tournaments" };
  }
};

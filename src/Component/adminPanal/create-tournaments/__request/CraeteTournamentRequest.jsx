import axiosInstance from "../../../../helper/AxiosConfig";

export const CraeteTournamentRequest = async (formData) => {
  try {
    const response = await axiosInstance.post(
      `/sona-punjab/tournaments`,
      formData
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetching Users List", error.message);
    return { data: null, error: "Error in creating Tournaments" };
  }
};

export const getAllTournaments = async () => {
  try {
    const response = await axiosInstance.get(`/sona-punjab/get-tournaments`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Users List", error.message);
    return { data: null, error: "Error in fetching Tournaments list" };
  }
};

export const getAllAllowedTournaments = async (subadminId) => {
  try {
    const response = await axiosInstance.get(
      `/sona-punjab/get-allowed-tournaments/${subadminId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetching Users List", error.message);
    return { data: null, error: "Error in fetching Tournaments list" };
  }
};

export const getSingleTournamentReq = async (id) => {
  try {
    const response = await axiosInstance.get(
      `/sona-punjab/get-single-tournaments/${id}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetching Users List", error.message);
    return { data: null, error: "Error in fetching sinle Tournaments" };
  }
};

export const createTournamentResultReq = async (formDat) => {
  try {
    // const response = await axiosInstance.post(`/sona-punjab/results`, formDat);
    const response = await axiosInstance.post("/sona-punjab/results", formDat, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in fetching Users List", error.message);
    return { data: null, error: "Error in creating Tournament result" };
  }
};

export const GetTournamentOwnersReq = async (Id) => {
  try {
    const response = await axiosInstance.get(
      `/sona-punjab/tournament/${Id}/owners`
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetching Users List", error.message);
    return { data: null, error: "Error in Fetching Tournament owners" };
  }
};

export const getResultByDate = async (Id, date) => {
  try {
    const response = await axiosInstance.get(
      `/sona-punjab/tournament-results/${Id}/${date}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetching Users List", error.message);
    return { data: null, error: "Error in getting Tournament result" };
  }
};

export const getTotalDaysResultReq = async (TournamentId) => {
  try {
    const response = await axiosInstance.get(
      `/sona-punjab/tournament/${TournamentId}/results`
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetching Users List", error.message);
    return { data: null, error: "Error in getting Tournament result" };
  }
};

export const deleteTournament = async (TournamentId) => {
  try {
    const response = await axiosInstance.delete(
      `/sona-punjab/delete-tournament/${TournamentId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetching Users List", error.message);
    return { data: null, error: "Error in getting Tournament result" };
  }
};

export const getTournamentById = async (TournamentId) => {
  try {
    const response = await axiosInstance.get(
      `/sona-punjab/get-single-tournaments/${TournamentId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetching Users List", error.message);
    return { data: null, error: "Error in getting Tournament result" };
  }
};

export const updateTournamentRequest = async (id, formData) => {
  try {
    const response = await axiosInstance.put(
      `/sona-punjab/tournaments/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in updating Tournament", error.message);
    return { data: null, error: "Error in updating Tournament" };
  }
};

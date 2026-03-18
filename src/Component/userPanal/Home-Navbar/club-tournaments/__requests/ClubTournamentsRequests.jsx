import axiosInstance from "../../../../../helper/AxiosConfig";

export const getClubTournaments = async (clubName) => {
  try {
    const response = await axiosInstance.get(
      `/sona-punjab/get-all-tournament/${clubName}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetching club Tournaments", error.message);
    return { data: null, error: "Error in fetching club Tournaments" };
  }
};

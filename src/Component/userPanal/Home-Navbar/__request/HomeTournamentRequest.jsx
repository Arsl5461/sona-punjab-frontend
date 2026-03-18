import axiosInstance from "../../../../helper/AxiosConfig";

export const getAllTournamentsReq = async () => {
  try {
    const response = await axiosInstance.get(`/sona-punjab/get-tournaments`);
    return response.data;
  } catch (error) {
    console.error("Error fetch Tournaments List", error.message);
    return { data: null, error: "Error fetch Tournaments List" };
  }
};

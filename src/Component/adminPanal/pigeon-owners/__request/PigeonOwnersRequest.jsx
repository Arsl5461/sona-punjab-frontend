import axiosInstance from "../../../../helper/AxiosConfig";

export const createPigeonOwnerrequest = async (formData) => {
  try {
    const response = await axiosInstance.post(`/sona-punjab/owner`, formData);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Users List", error.message);
    return { data: null, error: "Error fetch Jobs List" };
  }
};

export const getPigeonOwnersReq = async () => {
  try {
    const response = await axiosInstance.get(
      `/sona-punjab/get-all-owner`
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetching Users List", error.message);
    return { data: null, error: "Error fetch Jobs List" };
  }
};

export const getSingleOwnerReq = async (ownerId) => {
  try {
    const response = await axiosInstance.get(
      `/sona-punjab/single-owner/${ownerId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetching Users List", error.message);
    return { data: null, error: "Error fetch Jobs List" };
  }
};

export const deletePigeonOwnerReq = async (PigeonOwnerId) => {
  try {
    const response = await axiosInstance.delete(
      `/sona-punjab/delete-owner/${PigeonOwnerId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetching Users List", error.message);
    return { data: null, error: "Error fetch Jobs List" };
  }
};

export const updatePigeonOwnerReq = async (PigeonOwnerId, formdata) => {
  try {
    const response = await axiosInstance.put(
      `/sona-punjab/update-owner/${PigeonOwnerId}`,
      formdata
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetching Users List", error.message);
    return { data: null, error: "Error fetch Jobs List" };
  }
};

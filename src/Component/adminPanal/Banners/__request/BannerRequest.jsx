import axiosInstance from "../../../../helper/AxiosConfig";

export const CreateBannerRequest = async (formData) => {
  try {
    const response = await axiosInstance.post(`/sona-punjab/banner`, formData);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Users List", error.message);
    return { data: null, error: "Error fetch Jobs List" };
  }
};

export const getAllBanners = async () => {
  try {
    const response = await axiosInstance.get(`/sona-punjab/get-all-banner`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Users List", error.message);
    return { data: null, error: "Error fetch Jobs List" };
  }
};

export const deleteBannerRequest = async (id) => {
  try {
    const response = await axiosInstance.delete(`/sona-punjab/delete/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Users List", error.message);
    return { data: null, error: "Error fetch Jobs List" };
  }
};

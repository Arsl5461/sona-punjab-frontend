import axiosInstance from "../../../../helper/AxiosConfig";

export const getAllUsersRequest = async () => {
  try {
    const response = await axiosInstance.get(`/sona-punjab/all-admin`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching Users List", error.message);
    return { data: null, error: "Error fetch Jobs List" };
  }
};

export const updateUsersRequest = async (id, formdata) => {
  try { 
    const response = await axiosInstance.put(`/sona-punjab/update-admin/${id}`, formdata, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteAdminRequest = async (id) => {
  try { 
    const response = await axiosInstance.delete(`/sona-punjab/delete-admin/${id}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

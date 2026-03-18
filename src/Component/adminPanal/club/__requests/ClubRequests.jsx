import axiosInstance from "../../../../helper/AxiosConfig";

export const createClub = async (clubName) => {
  try {
    if (!clubName || clubName.trim() === "") {
      return {
        success: false,
        message: "Club name is required",
      };
    }

    const response = await axiosInstance.post(
      `/sona-punjab/create-club`,
      JSON.stringify({ name: clubName.trim() }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      return {
        success: true,
        message: response.data.message,
        club: response.data.club,
      };
    }

    return response.data;
  } catch (error) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: "Error creating club",
    };
  }
};

export const getAllClubs = async () => {
  try {
    const response = await axiosInstance.get(`/sona-punjab/get-all-clubs`);
    return response.data;
  } catch (error) {
    console.error("Error in fetching clubs List", error.message);
    return { success: false, message: "Error fetching clubs List" };
  }
};

export const updateClub = async (clubId, clubData) => {
  try {
    const response = await axiosInstance.put(
      `/sona-punjab/update-club/${clubId}`,
      JSON.stringify(clubData),
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error in updating club", error.message);
    return { 
      success: false, 
      message: error.response?.data?.message || "Error updating club" 
    };
  }
};

export const deleteClub = async (clubId) => {
  try {
    const response = await axiosInstance.delete(
      `/sona-punjab/delete-club/${clubId}`
    );
    return response.data;
  } catch (error) {
    console.error("Error in fetching clubs List", error.message);
    return { success: false, message: "Error fetching clubs List" };
  }
};

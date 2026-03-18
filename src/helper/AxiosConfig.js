// utils/axiosConfig.js

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API}`, // Use environment variables to manage your base URL
  timeout: 50000, // Timeout after 50 seconds
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Do something before the request is sent, like adding auth tokens
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code that lies within the range of 2xx causes this function to trigger
    return response;
  },
  (error) => {
    // Any status codes that fall outside the range of 2xx cause this function to trigger
    // Handle response errors here
    if (error.response) {
      if (error.response.status === 401) {
        // Unauthorized access, clear the token and redirect to login
        localStorage.removeItem("token"); // Clear the token from localStorage
        window.location.href = "/login"; // Redirect to login
      }
      // Optionally handle other status codes, e.g., 500 for server errors
      if (error.response.status === 500) {
        // Handle server errors
        console.error("Server error, please try again later.");
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

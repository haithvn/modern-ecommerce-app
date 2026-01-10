import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptors if needed (e.g. for logging or auth token)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here
    console.error("API Error:", error);
    return Promise.reject(error);
  },
);

export default axiosClient;

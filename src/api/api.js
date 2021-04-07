import axios from "axios";

// Init axios with config
const axiosInstance = axios.create({
  baseURL: "",
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Before every api call, add anything to the request here (for example access token)
    return config;
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default axiosInstance;

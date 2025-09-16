import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 200) {
      return Promise.reject({ code: res.code, message: res.message });
    }
    return res.data; 
  },
  (error) => {
    if (error.response?.data) {
      const res = error.response.data;
      return Promise.reject({ code: res.code, message: res.message });
    }
    return Promise.reject({ code: 500, message: "Unexpected error" });
  }
);


export default axiosClient;

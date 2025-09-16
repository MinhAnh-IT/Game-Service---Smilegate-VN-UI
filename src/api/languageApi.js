import axiosClient from "./axiosClient";

const languageApi = {
  getAll: () => axiosClient.get("/languages"),
};

export default languageApi;

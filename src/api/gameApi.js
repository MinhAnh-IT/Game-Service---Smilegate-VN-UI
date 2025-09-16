import axiosClient from "./axiosClient";

const gameApi = {
  getAll: (params) => axiosClient.get("/games", { params }),
  getById: (id) => axiosClient.get(`/games/${id}`),
  create: (formData) =>
    axiosClient.post("/games", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  update: (id, formData) =>
    axiosClient.put(`/games/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteOne: (id) => axiosClient.delete(`/games/${id}`),
  deleteMany: (ids) =>
    axiosClient.delete("/games", { data: ids, headers: { "Content-Type": "application/json" } }),
};

export default gameApi;

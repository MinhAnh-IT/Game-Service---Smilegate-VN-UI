import axiosClient from "./axiosClient";

const gameNameApi = {
  add: (gameId, data) =>
    axiosClient.post(`/games/${gameId}/names`, data),
  update: (gameId, nameId, data) =>
    axiosClient.put(`/games/${gameId}/names/${nameId}`, data),
  delete: (gameId, nameId) =>
    axiosClient.delete(`/games/${gameId}/names/${nameId}`),
};

export default gameNameApi;

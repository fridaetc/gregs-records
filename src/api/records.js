import api from "./api";

export const getRecords = (page) => {
  return api.get(page);
};

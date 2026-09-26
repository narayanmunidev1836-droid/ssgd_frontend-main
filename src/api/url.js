import axios from "axios";

export const url = {
  apiBaseUrl: "https://beadm.ssgd.org/api/v1/",
};

export const axiosInstance = axios.create({
  baseURL: "https://beadm.ssgd.org/api/v1/",
});

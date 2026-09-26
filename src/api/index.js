import axios from "axios";
import { url } from "./url";

const request = axios.create({
  baseURL: url.apiBaseUrl,
});

// Add a request interceptor
request.interceptors.request.use(
  (config) => {
    // Do something before request is sent
    config.headers.authorization = `${localStorage.getItem("Token")}`;
    // console.log("request",config);
    return config;
  },
  (error) =>
    // Do something with request error
    Promise.reject(error)
);

// Add a response interceptor
request.interceptors.response.use(
  (response) =>
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    // console.log("response", response);
    response,
  (error) =>
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    // console.log("error", error);
    Promise.reject(error)
);

export default request;

import axios from "axios";

const request = axios.create({
  baseURL: "http://192.168.0.186:8089",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json;charset=UTF-8",
  },
});

request.interceptors.request.use((config) => {
  let token = localStorage.getItem("token");
  if (token != null) {
    config.headers["token"] = token;
  }
  return config;
});

export default request;

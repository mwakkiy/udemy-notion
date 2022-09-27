import axios from "axios";

const BASE_URL = "http://localhost:5000/api/v1/";
const getToken = () => localStorage.getItem("token");

const axiosClient = axios.create({
  baseURL: BASE_URL
});

//APIを叩く前に前処理
axiosClient.interceptors.request.use(async config => {
  return {
    ...config,
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${getToken()}` //リクエストヘッダーにJWTをつけてサーバーに渡す
    }
  };
});

// レスポンス時の前処理
axiosClient.interceptors.response.use(
  response => {
    return response.data;
  },
  err => {
    throw err.response;
  }
);

export default axiosClient;

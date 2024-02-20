import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { ToastFailure } from "../../Share/toast/ToastMsg";
import { useNavigate } from "react-router-dom";

const useApiService = (): AxiosInstance => {
  const navigate = useNavigate();
  const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
  });

  let timeoutHandler: any = null;

  // Request interceptor
  api.interceptors.request.use(
    (config: any) => {
      if (
        config.url !== "/forget_password" &&
        config.url !== "/login" &&
        config.url !== "/password_reset"
      ) {
        const accessToken = localStorage.getItem("AUTHTOKEN");
        config.headers.Authorization = accessToken;
      }
      return config;
    },
    (error) => {
      console.error("Request Error Interceptor:", error);
      return Promise.reject(error);
    }
  );

  // Response interceptor
  api.interceptors.response.use(
    (response: AxiosResponse) => {
      // Modify the response data here
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        if (timeoutHandler) {
          clearTimeout(timeoutHandler);
        }
        timeoutHandler = setTimeout(() => {
          localStorage.clear();
          ToastFailure("Something went wrong please login again");
          navigate("/login", { replace: true });
        }, 500);
      }
      return Promise.reject(error);
    }
  );

  return api;
};

export default useApiService;

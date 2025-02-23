import axios from 'axios';
import { getAccessToken, isValidToken, setSession } from './auth/utils';
import Cookies from 'js-cookie';
// config

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URL }); //prod

// Add request interceptor
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const accessToken = getAccessToken();
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error),
// );

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      if (
        !window.location.href.includes('/auth/')
    ) {
        const token = Cookies.get("token")
        if (token) {
          setSession(token)
        } else {
          setSession(null);
        }
      }
    }
    return Promise.reject(
      (error.response && error.response.data) || 'Something went wrong',
    );
  },
);
export default axiosInstance;

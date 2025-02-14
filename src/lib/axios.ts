import axios from 'axios';
import { getAccessToken } from './auth/utils';
// config

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: import.meta.env.VITE_API_URL }); //prod

    // Add request interceptor
    axiosInstance.interceptors.request.use(
        (config) => {
          const accessToken = getAccessToken();
          if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
          }
          return config;
        },
        (error) => Promise.reject(error),
      );

// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {

//         return Promise.reject(
//             (error.response && error.response.data) || 'Something went wrong',
//         );
//     },
// );

export default axiosInstance;

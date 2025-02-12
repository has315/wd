import axios from 'axios';
import { getAccessToken } from './auth/utils';
// config

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: 'http://localhost:3000' }); //prod

    // Add request interceptor
    axiosInstance.interceptors.request.use(
        (config) => {
          const accessToken = getAccessToken();
          console.log({accessToken})
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

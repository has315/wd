import axios from 'axios';
// config

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: 'http://localhost:3000' }); //prod

// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {

//         return Promise.reject(
//             (error.response && error.response.data) || 'Something went wrong',
//         );
//     },
// );

export default axiosInstance;

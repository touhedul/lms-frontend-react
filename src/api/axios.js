import axios from 'axios';
import { apiUrl } from '../components/common/Config';


const axiosInstance = axios.create({
    baseURL: apiUrl,
});

// ✅ Add request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // Skip adding token for specific endpoints (e.g., login or register)
        const noAuthRoutes = ['/login', '/register']; // Add more routes as needed
        const isNoAuth = noAuthRoutes.some(route => config.url.includes(route));

        if (!isNoAuth) {
            const userInfo = localStorage.getItem('userInfo');
            const token = userInfo ? JSON.parse(userInfo).token : null;
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;

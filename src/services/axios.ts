import axios from 'axios';
import { getAuthToken } from '@/authToken';

const api = axios.create({
  baseURL: 'http://localhost:8081/api',
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
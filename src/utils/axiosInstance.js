import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  // Debug outgoing URL
  if (import.meta.env.DEV) console.log('[API] →', config.method?.toUpperCase(), config.baseURL + (config.url || ''));
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || '';
    if (import.meta.env.DEV) {
      console.error('[API ERROR]', status, url, error?.response?.data || error.message);
    }

    // Handle 401 Unauthorized (except for auth routes where user is trying to login/register)
    const isAuthRoute = /\/auth\/(login|register|google|me)$/i.test(url);
    if (status === 401 && !isAuthRoute) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

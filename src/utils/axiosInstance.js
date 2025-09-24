// src/utils/axiosInstance.js
import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

// IMPORTANT: only set JSON headers when NOT sending FormData
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;

  const isFormData =
    typeof FormData !== 'undefined' && config.data instanceof FormData;

  if (!isFormData) {
    config.headers['Content-Type'] = 'application/json';
    config.headers['Accept'] = 'application/json';
  } else {
    // Let the browser set boundary for multipart
    delete config.headers['Content-Type'];
  }

  if (import.meta.env.DEV) {
    console.log('[API] →', config.method?.toUpperCase(), config.baseURL + (config.url || ''));
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error?.response?.status;
    const url = error?.config?.url || '';
    if (import.meta.env.DEV) {
      console.error('[API ERROR]', status, url, error?.response?.data || error.message);
    }
    if (status === 401 && !/\/auth\/(login|register|google|me)$/i.test(url)) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

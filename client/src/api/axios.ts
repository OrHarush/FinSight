import axios from 'axios';
import { queryClient } from '@/queryClient';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      console.log('Error 401');
      queryClient.clear();
      localStorage.removeItem('user');
      localStorage.removeItem('token');

      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;

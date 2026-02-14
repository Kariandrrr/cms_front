import axios from 'axios';

const api = axios.create({
  baseURL: '/api',  // URL backend
});

//  для добавления токена
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

//для обработки ошибок
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';  // Redirect на login
    }
    return Promise.reject(error);
  }
);

export default api;
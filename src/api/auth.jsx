import api from './api';

export const authAPI = {
    login: (credentials) => api.post('auth/login', credentials),
    register: (UserData) => api.post('auth/register', UserData),

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
    },

    me: () => api.get('/auth/me')
};
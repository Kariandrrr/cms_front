import { jwtDecode } from 'jwt-decode';
import {createContext, useState, useEffect, useContext} from "react";
import api from '../api/axiosinstance.js';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUser({ ...decoded, token });
            } catch (e) {
                console.error("Ошибка декодирования токена:", e);
                localStorage.removeItem('token');
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        loadUser();
    }, []);

    const login = async (username, password) => {
      console.log("Начинаем логин:", { username, password });

      const formData = new URLSearchParams();
      formData.append("grant_type", "password");
      formData.append("username", username.trim());
      formData.append("password", password.trim());

        try {
            const res = await api.post('/api/auth/login', formData.toString(), {
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            });
            console.log("Успешный ответ:", res.data);

            const { access_token } = res.data;
            localStorage.setItem('token', access_token);
            loadUser();
          } catch (err) {
            console.error("Полная ошибка:", err);
            console.error("Response data:", err.response?.data);
            console.error("Status:", err.response?.status);
            throw err;
          }
        };

    const register = async (username, password, role = 'user') => {
        const res = await api.post('/auth/register', {username, password, role});
        return res;
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
          <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
            {children}
          </AuthContext.Provider>
);
};

export const useAuth = () => useContext(AuthContext);
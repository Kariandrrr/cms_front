import { useState } from 'react';
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, User, Lock, Eye, EyeOff, Sparkles } from 'lucide-react';
import api from '../api/api';

export default function Login() {
  const [form, setForm] = useState({ username: "", password: "", rememberMe: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new URLSearchParams();
      formData.append('grant_type', 'password');
      formData.append('username', form.username.trim());
      formData.append('password', form.password);
      formData.append('scope', '');

      console.log('Отправка данных:', Object.fromEntries(formData));

      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      console.log('Ответ сервера:', response.data);

      const { access_token} = response.data;

      if (!access_token) {
          console.error('Токен не получен');
          setError('Токен не получен');
          setLoading(false);
  return;
      }
    localStorage.setItem('token', access_token);

      try {
        const userResponse = await api.get('/auth/me', {
          headers: {
            'Authorization': `Bearer ${access_token}`
          }
        });

        const user = userResponse.data;
        login(access_token, user, form.rememberMe);
      } catch (userErr) {
        console.warn('Не удалось получить данные пользователя:', userErr);
        login(access_token, { username: form.username, role: 'user' }, form.rememberMe);
      }

      navigate("/admin/dashboard");

    } catch (err) {
      console.error('Login error:', err);
      console.error('Response data:', err.response?.data);

      const errorMessage = err.response?.data?.detail ||
                          err.response?.data?.message ||
                          'Неверный логин или пароль';
      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  };

 return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f5f5] to-[#e8e8e8] p-8 relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#c8a2c8]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#b088b0]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        {/* Логотип */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c8a2c8] to-[#b088b0] flex items-center justify-center shadow-lg shadow-[#c8a2c8]/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#4a4a4a]">
            <span className="bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] bg-clip-text text-transparent">
              ContentCMS
            </span>
          </h1>
          <p className="text-[#9b8b9b] mt-1">Войдите в панель управления</p>
        </div>

        {/* Карточка */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#e8d8e8] shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#f8f0f8] rounded-xl border border-[#e8d8e8]">
              <LogIn className="w-6 h-6 text-[#c8a2c8]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#4a4a4a]">Авторизация</h2>
              <p className="text-sm text-[#9b8b9b]">Введите ваши учетные данные</p>
            </div>
          </div>

          {/* Ошибка */}
          {error && (
            <div className="mb-4 p-3 bg-[#ffebee] border border-[#ffcdd2] rounded-xl">
              <p className="text-sm text-[#d32f2f]">{error}</p>
            </div>
          )}

          {/* Форма */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Логин */}
            <div>
              <label className="block text-sm font-medium text-[#6b5e6b] mb-1.5">Логин</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#b8a8b8]" />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full bg-white border-2 border-[#e0d0e0] rounded-xl py-3 pl-10 pr-4 text-[#4a4a4a] placeholder-[#b8a8b8] focus:outline-none focus:border-[#c8a2c8] focus:ring-4 focus:ring-[#c8a2c8]/20 transition-all"
                  placeholder="Введите логин"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            {/* Пароль */}
            <div>
              <label className="block text-sm font-medium text-[#6b5e6b] mb-1.5">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#b8a8b8]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-white border-2 border-[#e0d0e0] rounded-xl py-3 pl-10 pr-12 text-[#4a4a4a] placeholder-[#b8a8b8] focus:outline-none focus:border-[#c8a2c8] focus:ring-4 focus:ring-[#c8a2c8]/20 transition-all"
                  placeholder="Введите пароль"
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b8a8b8] hover:text-[#c8a2c8]"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Опции */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(e) => setForm({ ...form, rememberMe: e.target.checked })}
                  className="w-4 h-4 rounded border-[#e0d0e0] text-[#c8a2c8] focus:ring-[#c8a2c8]"
                />
                <span className="text-sm text-[#6b5e6b]">Запомнить меня</span>
              </label>
              <Link to="/forgot-password" className="text-sm text-[#c8a2c8] hover:text-[#b088b0] hover:underline">
                Забыли пароль?
              </Link>
            </div>

            {/* Кнопка входа */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] text-white font-medium py-3.5 px-4 rounded-xl hover:from-[#b088b0] hover:to-[#a078a0] focus:outline-none focus:ring-4 focus:ring-[#c8a2c8]/30 transition-all duration-200 flex items-center justify-center gap-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Вход в систему...</span>
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  <span>Войти</span>
                </>
              )}
            </button>

            {/* Разделитель */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#e8d8e8]"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-[#9b8b9b]">или</span>
              </div>
            </div>

            {/* Соцсети */}
            <div className="flex justify-center gap-4">
              {['G', 'f', 'in'].map((s, i) => (
                <button key={i} type="button" className="w-12 h-12 rounded-full border-2 border-[#e8d8e8] bg-white flex items-center justify-center text-[#6b5e6b] hover:border-[#c8a2c8] hover:bg-[#f8f0f8] transition-all text-lg font-bold">
                  {s}
                </button>
              ))}
            </div>
          </form>

          {/* Кнопка регистрации и ссылка */}
          <div className="mt-6 space-y-3">
            <button
              onClick={() => navigate('/register')}
              className="w-full bg-white border-2 border-[#c8a2c8] text-[#c8a2c8] font-medium py-3 px-4 rounded-xl hover:bg-[#f8f0f8] focus:outline-none focus:ring-4 focus:ring-[#c8a2c8]/20 transition-all duration-200 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              <span>Создать аккаунт</span>
            </button>

            <Link to="/" className="text-sm text-[#9b8b9b] hover:text-[#c8a2c8] transition-colors inline-flex items-center gap-1 group">
              <span className="group-hover:-translate-x-1 transition-transform">←</span>
              Вернуться на сайт
            </Link>
          </div>
        </div>

        <p className="text-center text-xs text-[#b8a8b8] mt-6">© 2026 ContentCMS. Все права защищены.</p>
      </div>
    </div>
  );
}
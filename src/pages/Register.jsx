import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Lock, Eye, EyeOff, Sparkles, Check, X } from 'lucide-react';
import api from '../api/api';


export default function Register() {
    const [form, setForm] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const validateForm = () => {
        if (!form.username.trim()) {
          setError('Имя пользователя обязательно');
          return false;
        }
        if (form.username.length < 3) {
          setError('Имя пользователя должно содержать минимум 3 символа');
          return false;
        }
        if (!form.password) {
          setError('Пароль обязателен');
          return false;
        }
        if (form.password.length < 6) {
          setError('Пароль должен содержать минимум 6 символов');
          return false;
        }
        if (form.password !== form.confirmPassword) {
          setError('Пароли не совпадают');
          return false;
        }
        return true;
      };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');


        if (!validateForm()) {
            setLoading(false);
            return;
        }

        try {
            const { confirmPassword, ...registrationData } = form;

            const dataToSend = {
                ...registrationData,
                role: 'user'
            };
            console.log('Отправка данных регистрации:', dataToSend);
            const response = await api.post('/auth/register', dataToSend, {
            headers: {
                 'Content-Type': 'application/json'
        }
      });

            console.log('Регистрация успешна:', response.data);
            setSuccess(true);

            setTimeout(() => {
                navigate('/login');
            }, 2000)

        }  catch (err) {
            const errorMessage = err.response?.data?.detail ||
                err.response?.data?.message ||
                'Ошибка регистрации';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
        };

    const passwordStrength = (password) => {
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 10) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
  };



  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f5f5f5] to-[#e8e8e8] p-8 relative overflow-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#c8a2c8]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-[#b088b0]/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center mb-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#c8a2c8] to-[#b088b0] flex items-center justify-center shadow-lg shadow-[#c8a2c8]/30">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-[#4a4a4a]">
            <span className="bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] bg-clip-text text-transparent">ContentCMS</span>
          </h1>
          <p className="text-[#9b8b9b] mt-1">Создайте аккаунт</p>
        </div>

        <div className="bg-white/90 backdrop-blur-sm rounded-2xl border border-[#e8d8e8] shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-[#f8f0f8] rounded-xl border border-[#e8d8e8]">
              <UserPlus className="w-6 h-6 text-[#c8a2c8]" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-[#4a4a4a]">Регистрация</h2>
              <p className="text-sm text-[#9b8b9b]">Заполните форму для создания аккаунта</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-[#ffebee] border border-[#ffcdd2] rounded-xl flex items-start gap-2">
              <X className="w-5 h-5 text-[#d32f2f] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#d32f2f]">{error}</p>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-[#e8f5e9] border border-[#a5d6a7] rounded-xl flex items-start gap-2">
              <Check className="w-5 h-5 text-[#2e7d32] flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[#2e7d32]">Регистрация успешна! Перенаправление...</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#6b5e6b] mb-1.5">Имя пользователя</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#b8a8b8]" />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full bg-white border-2 border-[#e0d0e0] rounded-xl py-3 pl-10 pr-4 text-[#4a4a4a] placeholder-[#b8a8b8] focus:outline-none focus:border-[#c8a2c8] focus:ring-4 focus:ring-[#c8a2c8]/20 transition-all"
                  placeholder="Введите имя пользователя"
                  required
                  disabled={loading || success}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#6b5e6b] mb-1.5">Пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#b8a8b8]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full bg-white border-2 border-[#e0d0e0] rounded-xl py-3 pl-10 pr-12 text-[#4a4a4a] placeholder-[#b8a8b8] focus:outline-none focus:border-[#c8a2c8] focus:ring-4 focus:ring-[#c8a2c8]/20 transition-all"
                  placeholder="Введите пароль"
                  required
                  disabled={loading || success}
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

            <div>
              <label className="block text-sm font-medium text-[#6b5e6b] mb-1.5">Подтвердите пароль</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#b8a8b8]" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full bg-white border-2 border-[#e0d0e0] rounded-xl py-3 pl-10 pr-12 text-[#4a4a4a] placeholder-[#b8a8b8] focus:outline-none focus:border-[#c8a2c8] focus:ring-4 focus:ring-[#c8a2c8]/20 transition-all"
                  placeholder="Повторите пароль"
                  required
                  disabled={loading || success}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#b8a8b8] hover:text-[#c8a2c8]"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {form.confirmPassword && form.password === form.confirmPassword && (
                <p className="text-xs text-[#2e7d32] mt-1 flex items-center gap-1">
                  <Check size={12} /> Пароли совпадают
                </p>
              )}
            </div>

            {/* Информационное сообщение о роли */}
            <div className="p-3 bg-[#f0f7ff] border border-[#b3d9ff] rounded-xl">
              <p className="text-xs text-[#0066cc]">
                <strong>Информация:</strong> После регистрации вы получите роль <strong>"Пользователь"</strong>.
                Для получения роли редактора обратитесь к администратору.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className={`w-full bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] text-white font-medium py-3.5 px-4 rounded-xl hover:from-[#b088b0] hover:to-[#a078a0] focus:outline-none focus:ring-4 focus:ring-[#c8a2c8]/30 transition-all duration-200 flex items-center justify-center gap-2 ${loading || success ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'}`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Регистрация...</span>
                </>
              ) : success ? (
                <>
                  <Check className="w-5 h-5" />
                  <span>Успешно!</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  <span>Зарегистрироваться</span>
                </>
              )}
            </button>
          </form>

          <div className="mt-6 space-y-3">
            <p className="text-sm text-[#6b5e6b] text-center">
              Уже есть аккаунт?{' '}
              <Link to="/login" className="text-[#c8a2c8] hover:text-[#b088b0] font-medium hover:underline transition-colors">
                Войти
              </Link>
            </p>
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
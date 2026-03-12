import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosinstance';
import Sidebar from '../../components/admin/Sidebar';
import {
  User, Lock, Shield, AlertCircle, CheckCircle,
  ArrowLeft, Loader2, Eye, EyeOff
} from 'lucide-react';

const COLORS = {
  card: 'bg-white/90 backdrop-blur-sm',
  border: 'border-[#e8d8e8]',
  text: {
    primary: '#4a4a4a',
    secondary: '#6b5e6b',
    muted: '#9b8b9b'
  }
};

export default function NewUserForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'user'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Валидация
      if (!formData.username.trim()) {
        throw new Error('Имя пользователя обязательно');
      }
      if (!formData.password) {
        throw new Error('Пароль обязателен');
      }
      if (formData.password.length < 6) {
        throw new Error('Пароль должен содержать минимум 6 символов');
      }

      const response = await api.post('/users/', formData);

      setSuccess('Пользователь успешно создан');

      // Перенаправляем на страницу списка пользователей через 2 секунды
      setTimeout(() => {
        navigate('/admin/users');
      }, 2000);

    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.response?.data?.message || err.message || 'Не удалось создать пользователя');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sidebar>
      <div className="p-8 max-w-2xl mx-auto">
        {/* Заголовок */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/users')}
            className="flex items-center gap-2 text-[#6b5e6b] hover:text-[#4a4a4a] transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            <span>Вернуться к списку</span>
          </button>

          <h1 className="text-3xl font-bold text-[#4a4a4a] mb-1">
            <span className="bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] bg-clip-text text-transparent">
              Создание пользователя
            </span>
          </h1>
          <p className="text-[#9b8b9b]">Заполните форму для создания нового пользователя</p>
        </div>

        {/* Сообщения */}
        {success && (
          <div className="mb-6 p-4 bg-[#e8f5e9] border border-[#c8e6c9] rounded-xl flex items-center gap-3">
            <CheckCircle className="text-[#43a047]" size={20} />
            <p className="text-[#2e7d32]">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-[#ffebee] border border-[#ffcdd2] rounded-xl flex items-center gap-3">
            <AlertCircle className="text-[#d32f2f]" size={20} />
            <p className="text-[#d32f2f]">{error}</p>
          </div>
        )}

        {/* Форма */}
        <form onSubmit={handleSubmit} className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg p-8`}>
          <div className="space-y-6">
            {/* Имя пользователя */}
            <div>
              <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                Имя пользователя <span className="text-[#ef5350]">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b8b9b]" size={20} />
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Введите имя пользователя"
                  className="w-full pl-10 pr-4 py-3 border border-[#e8d8e8] rounded-xl focus:outline-none focus:border-[#c8a2c8] transition-colors"
                  required
                />
              </div>
            </div>



            {/* Пароль */}
            <div>
              <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                Пароль <span className="text-[#ef5350]">*</span>
              </label>
              <div className="r``elative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b8b9b]" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Минимум 6 символов"
                  className="w-full pl-10 pr-12 py-3 border border-[#e8d8e8] rounded-xl focus:outline-none focus:border-[#c8a2c8] transition-colors"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9b8b9b] hover:text-[#4a4a4a] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              <p className="text-xs text-[#9b8b9b] mt-1">Минимум 6 символов</p>
            </div>

            {/* Роль */}
            <div>
              <label className="block text-sm font-medium text-[#4a4a4a] mb-2">
                Роль <span className="text-[#ef5350]">*</span>
              </label>
              <div className="relative">
                <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b8b9b]" size={20} />
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-3 border border-[#e8d8e8] rounded-xl focus:outline-none focus:border-[#c8a2c8] transition-colors appearance-none bg-white"
                  required
                >
                  <option value="user">Пользователь</option>
                  <option value="editor">Редактор</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate('/admin/users')}
                className="flex-1 px-6 py-3 border border-[#e8d8e8] text-[#6b5e6b] rounded-xl hover:bg-[#f8f0f8] transition-colors"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] text-white rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    <span>Создание...</span>
                  </>
                ) : (
                  <span>Создать пользователя</span>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </Sidebar>
  );
}
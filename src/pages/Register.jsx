import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../api/auth';
import '../App.css';

const Register = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmPassword: '',
        role: 'user'
    });

    const [errors, setErrors] = useState({});
    const [error, setError] = useState({});
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();

    const validateForm = ()  => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = "Имя пользователя обязательно";
        } else if (formData.username.length < 3) {
            newErrors.username = 'Минимум 3 символа';
        }

        if (!formData.password) {
            newErrors.password = 'Пароль обязателен';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Минимум 6 символов';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Пароли не совпадают';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
        };

    const handleChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: ''}));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!validateForm()) {
            return;
        }
        setLoading(true);

        try {
            const {confirmPassword, ...registrationData} = formData;
            const response = await authAPI.register(registrationData);

            alert('Регистрация успешна! Теперь вы можете войти.');
            navigate('/login');
        }  catch (err) {
            const errorMessage = err.response?.data?.detail ||
                err.response?.data?.message ||
                'Ошибка регистрации';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
        };

   return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1 className="auth-title">ContentCMS</h1>
          <p className="auth-subtitle">Создайте аккаунт</p>
        </div>

        <div className="auth-form-wrapper">
          <h2 className="form-title">Регистрация</h2>
          <p className="form-subtitle">Заполните форму для создания аккаунта</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label">Имя пользователя</label>
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Введите имя пользователя"
                  className={`form-input ${errors.username ? 'input-error' : ''}`}
                  disabled={loading}
                />
              </div>
              {errors.username && <span className="error-text">{errors.username}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Пароль</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Введите пароль"
                  className={`form-input ${errors.password ? 'input-error' : ''}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex="-1"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <span className="error-text">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Подтвердите пароль</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Повторите пароль"
                  className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                  disabled={loading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Роль</label>
              <div className="input-wrapper">
                <span className="input-icon">👥</span>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-input form-select"
                  disabled={loading}
                >
                  <option value="user">Пользователь</option>
                  <option value="editor">Редактор</option>
                  <option value="admin">Администратор</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary btn-register"
              disabled={loading}
            >
              {loading ? 'Регистрация...' : '→ Зарегистрироваться'}
            </button>

            <div className="auth-footer">
              <p className="register-text">
                Уже есть аккаунт? <Link to="/login" className="login-link">Войти</Link>
              </p>
              <Link to="/" className="back-link">
                ← Вернуться на сайт
              </Link>
            </div>
          </form>
        </div>

        <div className="auth-copyright">
          © 2026 ContentCMS. Все права защищены.
        </div>
      </div>
    </div>
  );
};

export default Register;
import { useState } from 'react';
import Sidebar from '../../components/admin/Sidebar';
import {
 Save, AlertCircle, CheckCircle,
  Loader2, Palette, Shield, Bell, Globe
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

export default function Settings() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [settings, setSettings] = useState({
    siteName: 'ContentCMS',
    siteDescription: 'Система управления контентом',
    postsPerPage: 10,
    allowRegistration: true,
    requireEmailVerification: false,
    enableComments: true,
    moderateComments: true,
    theme: 'light',
  });

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      setSuccess('Настройки успешно сохранены!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error saving settings:', err);
      setError('Не удалось сохранить настройки');
      setTimeout(() => setError(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Sidebar>
      <div className="p-8">
        {/* Заголовок */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#4a4a4a] mb-1">
            <span className="bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] bg-clip-text text-transparent">
              Настройки
            </span>
          </h1>
          <p className="text-[#9b8b9b]">Управление параметрами системы</p>
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

        <div className="space-y-6">
          {/* Основные настройки */}
          <div className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg p-6`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#f8f0f8] rounded-xl">
                <Globe className="w-6 h-6 text-[#c8a2c8]" />
              </div>
              <h2 className="text-xl font-semibold text-[#4a4a4a]">Основные настройки</h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#6b5e6b] mb-2">
                  Название сайта
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => handleChange('siteName', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-[#e0d0e0] rounded-xl focus:outline-none focus:border-[#c8a2c8]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6b5e6b] mb-2">
                  Описание сайта
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => handleChange('siteDescription', e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-[#e0d0e0] rounded-xl focus:outline-none focus:border-[#c8a2c8] resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#6b5e6b] mb-2">
                  Постов на страницу
                </label>
                <input
                  type="number"
                  value={settings.postsPerPage}
                  onChange={(e) => handleChange('postsPerPage', parseInt(e.target.value))}
                  min={1}
                  max={100}
                  className="w-full px-4 py-3 border-2 border-[#e0d0e0] rounded-xl focus:outline-none focus:border-[#c8a2c8]"
                />
              </div>
            </div>
          </div>

          {/* Настройки пользователей */}
          <div className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg p-6`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#f8f0f8] rounded-xl">
                <Shield className="w-6 h-6 text-[#c8a2c8]" />
              </div>
              <h2 className="text-xl font-semibold text-[#4a4a4a]">Пользователи и регистрация</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 border-2 border-[#e0d0e0] rounded-xl cursor-pointer hover:border-[#c8a2c8] transition-colors">
                <div>
                  <p className="font-medium text-[#4a4a4a]">Разрешить регистрацию</p>
                  <p className="text-sm text-[#9b8b9b]">Пользователи могут самостоятельно регистрироваться</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.allowRegistration}
                  onChange={(e) => handleChange('allowRegistration', e.target.checked)}
                  className="w-5 h-5 rounded border-[#e0d0e0] text-[#c8a2c8] focus:ring-[#c8a2c8]"
                />
              </label>

              <label className="flex items-center justify-between p-4 border-2 border-[#e0d0e0] rounded-xl cursor-pointer hover:border-[#c8a2c8] transition-colors">
                <div>
                  <p className="font-medium text-[#4a4a4a]">Требовать подтверждение email</p>
                  <p className="text-sm text-[#9b8b9b]">Пользователи должны подтвердить email после регистрации</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.requireEmailVerification}
                  onChange={(e) => handleChange('requireEmailVerification', e.target.checked)}
                  className="w-5 h-5 rounded border-[#e0d0e0] text-[#c8a2c8] focus:ring-[#c8a2c8]"
                />
              </label>
            </div>
          </div>

          {/* Настройки комментариев */}
          <div className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg p-6`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#f8f0f8] rounded-xl">
                <Bell className="w-6 h-6 text-[#c8a2c8]" />
              </div>
              <h2 className="text-xl font-semibold text-[#4a4a4a]">Комментарии</h2>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between p-4 border-2 border-[#e0d0e0] rounded-xl cursor-pointer hover:border-[#c8a2c8] transition-colors">
                <div>
                  <p className="font-medium text-[#4a4a4a]">Включить комментарии</p>
                  <p className="text-sm text-[#9b8b9b]">Разрешить пользователям оставлять комментарии</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.enableComments}
                  onChange={(e) => handleChange('enableComments', e.target.checked)}
                  className="w-5 h-5 rounded border-[#e0d0e0] text-[#c8a2c8] focus:ring-[#c8a2c8]"
                />
              </label>

              <label className="flex items-center justify-between p-4 border-2 border-[#e0d0e0] rounded-xl cursor-pointer hover:border-[#c8a2c8] transition-colors">
                <div>
                  <p className="font-medium text-[#4a4a4a]">Модерация комментариев</p>
                  <p className="text-sm text-[#9b8b9b]">Комментарии требуют одобрения перед публикацией</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.moderateComments}
                  onChange={(e) => handleChange('moderateComments', e.target.checked)}
                  className="w-5 h-5 rounded border-[#e0d0e0] text-[#c8a2c8] focus:ring-[#c8a2c8]"
                />
              </label>
            </div>
          </div>

          {/* Тема оформления */}
          <div className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg p-6`}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#f8f0f8] rounded-xl">
                <Palette className="w-6 h-6 text-[#c8a2c8]" />
              </div>
              <h2 className="text-xl font-semibold text-[#4a4a4a]">Оформление</h2>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { value: 'light', label: 'Светлая' },
                { value: 'dark', label: 'Тёмная' },
                { value: 'auto', label: 'Авто' },
              ].map((theme) => (
                <button
                  key={theme.value}
                  onClick={() => handleChange('theme', theme.value)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    settings.theme === theme.value
                      ? 'border-[#c8a2c8] bg-[#f8f0f8]'
                      : 'border-[#e0d0e0] hover:border-[#c8a2c8]'
                  }`}
                >
                  <p className="font-medium text-[#4a4a4a]">{theme.label}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Кнопка сохранения */}
          <div className="flex justify-end">
            <button
              onClick={handleSave}
              disabled={loading}
              className={`flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] text-white rounded-xl hover:opacity-90 transition-all shadow-lg ${
                loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Сохранение...</span>
                </>
              ) : (
                <>
                  <Save size={20} />
                  <span>Сохранить настройки</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
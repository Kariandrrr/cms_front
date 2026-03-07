import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postsAPI } from '../../api/api_posts';
import Sidebar from '../../components/admin/Sidebar';
import {
  Save, X, ArrowLeft, AlertCircle, Loader2,
  FileText, Tag, Eye, EyeOff, Clock
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

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [forbidden, setForbidden] = useState(false);

  const [form, setForm] = useState({
    title: '',
    content: '',
    summary: '',
    status: 'draft',
  });

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await postsAPI.getPostById(id);
      const post = response.data;

      setForm({
        title: post.title || '',
        content: post.content || '',
        summary: post.summary || '',
        status: post.status || 'draft',
      });
    } catch (err) {
      console.error('Error fetching post:', err);

      if (err.response?.status === 403) {
        setForbidden(true);
        setError('У вас нет прав для редактирования этой статьи');

        setTimeout(() => {
          navigate('/admin/posts');
        }, 3000);
      } else if (err.response?.status === 404) {
        setError('Статья не найдена');
        setTimeout(() => {
          navigate('/admin/posts');
        }, 2000);
      } else {
        setError('Не удалось загрузить пост');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await postsAPI.updatePost(id, form);
      setSuccess('Пост успешно обновлен!');

      setTimeout(() => {
        navigate('/admin/posts');
      }, 1000);
    } catch (err) {
      console.error('Error updating post:', err);
      setError(err.response?.data?.detail || 'Не удалось обновить пост');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Отменить изменения?')) {
      navigate('/admin/posts');
    }
  };

  if (loading) {
    return (
      <Sidebar>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#c8a2c8] border-t-transparent"></div>
        </div>
      </Sidebar>
    );
  }

  if (forbidden || error) {
    return (
      <Sidebar>
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-[#ffebee] to-[#ffcdd2]">
          <div className={`${COLORS.card} rounded-2xl border-4 border-[#ef5350] shadow-2xl p-10 max-w-lg text-center`}>
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ef5350] to-[#d32f2f] flex items-center justify-center mx-auto mb-6 animate-pulse">
              <AlertCircle className="w-12 h-12 text-white" />
            </div>

            <h2 className="text-3xl font-extrabold text-[#c62828] mb-3">
              {forbidden ? '🚫 ДОСТУП ЗАПРЕЩЁН' : '⚠️ ОШИБКА'}
            </h2>

            <div className="bg-[#ffebee] border-2 border-[#ef5350] rounded-xl p-4 mb-6">
              <p className="text-xl font-bold text-[#d32f2f]">
                {error}
              </p>
            </div>

            <p className="text-base text-[#9b8b9b] mb-6">
              Перенаправление через <span className="font-bold text-[#c62828]">3</span> секунды...
            </p>

            <button
              onClick={() => navigate('/admin/posts')}
              className="px-8 py-3 bg-gradient-to-r from-[#ef5350] to-[#d32f2f] text-white font-bold rounded-xl hover:from-[#d32f2f] hover:to-[#c62828] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
              ← Вернуться к списку статей
            </button>
          </div>
        </div>
      </Sidebar>
    );
  }

  return (
    <Sidebar>
      <div className="p-8">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/posts')}
              className="p-2 hover:bg-[#f8f0f8] rounded-xl transition-colors"
            >
              <ArrowLeft className="w-6 h-6 text-[#6b5e6b]" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#4a4a4a] mb-1">
                <span className="bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] bg-clip-text text-transparent">
                  Редактирование статьи
                </span>
              </h1>
              <p className="text-[#9b8b9b]">ID: {id}</p>
            </div>
          </div>
        </div>

        {/* Форма */}
        <div className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg p-8`}>
          {/* Успешное сообщение */}
          {success && (
            <div className="mb-6 p-4 bg-[#e8f5e9] border border-[#c8e6c9] rounded-xl flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-[#66bb6a] flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-[#2e7d32]">{success}</p>
            </div>
          )}

         {error && (
          <div className="mb-6 p-6 bg-gradient-to-r from-[#ffebee] to-[#ffcdd2] border-2 border-[#ef5350] rounded-xl flex items-start gap-4 shadow-lg">
            <AlertCircle className="text-[#d32f2f] flex-shrink-0 mt-1" size={28} />
            <div className="flex-1">
              <p className="text-lg font-bold text-[#c62828] mb-1">
                ⚠️ Ошибка доступа
              </p>
              <p className="text-base font-semibold text-[#d32f2f]">
                {error}
              </p>
            </div>
          </div>
)}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Заголовок */}
            <div>
              <label className="block text-sm font-medium text-[#6b5e6b] mb-2">
                <FileText className="inline w-4 h-4 mr-1" />
                Заголовок *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full px-4 py-3 border-2 border-[#e0d0e0] rounded-xl focus:outline-none focus:border-[#c8a2c8] focus:ring-4 focus:ring-[#c8a2c8]/20 transition-all"
                placeholder="Введите заголовок статьи"
                required
              />
            </div>

            {/* Краткое описание */}
            <div>
              <label className="block text-sm font-medium text-[#6b5e6b] mb-2">
                <Tag className="inline w-4 h-4 mr-1" />
                Краткое описание
              </label>
              <textarea
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 border-2 border-[#e0d0e0] rounded-xl focus:outline-none focus:border-[#c8a2c8] focus:ring-4 focus:ring-[#c8a2c8]/20 transition-all resize-none"
                placeholder="Краткое описание статьи (необязательно)"
              />
            </div>

            {/* Содержимое */}
            <div>
              <label className="block text-sm font-medium text-[#6b5e6b] mb-2">
                Содержание *
              </label>
              <textarea
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                rows={12}
                className="w-full px-4 py-3 border-2 border-[#e0d0e0] rounded-xl focus:outline-none focus:border-[#c8a2c8] focus:ring-4 focus:ring-[#c8a2c8]/20 transition-all resize-y font-mono text-sm"
                placeholder="Содержание статьи..."
                required
              />
            </div>

            {/* Статус */}
            <div>
              <label className="block text-sm font-medium text-[#6b5e6b] mb-2">
                <Clock className="inline w-4 h-4 mr-1" />
                Статус
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'draft', label: 'Черновик', icon: Clock, color: 'bg-[#ffa726]/10 text-[#fb8c00] border-[#ffa726]/30' },
                  { value: 'published', label: 'Опубликован', icon: Eye, color: 'bg-[#66bb6a]/10 text-[#43a047] border-[#66bb6a]/30' },
                  { value: 'archived', label: 'Архив', icon: EyeOff, color: 'bg-[#9b8b9b]/10 text-[#6b5e6b] border-[#9b8b9b]/30' },
                ].map((status) => {
                  const Icon = status.icon;
                  const isSelected = form.status === status.value;

                  return (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => setForm({ ...form, status: status.value })}
                      className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${
                        isSelected
                          ? `${status.color} border-current`
                          : 'bg-white border-[#e0d0e0] text-[#6b5e6b] hover:border-[#c8a2c8]'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-sm font-medium">{status.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Кнопки */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#e8d8e8]">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-3 border-2 border-[#e0d0e0] text-[#6b5e6b] rounded-xl hover:bg-[#f8f0f8] transition-colors flex items-center gap-2"
              >
                <X size={18} />
                <span>Отмена</span>
              </button>
              <button
                type="submit"
                disabled={saving}
                className={`px-8 py-3 bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] text-white rounded-xl hover:opacity-90 transition-all shadow-lg flex items-center gap-2 ${
                  saving ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-0.5'
                }`}
              >
                {saving ? (
                  <>
                    <Loader2 className="animate-spin" size={18} />
                    <span>Сохранение...</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Сохранить изменения</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Sidebar>
  );
}
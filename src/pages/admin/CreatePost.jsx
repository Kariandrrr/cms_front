import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../../api/api_posts';
import Sidebar from '../../components/admin/Sidebar';
import {
    X, ArrowLeft, AlertCircle, Loader2,
  FileText, Tag, Eye, EyeOff, Clock, Sparkles
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

export default function CreatePost() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    title: '',
    content: '',
    summary: '',
    status: 'draft',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      const response = await postsAPI.createPost(form);
      setSuccess('Статья успешно создана!');

      setTimeout(() => {
        const postId = response.data.id;
        navigate(`/admin/posts/${postId}/edit`);
      }, 1000);
    } catch (err) {
      console.error('Error creating post:', err);
      setError(err.response?.data?.detail || 'Не удалось создать статью');
    } finally {
      setSaving(false);
    }
  };

  // const handleCancel = () => {
  //   if (window.confirm('Отменить создание статьи?')) {
  //     navigate('/admin/posts');
  //   }
  // };

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
                  Новая статья
                </span>
              </h1>
              <p className="text-[#9b8b9b]">Создание публикации</p>
            </div>
          </div>
        </div>

        {/* Форма */}
        <div className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg p-8`}>
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

          {/* Ошибка */}
          {error && (
            <div className="mb-6 p-4 bg-[#ffebee] border border-[#ffcdd2] rounded-xl flex items-center gap-3">
              <AlertCircle className="text-[#d32f2f]" size={20} />
              <p className="text-[#d32f2f]">{error}</p>
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
                  { value: 'draft', label: 'Черновик', icon: Clock, color: 'bg-[#ffa726]/10 text-[#fb8c00] border-[#ffa726]/30 hover:border-[#ffa726]/50' },
                  { value: 'published', label: 'Опубликован', icon: Eye, color: 'bg-[#66bb6a]/10 text-[#43a047] border-[#66bb6a]/30 hover:border-[#66bb6a]/50' },
                  { value: 'archived', label: 'Архив', icon: EyeOff, color: 'bg-[#9b8b9b]/10 text-[#6b5e6b] border-[#9b8b9b]/30 hover:border-[#9b8b9b]/50' },
                ].map((status) => {
                  const Icon = status.icon;
                  const isSelected = form.status === status.value;

                  return (
                    <button
                      key={status.value}
                      type="button"
                      onClick={() => {
                        console.log('Выбран статус:', status.value);
                        setForm({ ...form, status: status.value });
                      }}
                      className={`p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 cursor-pointer ${
                        isSelected
                          ? `${status.color} border-current shadow-lg scale-105`
                          : 'bg-white border-[#e0d0e0] text-[#6b5e6b] hover:border-[#c8a2c8] hover:shadow-md'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-sm font-medium">{status.label}</span>
                      {isSelected && (
                        <span className="ml-1 w-2 h-2 rounded-full bg-current"></span>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="mt-2 text-xs text-[#9b8b9b]">
                Выбрано: <span className="font-medium text-[#6b5e6b]">{form.status}</span>
              </p>
            </div>

            <div className="flex items-center justify-end gap-4 pt-6 border-t border-[#e8d8e8]">


          <button
            type="button"
            onClick={() => {
              console.log('Отмена создания');
              if (window.confirm('Отменить создание статьи?')) {
                navigate('/admin/posts');
              }
            }}
            className="px-6 py-3 border-2 border-[#e0d0e0] text-[#6b5e6b] rounded-xl hover:bg-[#f8f0f8] transition-colors flex items-center gap-2 cursor-pointer"
          >
            <X size={18} />
            <span>Отмена</span>
          </button>

          <button
            type="submit"
            disabled={saving}
            onClick={() => {
              console.log('Создание статьи...', form);
            }}
            className={`px-8 py-3 bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] text-white rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer ${
              saving 
                ? 'opacity-70 cursor-not-allowed' 
                : 'hover:opacity-90 hover:-translate-y-0.5'
            }`}
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                <span>Создание...</span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>Создать статью</span>
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
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../../api/api_posts';
import Sidebar from '../../components/admin/Sidebar';
import {
  Search, Edit2, Trash2, EyeOff, AlertCircle,
  ArrowLeft, Archive, ChevronLeft, RotateCcw
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

export default function ArchivePosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [skip, setSkip] = useState(0);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchArchive();
  }, [skip, limit, search]);


  const fetchArchive = async () => {
    try {
      setLoading(true);
      setError('');

      const params = { skip, limit };
      if (search) params.search = search;

      const response = await postsAPI.getArchive(params);

      let rawData = [];


      if (Array.isArray(response.data)) {
        rawData = response.data;
        setTotal(response.data.length);
      } else if (response.data?.items) {
        rawData = response.data.items;
        setTotal(response.data.total);
      }

      rawData.forEach(p => console.log(`Проверка поста: "${p.title}" -> статус: "${p.status}"`));


      const validArchivePosts = rawData.filter(post => post.status === 'archived');

      setPosts(validArchivePosts);

    } catch (err) {
      console.error('Error fetching archive:', err);
      setError('Не удалось загрузить архив');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот пост НАВСЕГДА?')) return;

    try {
      await postsAPI.deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Не удалось удалить пост');
    }
  };

    const handleRestore = async (id) => {
    if (!window.confirm('Вернуть эту статью из архива? Она станет опубликованной.')) return;
    try {
        await postsAPI.restorePost(id);
        setPosts(posts.filter(post => post.id !== id));
        alert("Статья успешно возвращена в опубликованные!")
    } catch (err) {
        console.error('Error deleting post:', err);
        const message = err.response?.data?.detail || 'Не удалось вернуть статью';
        alert(message);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/posts/${id}/edit`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    });
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Sidebar>
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/admin/posts')} className="p-2 hover:bg-[#f8f0f8] rounded-xl">
            <ArrowLeft className="w-6 h-6 text-[#6b5e6b]" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#4a4a4a] mb-1">
              <span className="bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] bg-clip-text text-transparent">
                Архив
              </span>
            </h1>
            <p className="text-[#9b8b9b]">Заархивированные статьи</p>
          </div>
        </div>

        <div className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg p-4 mb-6`}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b8b9b]" size={20} />
            <input
              type="text"
              placeholder="Поиск в архиве..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setSkip(0); }}
              className="w-full pl-10 pr-4 py-2.5 border border-[#e8d8e8] rounded-xl focus:outline-none focus:border-[#c8a2c8]"
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-[#ffebee] border border-[#ffcdd2] rounded-xl flex items-center gap-3">
            <AlertCircle className="text-[#d32f2f]" size={20} />
            <p className="text-[#d32f2f]">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#c8a2c8] border-t-transparent"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg p-12 text-center`}>
            <Archive className="w-16 h-16 text-[#9b8b9b] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#4a4a4a] mb-2">Архив пуст</h3>
            <p className="text-[#6b5e6b]">Нет заархивированных статей</p>
          </div>
        ) : (
          <div className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg overflow-hidden`}>
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#faf7fa] to-[#f5f0f5] border-b border-[#e8d8e8]">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#4a4a4a]">Название</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#4a4a4a]">Дата архивации</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#4a4a4a]">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8d8e8]">
                {posts.map((post) => (
                 <tr key={post.id} className="hover:bg-[#faf7fa] transition-colors">

                    {/* 1. Колонка: НАЗВАНИЕ */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <h3 className="font-bold text-[#4a4a4a] text-base mb-1">
                          {post.title || 'Без названия'}
                        </h3>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center gap-1 text-xs text-[#9b8b9b] bg-[#f3e5f5] px-2 py-0.5 rounded-full">
                            <EyeOff size={10} />
                            Архив
                          </span>
                          {/* Мы убрали вывод (post.status), чтобы не путать пользователя */}
                        </div>
                      </div>
                    </td>

                    {/* 2. Колонка: ДАТА АРХИВАЦИИ */}
                    <td className="px-6 py-4 text-sm text-[#6b5e6b]">
                      {formatDate(post.updated_at)}
                    </td>

                    {/* 3. Колонка: ДЕЙСТВИЯ (Вернули кнопки!) */}
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {/* Кнопка Вернуть */}
                        <button
                          onClick={() => handleRestore(post.id)}
                          className="p-2 text-[#6b5e6b] hover:bg-[#e8d8e8] rounded-lg transition-colors"
                          title="Вернуть из архива"
                        >
                          <RotateCcw size={18} />
                        </button>

                        {/* Кнопка Редактировать */}
                        <button
                          onClick={() => handleEdit(post.id)}
                          className="p-2 text-[#42a5f5] hover:bg-[#42a5f5]/10 rounded-lg transition-colors"
                          title="Редактировать"
                        >
                          <Edit2 size={18} />
                        </button>

                        {/* Кнопка Удалить */}
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-[#ef5350] hover:bg-[#ef5350]/10 rounded-lg transition-colors"
                          title="Удалить навсегда"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="p-4 border-t border-[#e8d8e8] flex justify-between items-center">
                <p className="text-sm text-[#6b5e6b]">
                  {skip + 1} - {Math.min(skip + limit, total)} из {total}
                </p>
                <div className="flex gap-2">
                 <button
                      onClick={() => setSkip(skip - limit)}
                      disabled={skip === 0}
                      className="p-2 border border-[#e8d8e8] rounded-lg disabled:opacity-50 hover:bg-[#f8f0f8] transition-colors"
                    >
                      <ChevronLeft size={20} className="text-[#6b5e6b]" />
                    </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </Sidebar>
  );
}
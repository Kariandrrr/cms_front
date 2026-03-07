import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../../api/api_posts';
import Sidebar from '../../components/admin/Sidebar';
import {
  FileText, Search, Edit2, Trash2,
  EyeOff, ChevronLeft, ChevronRight,
  AlertCircle, CheckCircle, Clock, ArrowLeft
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

export default function MyPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchMyPosts();
  }, [skip, limit, search, statusFilter, sortBy, sortOrder]);

  const fetchMyPosts = async () => {
    try {
      setLoading(true);
      setError('');

      const params = {
        skip,
        limit,
        sort_by: sortBy,
        sort_order: sortOrder,
      };

      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;

      const response = await postsAPI.getMyPosts(params);

      if (response.data?.items) {
        setPosts(response.data.items);
        setTotal(response.data.total);
      } else if (Array.isArray(response.data)) {
        setPosts(response.data);
        setTotal(response.data.length);
      }

    } catch (err) {
      console.error('Error fetching my posts:', err);
      setError('Не удалось загрузить ваши посты');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этот пост?')) {
      return;
    }

    try {
      await postsAPI.deletePost(id);
      setPosts(posts.filter(post => post.id !== id));
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Не удалось удалить пост');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/posts/${id}/edit`);
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: { color: 'bg-[#ffa726]/10 text-[#fb8c00]', icon: Clock, label: 'Черновик' },
      published: { color: 'bg-[#66bb6a]/10 text-[#43a047]', icon: CheckCircle, label: 'Опубликован' },
      archived: { color: 'bg-[#9b8b9b]/10 text-[#6b5e6b]', icon: EyeOff, label: 'Архив' },
    };

    const badge = badges[status] || badges.draft;
    const Icon = badge.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
        <Icon size={12} />
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return '—';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(skip / limit) + 1;

  const goToPage = (page) => {
    const newSkip = (page - 1) * limit;
    setSkip(newSkip);
  };

  const goToPrevious = () => {
    if (skip > 0) setSkip(skip - limit);
  };

  const goToNext = () => {
    if (skip + limit < total) setSkip(skip + limit);
  };

  return (
    <Sidebar>
      <div className="p-8">
        {/* Заголовок */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/posts')}
            className="p-2 hover:bg-[#f8f0f8] rounded-xl transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-[#6b5e6b]" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-[#4a4a4a] mb-1">
              <span className="bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] bg-clip-text text-transparent">
                Мои статьи
              </span>
            </h1>
            <p className="text-[#9b8b9b]">Ваши личные публикации</p>
          </div>
        </div>

        {/* Фильтры */}
        <div className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg p-4 mb-6`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b8b9b]" size={20} />
              <input
                type="text"
                placeholder="Поиск..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSkip(0); }}
                className="w-full pl-10 pr-4 py-2.5 border border-[#e8d8e8] rounded-xl focus:outline-none focus:border-[#c8a2c8]"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setSkip(0); }}
              className="px-4 py-2.5 border border-[#e8d8e8] rounded-xl focus:outline-none focus:border-[#c8a2c8]"
            >
              <option value="">Все статусы</option>
              <option value="draft">Черновики</option>
              <option value="published">Опубликованы</option>
              <option value="archived">Архив</option>
            </select>
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
            <FileText className="w-16 h-16 text-[#9b8b9b] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#4a4a4a] mb-2">Нет постов</h3>
            <p className="text-[#6b5e6b]">У вас пока нет статей</p>
          </div>
        ) : (
          <div className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg overflow-hidden`}>
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#faf7fa] to-[#f5f0f5] border-b border-[#e8d8e8]">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#4a4a4a]">Название</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#4a4a4a]">Статус</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#4a4a4a]">Дата</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-[#4a4a4a]">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8d8e8]">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-[#faf7fa]">
                    <td className="px-6 py-4">
                      <h3 className="font-medium text-[#4a4a4a]">{post.title}</h3>
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(post.status)}</td>
                    <td className="px-6 py-4 text-sm text-[#6b5e6b]">{formatDate(post.created_at)}</td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button onClick={() => handleEdit(post.id)} className="p-2 text-[#42a5f5] hover:bg-[#42a5f5]/10 rounded-lg">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(post.id)} className="p-2 text-[#ef5350] hover:bg-[#ef5350]/10 rounded-lg">
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
                  <button onClick={goToPrevious} disabled={skip === 0} className="p-2 border rounded-lg disabled:opacity-50">
                    <ChevronLeft size={20} />
                  </button>
                  <button onClick={goToNext} disabled={skip + limit >= total} className="p-2 border rounded-lg disabled:opacity-50">
                    <ChevronRight size={20} />
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
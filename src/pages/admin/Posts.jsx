import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { postsAPI } from '../../api/api_posts';
import Sidebar from '../../components/admin/Sidebar';
import {
  FileText, Plus, Search, Filter, Edit2, Trash2,
  Eye, EyeOff, Calendar, User, ChevronLeft, ChevronRight,
  AlertCircle, CheckCircle, Clock
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

export default function Posts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Фильтры и пагинация
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchPosts();
  }, [skip, limit, search, statusFilter, sortBy, sortOrder]);

  const fetchPosts = async () => {
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

      const response = await postsAPI.getPosts(params);

      setPosts(response.data.items);
      setTotal(response.data.total);

    } catch (err) {
      console.error('Error fetching posts:', err);
      setError('Не удалось загрузить посты');
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

  const handlePublish = async (id) => {
    try {
      const response = await postsAPI.publishPost(id);
      setPosts(posts.map(post =>
        post.id === id ? response.data : post
      ));
    } catch (err) {
      console.error('Error publishing post:', err);
      alert('Не удалось опубликовать пост');
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/posts/${id}/edit`);
  };

  const handleCreate = () => {
    navigate('/admin/posts/new');
  };

  const getStatusBadge = (status) => {
    const badges = {
      draft: { color: 'bg-[#ffa726]/10 text-[#fb8c00]', icon: Clock, label: 'Черновик' },
      published: { color: 'bg-[#66bb6a]/10 text-[#43a047]', icon: CheckCircle, label: 'Опубликован' },
      archived: { color: 'bg-[#9b8b9b]/10 text-[#6b5e6b]', icon: EyeOff, label: 'Архив' },
      deleted: { color: 'bg-[#ef5350]/10 text-[#e53935]', icon: Trash2, label: 'Удалён' }
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
    if (skip > 0) {
      setSkip(skip - limit);
    }
  };

  const goToNext = () => {
    if (skip + limit < total) {
      setSkip(skip + limit);
    }
  };

  return (
    <Sidebar>
      <div className="p-8">
        {/* Заголовок */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#4a4a4a] mb-1">
              <span className="bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] bg-clip-text text-transparent">
                Статьи
              </span>
            </h1>
            <p className="text-[#9b8b9b]">Управление публикациями</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/admin/my-posts')}
              className="flex items-center gap-2 px-4 py-2 border-2 border-[#c8a2c8] text-[#c8a2c8] rounded-xl hover:bg-[#f8f0f8] transition-colors"
            >
              <User size={18} />
              <span>Мои статьи</span>
            </button>

            <button
              onClick={() => navigate('/admin/archive')}
              className="flex items-center gap-2 px-4 py-2 border-2 border-[#9b8b9b] text-[#9b8b9b] rounded-xl hover:bg-[#f8f0f8] transition-colors"
            >
              <EyeOff size={18} />
              <span>Архив</span>
            </button>

            <button
              onClick={handleCreate}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg"
            >
              <Plus size={18} />
              <span>Новая статья</span>
            </button>
          </div>
        </div>

        {/* Фильтры */}
        <div className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg p-4 mb-6`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b8b9b]" size={20} />
              <input
                type="text"
                placeholder="Поиск по названию..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSkip(0);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-[#e8d8e8] rounded-xl focus:outline-none focus:border-[#c8a2c8] focus:ring-2 focus:ring-[#c8a2c8]/20 transition-all"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="text-[#9b8b9b]" size={20} />
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setSkip(0);
                }}
                className="px-4 py-2.5 border border-[#e8d8e8] rounded-xl focus:outline-none focus:border-[#c8a2c8] focus:ring-2 focus:ring-[#c8a2c8]/20 transition-all bg-white"
              >
                <option value="">Все статусы</option>
                <option value="draft">Черновики</option>
                <option value="published">Опубликованы</option>
                <option value="archived">Архив</option>
              </select>
            </div>

            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [newSortBy, newSortOrder] = e.target.value.split('-');
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
              className="px-4 py-2.5 border border-[#e8d8e8] rounded-xl focus:outline-none focus:border-[#c8a2c8] focus:ring-2 focus:ring-[#c8a2c8]/20 transition-all bg-white"
            >
              <option value="created_at-desc">Сначала новые</option>
              <option value="created_at-asc">Сначала старые</option>
              <option value="updated_at-desc">По обновлению</option>
              <option value="title-asc">По названию (А-Я)</option>
              <option value="title-desc">По названию (Я-А)</option>
            </select>
          </div>
        </div>

        {/* Ошибка */}
        {error && (
          <div className="mb-6 p-4 bg-[#ffebee] border border-[#ffcdd2] rounded-xl flex items-center gap-3">
            <AlertCircle className="text-[#d32f2f]" size={20} />
            <p className="text-[#d32f2f]">{error}</p>
          </div>
        )}

        {/* Таблица постов */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#c8a2c8] border-t-transparent"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg p-12 text-center`}>
            <FileText className="w-16 h-16 text-[#9b8b9b] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#4a4a4a] mb-2">Нет постов</h3>
            <p className="text-[#6b5e6b] mb-6">Создайте первую статью, чтобы начать</p>
            <button
              onClick={handleCreate}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] text-white rounded-xl hover:opacity-90 transition-opacity"
            >
              <Plus size={20} />
              <span>Создать статью</span>
            </button>
          </div>
        ) : (
          <>
            <div className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg overflow-hidden`}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead className="bg-gradient-to-r from-[#faf7fa] to-[#f5f0f5] border-b border-[#e8d8e8]">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[#4a4a4a]">Название</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[#4a4a4a]">Статус</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[#4a4a4a]">Автор</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[#4a4a4a]">Дата создания</th>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-[#4a4a4a]">Действия</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e8d8e8]">
                    {posts.map((post) => (
                      <tr key={post.id} className="hover:bg-[#faf7fa] transition-colors group">
                        <td className="px-6 py-4">
                          <div>
                            <h3 className="font-medium text-[#4a4a4a] mb-1 group-hover:text-[#c8a2c8] transition-colors">
                              {post.title}
                            </h3>
                            {post.summary && (
                              <p className="text-sm text-[#9b8b9b] line-clamp-1">{post.summary}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          {getStatusBadge(post.status)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-[#6b5e6b]">
                            <User size={16} />
                            <span className="text-sm">{post.author_username || '—'}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-[#6b5e6b]">
                            <Calendar size={16} />
                            {formatDate(post.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {post.status !== 'published' && (
                              <button
                                onClick={() => handlePublish(post.id)}
                                className="p-2 text-[#66bb6a] hover:bg-[#66bb6a]/10 rounded-lg transition-colors"
                                title="Опубликовать"
                              >
                                <Eye size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => handleEdit(post.id)}
                              className="p-2 text-[#42a5f5] hover:bg-[#42a5f5]/10 rounded-lg transition-colors"
                              title="Редактировать"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(post.id)}
                              className="p-2 text-[#ef5350] hover:bg-[#ef5350]/10 rounded-lg transition-colors"
                              title="Удалить"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>


            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <p className="text-sm text-[#6b5e6b]">
                  Показано {skip + 1} - {Math.min(skip + limit, total)} из {total}
                </p>

                <div className="flex items-center gap-2">
                  <button
                    onClick={goToPrevious}
                    disabled={skip === 0}
                    className="p-2 border border-[#e8d8e8] rounded-lg hover:bg-[#f8f0f8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => goToPage(pageNum)}
                        className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] text-white shadow-lg'
                            : 'border border-[#e8d8e8] hover:bg-[#f8f0f8] text-[#6b5e6b]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={goToNext}
                    disabled={skip + limit >= total}
                    className="p-2 border border-[#e8d8e8] rounded-lg hover:bg-[#f8f0f8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Sidebar>
  );
}
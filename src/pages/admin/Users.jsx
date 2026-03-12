import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axiosinstance';
import Sidebar from '../../components/admin/Sidebar';
import {
  User, Users as UsersIcon, Search, Plus, Edit2, Trash2, Shield,
   Calendar, AlertCircle, CheckCircle,
  ChevronLeft, ChevronRight, Loader2
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

export default function UserForm() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [skip, setSkip] = useState(0);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, [skip, limit, search, roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');

      const params = { skip, limit };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;

      const response = await api.get('/api/auth/users/', { params });

      if (response.data?.items) {
        setUsers(response.data.items);
        setTotal(response.data.total);
      } else if (Array.isArray(response.data)) {
        setUsers(response.data);
        setTotal(response.data.length);
      } else {
        setUsers([]);
        setTotal(0);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.response?.data?.message || 'Не удалось загрузить пользователей');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Вы уверены, что хотите удалить этого пользователя?')) {
      return;
    }
    try {
      await api.delete(`/users/${id}`);
      setUsers(users.filter(user => user.id !== id));
      setSuccess('Пользователь успешно удален');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || 'Не удалось удалить пользователя');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/users/${id}/edit`);
  };

  const getRoleBadge = (role) => {
  console.log('Role from backend:', role);

  const roleLower = String(role).toLowerCase();

  const badges = {
    admin: { color: 'bg-[#ef5350]/10 text-[#e53935]', icon: Shield, label: 'Администратор' },
    editor: { color: 'bg-[#42a5f5]/10 text-[#1e88e5]', icon: Edit2, label: 'Редактор' },
    user: { color: 'bg-[#66bb6a]/10 text-[#43a047]', icon: User, label: 'Пользователь' },
  };

  const badge = badges[roleLower] || badges.user;
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
      year: 'numeric'
    });
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Sidebar>
      <div className="p-8">
        {/* Заголовок */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#4a4a4a] mb-1">
              <span className="bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] bg-clip-text text-transparent">
                Пользователи
              </span>
            </h1>
            <p className="text-[#9b8b9b]">Управление пользователями системы</p>
          </div>

          <button
            onClick={() => navigate('/admin/users/new')}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] text-white rounded-xl hover:opacity-90 transition-opacity shadow-lg"
          >
            <Plus size={20} />
            <span>Новый пользователь</span>
          </button>
        </div>

        {/* Фильтры */}
        <div className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg p-4 mb-6`}>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9b8b9b]" size={20} />
              <input
                type="text"
                placeholder="Поиск по имени..."
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSkip(0); }}
                className="w-full pl-10 pr-4 py-2.5 border border-[#e8d8e8] rounded-xl focus:outline-none focus:border-[#c8a2c8]"
              />
            </div>
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setSkip(0); }}
              className="px-4 py-2.5 border border-[#e8d8e8] rounded-xl focus:outline-none focus:border-[#c8a2c8]"
            >
              <option value="">Все роли</option>
              <option value="admin">Администраторы</option>
              <option value="editor">Редакторы</option>
              <option value="user">Пользователи</option>
            </select>
          </div>
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

        {/* Таблица */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="animate-spin h-12 w-12 text-[#c8a2c8]" />
          </div>
        ) : users.length === 0 ? (
          <div className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg p-12 text-center`}>
            <UsersIcon className="w-16 h-16 text-[#9b8b9b] mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-[#4a4a4a] mb-2">Нет пользователей</h3>
            <p className="text-[#6b5e6b] mb-6">Создайте первого пользователя</p>
            <button
              onClick={() => navigate('/admin/users/new')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] text-white rounded-xl"
            >
              <Plus size={20} />
              <span>Создать пользователя</span>
            </button>
          </div>
        ) : (
          <div className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg overflow-hidden`}>
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#faf7fa] to-[#f5f0f5] border-b border-[#e8d8e8]">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#4a4a4a]">Пользователь</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#4a4a4a]">Роль</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#4a4a4a]">Дата регистрации</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-[#4a4a4a]">Действия</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8d8e8]">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-[#faf7fa] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c8a2c8] to-[#b088b0] flex items-center justify-center text-white font-bold">
                            {user.username?.[0]?.toUpperCase() || 'U'}
                          </div>
                          <div>
                            <p className="font-medium text-[#4a4a4a]">{user.username}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getRoleBadge(user.role)}</td>
                      <td className="px-6 py-4 text-sm text-[#6b5e6b]">
                        <div className="flex items-center gap-2">
                          <Calendar size={14} />
                          {formatDate(user.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(user.id)}
                            className="p-2 text-[#42a5f5] hover:bg-[#42a5f5]/10 rounded-lg transition-colors"
                            title="Редактировать"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
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

            {/* Пагинация */}
            {totalPages > 1 && (
              <div className="p-4 border-t border-[#e8d8e8] flex justify-between items-center">
                <p className="text-sm text-[#6b5e6b]">
                  {skip + 1} - {Math.min(skip + limit, total)} из {total}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSkip(Math.max(0, skip - limit))}
                    disabled={skip === 0}
                    className="p-2 border border-[#e8d8e8] rounded-lg hover:bg-[#f8f0f8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={() => setSkip(skip + limit)}
                    disabled={skip + limit >= total}
                    className="p-2 border border-[#e8d8e8] rounded-lg hover:bg-[#f8f0f8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
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
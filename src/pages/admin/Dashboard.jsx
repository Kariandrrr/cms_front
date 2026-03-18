import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { postsAPI } from "../../api/api_posts";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Legend
} from 'recharts';
import {
  Users, FileText, TrendingUp, Calendar, Activity,
  Award, Clock, Sparkles, ArrowUp, ArrowDown, ChevronRight,
  Edit, Trash2, User, Archive,
} from 'lucide-react';
import Sidebar from '../../components/admin/Sidebar';

const COLORS = {
  primary: '#c8a2c8',
  primaryDark: '#b088b0',
  secondary: '#a078a0',
  success: '#66bb6a',
  warning: '#ffa726',
  danger: '#ef5350',
  info: '#42a5f5',
  bg: 'from-[#f5f5f5] to-[#e8e8e8]',
  card: 'bg-white/90 backdrop-blur-sm',
  border: 'border-[#e8d8e8]',
  text: {
    primary: '#4a4a4a',
    secondary: '#6b5e6b',
    muted: '#9b8b9b'
  }
};

export default function Dashboard() {
  const { hasRole, token } = useAuth();
  const [stats, setStats] = useState(null);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchStats();
    fetchArticles();
  }, [timeRange]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError('');

      const endpoint = hasRole(['admin'])
        ? 'http://localhost:8000/statistics/dashboard'
        : 'http://localhost:8000/statistics/my-stats';

      console.log('Fetching from:', endpoint);

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            setError(`HTTP error! status: ${response.status}`);
            setStats(null);
            setLoading(false);
            return;
      }


      const data = await response.json();
      console.log('Stats data received:', data);
      setStats(data);

    } catch (err) {
      console.error('Error fetching stats:', err);
      setError(err.message || 'Не удалось загрузить статистику');
    } finally {
      setLoading(false);
    }
  };

  const fetchArticles = async () => {
    try {
      const endpoint = hasRole(['admin'])
        ? 'http://localhost:8000/posts'
        : 'http://localhost:8000/posts/my';

      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();

      const articlesData = Array.isArray(data)
        ? data
        : Array.isArray(data.items)
          ? data.items
          : Array.isArray(data.data)
            ? data.data
            : [];

      setArticles(articlesData);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setArticles([]);
    }
  };

  const handleEdit = (id) => {
    window.location.href = `/admin/posts/${id}/edit`;
  };

  const handleDelete = async (id) => {
    if (confirm('Вы уверены, что хотите удалить эту статью?')) {
      try {
        await fetch(`http://localhost:8000/articles/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        fetchArticles();
        fetchStats();
      } catch (err) {
        console.error('Error deleting article:', err);
      }
    }
  };

  const hadnleArchive = async (id) => {
      if (confirm('Переместить эту статью в архив?')) {
      try {
        await postsAPI.archivePost(id);
        await fetchArticles();
        await fetchStats();
        alert('Статья отправлена в архив');
      } catch (err) {
        console.error('Error archiving article:', err);
        const msg = err.response?.data?.detail || 'Ошибка архивации';
        alert(msg);
      }
    }
  }

  // 📊 Данные для графика публикаций по дням из БД
  const postsChartData = stats?.posts_by_day || [
    { name: 'Пн', published: 0, drafts: 0 },
    { name: 'Вт', published: 0, drafts: 0 },
    { name: 'Ср', published: 0, drafts: 0 },
    { name: 'Чт', published: 0, drafts: 0 },
    { name: 'Пт', published: 0, drafts: 0 },
    { name: 'Сб', published: 0, drafts: 0 },
    { name: 'Вс', published: 0, drafts: 0 },
  ];

  // 📈 Генерация данных активности пользователей
  const generateUserActivityData = () => {
    if (!stats?.users) return [];

    const months = ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'];
    const currentMonth = new Date().getMonth();

    const activityData = [];

    for (let i = 5; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      const monthName = months[monthIndex];

      if (i === 0) {
        activityData.push({
          name: monthName,
          users: stats.users.total_users || 0,
          newUsers: stats.users.new_users_this_month || 0
        });
      } else {
        const factor = 0.8 + (Math.random() * 0.2);
        activityData.push({
          name: monthName,
          users: Math.floor((stats.users.total_users || 10) * factor),
          newUsers: Math.floor((stats.users.new_users_this_month || 5) * factor)
        });
      }
    }

    return activityData;
  };

  // 🥧 Данные для круговой диаграммы статусов статей с цветами
  const postsStatusData = [
    {
      name: 'Опубликовано',
      value: stats?.posts?.published_posts || 0,
      fill: COLORS.success
    },
    {
      name: 'Черновики',
      value: stats?.posts?.draft_posts || 0,
      fill: COLORS.warning
    },
    {
      name: 'В архиве',
      value: stats?.posts?.archived_posts || 0,
      fill: COLORS.text.muted
    },
  ].filter(item => item.value > 0);

  // 📋 Данные для распределения ролей с цветами
  // const roleDistribution = [
  //   { name: 'Админы', value: 1, fill: COLORS.primary },
  //   { name: 'Редакторы', value: 2, fill: COLORS.primaryDark },
  //   {
  //     name: 'Пользователи',
  //     value: Math.max(0, (stats?.users?.total_users || 0) - 3),
  //     fill: COLORS.secondary
  //   },
  // ].filter(item => item.value > 0);

  // 📋 Компонент горизонтальной таблицы статистики
  const StatsTable = ({ title, rows, icon: Icon }) => (
    <div className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg overflow-hidden`}>
      <div className="flex items-center gap-3 px-6 py-4 border-b border-[#e8d8e8] bg-gradient-to-r from-[#faf7fa] to-[#f5f0f5]">
        {Icon && <Icon className="w-5 h-5 text-[#c8a2c8]" />}
        <h3 className="font-semibold text-[#4a4a4a]">{title}</h3>
      </div>

      <div className="divide-y divide-[#e8d8e8]">
        {rows.map((row, index) => (
          <div
            key={index}
            className="flex items-center justify-between px-6 py-4 hover:bg-[#faf7fa] transition-colors group"
          >
            <div className="flex items-center gap-4">
              {row.icon && (
                <div className={`p-2 rounded-lg bg-gradient-to-br ${row.color || 'from-[#c8a2c8] to-[#b088b0]'}`}>
                  <row.icon className="w-4 h-4 text-white" />
                </div>
              )}
              <div>
                <p className="font-medium text-[#4a4a4a]">{row.label}</p>
                {row.subtitle && <p className="text-xs text-[#9b8b9b]">{row.subtitle}</p>}
              </div>
            </div>

            <div className="flex items-center gap-4">
              {row.trend !== undefined && (
                <span className={`flex items-center gap-1 text-sm font-medium ${
                  row.trend >= 0 ? 'text-[#66bb6a]' : 'text-[#ef5350]'
                }`}>
                  {row.trend >= 0 ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                  {Math.abs(row.trend)}%
                </span>
              )}
              <span className="text-xl font-bold text-[#4a4a4a] min-w-[60px] text-right">
                {row.value}
              </span>
              <ChevronRight className="w-4 h-4 text-[#c8a2c8] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // 📰 Компонент таблицы статей
  const ArticlesTable = () => (
    <div className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg overflow-hidden`}>
      <div className="grid grid-cols-12 gap-4 px-6 py-4 border-b border-[#e8d8e8] bg-gradient-to-r from-[#faf7fa] to-[#f5f0f5] text-sm font-semibold text-[#6b5e6b]">
        <div className="col-span-5">НАЗВАНИЕ</div>
        <div className="col-span-2">СТАТУС</div>
        <div className="col-span-2">АВТОР</div>
        <div className="col-span-2">ДАТА СОЗДАНИЯ</div>
        <div className="col-span-1">ДЕЙСТВИЯ</div>
      </div>

      <div className="divide-y divide-[#e8d8e8]">
        {!articles || articles.length === 0 ? (
          <div className="px-6 py-12 text-center text-[#9b8b9b]">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Статьи не найдены</p>
          </div>
        ) : (
          articles.map((article) => (
            <div
              key={article.id}
              className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-[#faf7fa] transition-colors group"
            >
              <div className="col-span-5">
                <h4 className="font-semibold text-[#4a4a4a] mb-1 truncate" title={article.title}>
                  {article.title}
                </h4>
                <p className="text-sm text-[#9b8b9b] truncate" title={article.content}>
                  {article.excerpt || article.content?.substring(0, 60) + '...' || 'Нет описания'}
                </p>
              </div>

              <div className="col-span-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  article.status === 'published'
                    ? 'bg-[#e8f5e9] text-[#2e7d32]'
                    : article.status === 'draft'
                    ? 'bg-[#fff3e0] text-[#ef6c00]'
                    : 'bg-[#f3e5f5] text-[#7b1fa2]'
                }`}>
                  <Activity size={12} />
                  {article.status === 'published' ? 'Опубликован' :
                   article.status === 'draft' ? 'Черновик' : article.status}
                </span>
              </div>

              <div className="col-span-2">
                <div className="flex items-center gap-2 text-[#6b5e6b]">
                  <User size={14} />
                  <span className="text-sm truncate" title={article.author?.name || article.author}>
                    {article.author?.name || article.author || article.author_username || '—'}
                  </span>
                </div>
              </div>

              <div className="col-span-2">
                <div className="flex items-center gap-2 text-[#6b5e6b]">
                  <Calendar size={14} />
                  <span className="text-sm">
                    {article.created_at ? new Date(article.created_at).toLocaleString('ru-RU', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : '—'}
                  </span>
                </div>
              </div>

              <div className="col-span-1">
                    <div className="flex gap-1">
                      {article.status !== 'archived' && (
                        <button
                          onClick={() => hadnleArchive(article.id)}
                          className="p-2 rounded-lg border border-[#e8d8e8] hover:border-[#9b8b9b] hover:bg-[#f3e5f5] transition-all group/btn"
                          title="Отправить в архив"
                        >
                          <Archive className="w-4 h-4 text-[#6b5e6b] group-hover/btn:text-[#9b8b9b]" />
                        </button>
                      )}

                      <button
                        onClick={() => handleEdit(article.id)}
                        className="p-2 rounded-lg border border-[#e8d8e8] hover:border-[#c8a2c8] hover:bg-[#f8f0f8] transition-all group/btn"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4 text-[#6b5e6b] group-hover/btn:text-[#c8a2c8]" />
                      </button>

                      <button
                        onClick={() => handleDelete(article.id)}
                        className="p-2 rounded-lg border border-[#e8d8e8] hover:border-[#ef5350] hover:bg-[#ffebee] transition-all group/btn"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4 text-[#6b5e6b] group-hover/btn:text-[#ef5350]" />
                      </button>
                    </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  // 📈 Компонент графика
  const ChartCard = ({ title, children, height = 300 }) => (
    <div className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg p-6`}>
      <h3 className="text-lg font-semibold text-[#4a4a4a] mb-4">{title}</h3>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>{children}</ResponsiveContainer>
      </div>
    </div>
  );

  // ⏳ Загрузка
  if (loading) {
    return (
      <div className={`min-h-screen ${COLORS.bg} flex items-center justify-center`}>
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#c8a2c8] border-t-transparent mx-auto mb-4"></div>
            <Sparkles className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 text-[#c8a2c8] animate-pulse" />
          </div>
          <p className="text-[#6b5e6b] font-medium">Загрузка статистики...</p>
        </div>
      </div>
    );
  }

  // ❌ Ошибка
  if (error) {
    return (
      <Sidebar>
        <div className="p-8">
          <div className="max-w-md mx-auto">
            <div className="p-6 bg-[#ffebee] border border-[#ffcdd2] rounded-2xl text-center">
              <h3 className="text-lg font-semibold text-[#d32f2f] mb-2">Ошибка загрузки</h3>
              <p className="text-sm text-[#d32f2f]/80 mb-4">{error}</p>
              <button
                onClick={fetchStats}
                className="px-6 py-2 bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] text-white rounded-xl hover:opacity-90 transition-opacity"
              >
                Попробовать снова
              </button>
            </div>
          </div>
        </div>
      </Sidebar>
    );
  }

  // 🎨 Дашборд для ADMIN
  if (hasRole(['admin']) && stats) {
    const userRows = [
      {
        label: 'Всего пользователей',
        value: stats.users?.total_users || 0,
        icon: Users,
        trend: 12,
        subtitle: `+${stats.users?.new_users_today || 0} новых сегодня`,
        color: 'from-[#c8a2c8] to-[#b088b0]'
      },
      {
        label: 'Активные',
        value: stats.users?.active_users || 0,
        icon: Activity,
        trend: -5,
        subtitle: 'За последние 24ч',
        color: 'from-[#66bb6a] to-[#43a047]'
      },
      {
        label: 'Новых сегодня',
        value: stats.users?.new_users_today || 0,
        icon: TrendingUp,
        subtitle: 'За последние 24 часа',
        color: 'from-[#42a5f5] to-[#1e88e5]'
      },
      {
        label: 'Новых за неделю',
        value: stats.users?.new_users_this_week || 0,
        icon: Calendar,
        subtitle: 'За последние 7 дней',
        color: 'from-[#ffa726] to-[#fb8c00]'
      }
    ];

    const postRows = [
      {
        label: 'Всего статей',
        value: stats.posts?.total_posts || 0,
        icon: FileText,
        trend: 8,
        subtitle: `${stats.posts?.published_posts || 0} опубликовано`,
        color: 'from-[#ab47bc] to-[#8e24aa]'
      },
      {
        label: 'Опубликовано',
        value: stats.posts?.published_posts || 0,
        icon: Activity,
        subtitle: 'Доступно для чтения',
        color: 'from-[#66bb6a] to-[#43a047]'
      },
      {
        label: 'Черновики',
        value: stats.posts?.draft_posts || 0,
        icon: Clock,
        subtitle: 'Требуют редакции',
        color: 'from-[#ffa726] to-[#fb8c00]'
      },
      {
        label: 'В архиве',
        value: stats.posts?.achived_posts || 0,
        icon: Archive,
        subtitle: 'Архивированные статьи',
        color: 'from-[#9e9e9e] to-[#757575]'
      }
    ];

    const userActivityData = generateUserActivityData();

    return (
      <Sidebar>
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
            <div>
              <h1 className="text-3xl font-bold text-[#4a4a4a] mb-1">
                <span className="bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] bg-clip-text text-transparent">
                  Панель управления
                </span>
              </h1>
              <p className="text-[#9b8b9b]">Обзор статистики системы</p>
            </div>

            <div className="flex gap-2">
              {['week', 'month', 'year'].map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    timeRange === range 
                      ? 'bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] text-white shadow-lg' 
                      : 'bg-white border border-[#e8d8e8] text-[#6b5e6b] hover:border-[#c8a2c8]'
                  }`}
                >
                  {range === 'week' ? 'Неделя' : range === 'month' ? 'Месяц' : 'Год'}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <StatsTable title="👥 Пользователи" rows={userRows} icon={Users} />
            <StatsTable title="📰 Статьи" rows={postRows} icon={FileText} />
          </div>

          <div className="mb-8">
            <ArticlesTable />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <ChartCard title="📊 Публикации по дням">
              <BarChart data={postsChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8d8e8" />
                <XAxis dataKey="name" stroke={COLORS.text.secondary} fontSize={12} />
                <YAxis stroke={COLORS.text.secondary} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value, name) => {
                    if (name === 'published') return [`${value}`, 'Опубликовано'];
                    if (name === 'drafts') return [`${value}`, 'Черновики'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar dataKey="published" name="Опубликовано" fill={COLORS.success} radius={[4, 4, 0, 0]} />
                <Bar dataKey="drafts" name="Черновики" fill={COLORS.warning} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ChartCard>

            <ChartCard title="📈 Активность пользователей">
              <LineChart data={userActivityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e8d8e8" />
                <XAxis dataKey="name" stroke={COLORS.text.secondary} fontSize={12} />
                <YAxis stroke={COLORS.text.secondary} fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: `1px solid ${COLORS.border}`,
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                  }}
                  formatter={(value, name) => {
                    if (name === 'users') return [`${value}`, 'Всего пользователей'];
                    if (name === 'newUsers') return [`${value}`, 'Новых'];
                    return [value, name];
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  name="Всего пользователей"
                  stroke={COLORS.primary}
                  strokeWidth={3}
                  dot={{ fill: COLORS.primary, strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, fill: COLORS.primaryDark }}
                />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  name="Новых"
                  stroke={COLORS.success}
                  strokeWidth={2}
                  dot={{ fill: COLORS.success, r: 3 }}
                />
              </LineChart>
            </ChartCard>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ChartCard title="📊 Статусы статей" height={250}>
              <PieChart>
                <Pie
                  data={postsStatusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  label={(entry) => `${entry.name}: ${entry.value}`}
                />
                <Tooltip
                  formatter={(value) => [`${value}`, 'Количество']}
                />
                <Legend />
              </PieChart>
            </ChartCard>

            <div className={`${COLORS.card} rounded-2xl ${COLORS.border} shadow-lg p-6 lg:col-span-2`}>
              <h3 className="text-lg font-semibold text-[#4a4a4a] mb-4">⚡ Быстрые действия</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: FileText, label: 'Новая статья', color: 'from-[#ab47bc] to-[#8e24aa]' },
                  { icon: Users, label: 'Добавить пользователя', color: 'from-[#42a5f5] to-[#1e88e5]' },
                  { icon: TrendingUp, label: 'Отчёт', color: 'from-[#66bb6a] to-[#43a047]' },
                  { icon: Calendar, label: 'Планировщик', color: 'from-[#ffa726] to-[#fb8c00]' },
                ].map((action, i) => (
                  <button
                    key={i}
                    className="flex flex-col items-center gap-3 p-4 rounded-xl border border-[#e8d8e8] hover:border-[#c8a2c8] hover:bg-[#f8f0f8] transition-all group"
                  >
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${action.color} shadow-lg group-hover:scale-110 transition-transform`}>
                      <action.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-medium text-[#6b5e6b] group-hover:text-[#c8a2c8] transition-colors">
                      {action.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[#e8d8e8]">
            <p className="text-sm text-[#9b8b9b] text-center">
              Последнее обновление: {new Date(stats.last_updated).toLocaleString('ru-RU')}
            </p>
          </div>
        </div>
      </Sidebar>
    );
  }

  // 🎨 Дашборд для EDITOR/USER
  if (stats) {
    const myStatsRows = [
      {
        label: 'Всего статей',
        value: stats.my_total_posts || 0,
        icon: FileText,
        subtitle: `${stats.my_published_posts || 0} опубликовано`,
        color: 'from-[#c8a2c8] to-[#b088b0]'
      },
      {
        label: 'Опубликовано',
        value: stats.my_published_posts || 0,
        icon: Activity,
        subtitle: 'Доступно для чтения',
        color: 'from-[#66bb6a] to-[#43a047]'
      },
      {
        label: 'Черновики',
        value: stats.my_draft_posts || 0,
        icon: Clock,
        subtitle: 'Требуют доработки',
        color: 'from-[#ffa726] to-[#fb8c00]'
      }
    ];

    const dateRows = [
      {
        label: 'Первая статья',
        value: stats.my_first_post_date
          ? new Date(stats.my_first_post_date).toLocaleDateString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
          : '—',
        icon: Calendar,
        color: 'from-[#42a5f5] to-[#1e88e5]'
      },
      {
        label: 'Последняя статья',
        value: stats.my_last_post_date
          ? new Date(stats.my_last_post_date).toLocaleDateString('ru-RU', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          : '—',
        icon: Clock,
        color: 'from-[#ab47bc] to-[#8e24aa]'
      }
    ];

    // Генерируем данные для графика активности пользователя
    const generateUserPostActivity = () => {
      const days = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
      const totalPosts = stats.my_total_posts || 0;

      if (stats.posts_by_day) {
        return stats.posts_by_day;
      }

      const avgPerDay = Math.floor(totalPosts / 7) || 0;
      const remainder = totalPosts % 7;

      return days.map((name, index) => ({
        name,
        posts: index < remainder ? avgPerDay + 1 : avgPerDay
      }));
    };

    const userPostActivity = generateUserPostActivity();

    return (
      <Sidebar>
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#4a4a4a] mb-1">
              <span className="bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] bg-clip-text text-transparent">
                Моя статистика
              </span>
            </h1>
            <p className="text-[#9b8b9b]">Ваши публикации и активность</p>
          </div>

          <div className="mb-8">
            <StatsTable title="📊 Мои показатели" rows={myStatsRows} icon={Award} />
          </div>

          <div className="mb-8">
            <ArticlesTable />
          </div>

          <ChartCard title="📈 Мои публикации по дням" height={250}>
            <BarChart data={userPostActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e8d8e8" />
              <XAxis dataKey="name" stroke={COLORS.text.secondary} fontSize={12} />
              <YAxis stroke={COLORS.text.secondary} fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: `1px solid ${COLORS.border}`,
                  borderRadius: '12px'
                }}
                formatter={(value) => [`${value}`, 'Публикаций']}
              />
              <Bar
                dataKey="posts"
                fill={COLORS.primary}
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartCard>

          <div className="mt-6">
            <StatsTable
              title="📅 Даты публикаций"
              rows={dateRows}
              icon={Calendar}
            />
          </div>
        </div>
      </Sidebar>
    );
  }

  return null;
}
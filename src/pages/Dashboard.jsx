import { useState } from 'react';
import {
  Users,
  FileText,
  Eye,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Calendar,
  Activity,
  Download
} from 'lucide-react';

export default function Dashboard() {
  const [period, setPeriod] = useState('week');

  const stats = [
    {
      label: 'Всего статей',
      value: '234',
      change: '+12',
      trend: 'up',
      icon: <FileText className="w-5 h-5 text-[#c8a2c8]" />,
      bg: 'bg-[#f8f0f8]'
    },
    {
      label: 'Просмотры',
      value: '45.2K',
      change: '+23%',
      trend: 'up',
      icon: <Eye className="w-5 h-5 text-[#b088b0]" />,
      bg: 'bg-[#f8f0f8]'
    },
    {
      label: 'Пользователи',
      value: '1,234',
      change: '+5%',
      trend: 'up',
      icon: <Users className="w-5 h-5 text-[#c8a2c8]" />,
      bg: 'bg-[#f8f0f8]'
    },
    {
      label: 'Комментарии',
      value: '89',
      change: '-2',
      trend: 'down',
      icon: <Activity className="w-5 h-5 text-[#b088b0]" />,
      bg: 'bg-[#f8f0f8]'
    }
  ];

  const recentArticles = [
    { title: 'Как создать современный дизайн', author: 'Анна Д.', views: 1234, date: '2026-02-15', status: 'published' },
    { title: 'Тренды веб-разработки 2026', author: 'Михаил К.', views: 987, date: '2026-02-14', status: 'published' },
    { title: 'Оптимизация производительности', author: 'Елена В.', views: 756, date: '2026-02-13', status: 'draft' },
    { title: 'UI/UX лучшие практики', author: 'Дмитрий С.', views: 543, date: '2026-02-12', status: 'published' },
  ];

  const activityData = [
    { day: 'Пн', value: 45 },
    { day: 'Вт', value: 62 },
    { day: 'Ср', value: 58 },
    { day: 'Чт', value: 78 },
    { day: 'Пт', value: 82 },
    { day: 'Сб', value: 65 },
    { day: 'Вс', value: 43 },
  ];

  return (
    <div className="space-y-5">
      {/* Заголовок с периодом */}
      <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-[#e8d8e8]">
        <div>
          <h1 className="text-xl font-bold text-[#4a4a4a]">Добро пожаловать!</h1>
          <p className="text-sm text-[#9b8b9b] mt-0.5">Вот что происходит в вашей системе сегодня</p>
        </div>
        <div className="flex items-center gap-2 bg-[#f8f8f8] p-1 rounded-lg border border-[#e8d8e8]">
          <button
            onClick={() => setPeriod('week')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              period === 'week' 
                ? 'bg-[#c8a2c8] text-white' 
                : 'text-[#6b5e6b] hover:bg-[#f8f0f8]'
            }`}
          >
            Неделя
          </button>
          <button
            onClick={() => setPeriod('month')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              period === 'month' 
                ? 'bg-[#c8a2c8] text-white' 
                : 'text-[#6b5e6b] hover:bg-[#f8f0f8]'
            }`}
          >
            Месяц
          </button>
          <button
            onClick={() => setPeriod('year')}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              period === 'year' 
                ? 'bg-[#c8a2c8] text-white' 
                : 'text-[#6b5e6b] hover:bg-[#f8f0f8]'
            }`}
          >
            Год
          </button>
        </div>
      </div>

      {/* Статистика - сетка для десктопа */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl border border-[#e8d8e8] p-5 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className={`p-2.5 rounded-lg ${stat.bg}`}>
                {stat.icon}
              </div>
              <button className="text-[#b8a8b8] hover:text-[#c8a2c8]">
                <MoreVertical size={16} />
              </button>
            </div>
            <div className="mt-3">
              <p className="text-xs text-[#9b8b9b]">{stat.label}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold text-[#4a4a4a]">{stat.value}</span>
                <span className={`flex items-center gap-0.5 text-xs ${
                  stat.trend === 'up' ? 'text-[#4caf50]' : 'text-[#f44336]'
                }`}>
                  {stat.trend === 'up' ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                  {stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* График активности и быстрые действия - 2 колонки для десктопа */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* График активности - занимает 2 колонки */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-[#e8d8e8] p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[#4a4a4a] text-sm">Активность пользователей</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 text-xs text-[#9b8b9b]">
                <Calendar size={14} />
                <span>Последние 7 дней</span>
              </div>
              <button className="p-1.5 hover:bg-[#f8f0f8] rounded-lg transition-colors">
                <Download size={14} className="text-[#9b8b9b]" />
              </button>
            </div>
          </div>
          <div className="h-48 flex items-end gap-2">
            {activityData.map((item, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full bg-gradient-to-t from-[#c8a2c8] to-[#e0c0e0] rounded-t-lg transition-all hover:from-[#b088b0]"
                  style={{ height: `${item.value}%` }}
                ></div>
                <span className="text-xs text-[#9b8b9b]">{item.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Быстрые действия */}
        <div className="bg-white rounded-xl border border-[#e8d8e8] p-5">
          <h3 className="font-semibold text-[#4a4a4a] text-sm mb-3">Быстрые действия</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2.5 bg-[#f8f0f8] text-[#6b5e6b] rounded-lg hover:bg-[#f0e4f0] hover:text-[#c8a2c8] transition-colors text-sm flex items-center gap-2">
              <span className="text-base">✍️</span>
              Новая статья
            </button>
            <button className="w-full text-left px-3 py-2.5 bg-[#f8f0f8] text-[#6b5e6b] rounded-lg hover:bg-[#f0e4f0] hover:text-[#c8a2c8] transition-colors text-sm flex items-center gap-2">
              <span className="text-base">👥</span>
              Добавить пользователя
            </button>
            <button className="w-full text-left px-3 py-2.5 bg-[#f8f0f8] text-[#6b5e6b] rounded-lg hover:bg-[#f0e4f0] hover:text-[#c8a2c8] transition-colors text-sm flex items-center gap-2">
              <span className="text-base">📁</span>
              Создать категорию
            </button>
            <button className="w-full text-left px-3 py-2.5 bg-[#f8f0f8] text-[#6b5e6b] rounded-lg hover:bg-[#f0e4f0] hover:text-[#c8a2c8] transition-colors text-sm flex items-center gap-2">
              <span className="text-base">📊</span>
              Отчеты
            </button>
          </div>
        </div>
      </div>

      {/* Недавние статьи - на всю ширину */}
      <div className="bg-white rounded-xl border border-[#e8d8e8] p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-[#4a4a4a] text-sm">Недавние статьи</h3>
          <button className="text-xs text-[#c8a2c8] hover:text-[#b088b0] transition-colors flex items-center gap-1">
            Все статьи
            <span>→</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#e8d8e8]">
                <th className="text-left py-2.5 px-3 text-xs font-medium text-[#9b8b9b] uppercase tracking-wider">Название</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-[#9b8b9b] uppercase tracking-wider">Автор</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-[#9b8b9b] uppercase tracking-wider">Просмотры</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-[#9b8b9b] uppercase tracking-wider">Дата</th>
                <th className="text-left py-2.5 px-3 text-xs font-medium text-[#9b8b9b] uppercase tracking-wider">Статус</th>
              </tr>
            </thead>
            <tbody>
              {recentArticles.map((article, index) => (
                <tr key={index} className="border-b border-[#e8d8e8] hover:bg-[#f8f0f8] transition-colors">
                  <td className="py-2.5 px-3 text-xs text-[#4a4a4a]">{article.title}</td>
                  <td className="py-2.5 px-3 text-xs text-[#6b5e6b]">{article.author}</td>
                  <td className="py-2.5 px-3 text-xs text-[#6b5e6b]">{article.views.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-xs text-[#6b5e6b]">{new Date(article.date).toLocaleDateString('ru-RU')}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                      article.status === 'published' 
                        ? 'bg-[#e8f5e9] text-[#4caf50]' 
                        : 'bg-[#fff3e0] text-[#ff9800]'
                    }`}>
                      {article.status === 'published' ? 'Опубликовано' : 'Черновик'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import {
  LogOut,
  LayoutDashboard,
  FileText,
  Users,
  FolderTree,
  ChevronDown,
  Menu,
  X,
  Bell,
  Search,
  Settings,
  Sparkles
} from 'lucide-react';
import { cn } from '../utils/cn';
import { useState } from 'react';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const navItems = [
    {
      label: 'Дашборд',
      path: '/admin/dashboard',
      icon: <LayoutDashboard size={20} />,
      roles: ['admin', 'editor'],
      description: 'Общая статистика'
    },
    {
      label: 'Статьи',
      path: '/admin/articles',
      icon: <FileText size={20} />,
      roles: ['admin', 'editor'],
      description: 'Управление контентом'
    },
    {
      label: 'Пользователи',
      path: '/admin/users',
      icon: <Users size={20} />,
      roles: ['admin'],
      description: 'Управление доступом'
    },
    {
      label: 'Категории',
      path: '/admin/categories',
      icon: <FolderTree size={20} />,
      roles: ['admin', 'editor'],
      description: 'Рубрики и теги'
    },
  ];

  const filteredNavItems = navItems.filter(item =>
    item.roles.includes(user?.role)
  );

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-white border border-[#e8d8e8] rounded-xl shadow-md text-[#6b5e6b] hover:text-[#c8a2c8] transition-colors"
      >
        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-[#e8d8e8] flex flex-col transition-transform duration-300 shadow-lg",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className="p-5 border-b border-[#e8d8e8] bg-gradient-to-r from-white to-[#faf5fa]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c8a2c8] to-[#b088b0] flex items-center justify-center shadow-md shadow-[#c8a2c8]/30">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold">
                <span className="text-[#c8a2c8]">Content</span>
                <span className="text-[#b088b0]">CMS</span>
              </h1>
              <p className="text-xs text-[#9b8b9b]">Управление контентом</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            <p className="px-3 text-xs font-semibold text-[#b8a8b8] uppercase tracking-wider mb-2">
              Меню
            </p>
            {filteredNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 group text-sm",
                    isActive
                      ? "bg-gradient-to-r from-[#f8f0f8] to-transparent text-[#b088b0] border-l-2 border-[#c8a2c8]"
                      : "text-[#6b5e6b] hover:bg-[#f8f0f8] hover:text-[#c8a2c8]"
                  )
                }
              >
                <span className={cn(
                  "transition-colors",
                  "group-hover:text-[#c8a2c8]"
                )}>
                  {item.icon}
                </span>
                <div className="flex-1">
                  <p className="font-medium">{item.label}</p>
                </div>
                {item.label === 'Статьи' && (
                  <span className="px-1.5 py-0.5 text-xs bg-[#f0e4f0] text-[#b088b0] rounded-full">12</span>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* User profile */}
        <div className="p-3 border-t border-[#e8d8e8] bg-[#faf5fa]">
          <div className="relative">
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-white transition-colors text-sm"
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#c8a2c8] to-[#b088b0] flex items-center justify-center text-sm font-semibold text-white shadow-sm">
                {user?.username?.[0]?.toUpperCase() || '?'}
              </div>
              <div className="flex-1 text-left">
                <p className="text-sm font-medium text-[#4a4a4a] truncate">{user?.username}</p>
                <p className="text-xs text-[#9b8b9b] capitalize">
                  {user?.role === 'admin' ? 'Администратор' : 'Редактор'}
                </p>
              </div>
              <ChevronDown size={14} className={cn(
                "text-[#b8a8b8] transition-transform",
                isProfileOpen && "rotate-180"
              )} />
            </button>

            {/* Profile dropdown */}
            {isProfileOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 p-1 bg-white border border-[#e8d8e8] rounded-lg shadow-lg">
                <button
                  onClick={() => {
                    logout();
                    setIsProfileOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-3 py-2 text-[#d32f2f] hover:bg-[#ffebee] rounded-md transition-colors text-sm"
                >
                  <LogOut size={16} />
                  <span className="font-medium">Выйти</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen lg:ml-0 ml-0">
        <header className="h-14 bg-white border-b border-[#e8d8e8] flex items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <h2 className="text-base font-semibold text-[#4a4a4a]">
              {getPageTitle(location.pathname)}
            </h2>
            {location.pathname.includes('/dashboard') && (
              <span className="px-2 py-0.5 text-xs bg-[#f0e4f0] text-[#b088b0] rounded-full">
                {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            {/* Поиск */}
            <div className="relative hidden md:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#b8a8b8]" />
              <input
                type="text"
                placeholder="Поиск..."
                className="pl-8 pr-3 py-1.5 bg-[#f8f8f8] border border-[#e8d8e8] rounded-lg text-sm text-[#4a4a4a] placeholder-[#b8a8b8] focus:outline-none focus:border-[#c8a2c8] focus:ring-2 focus:ring-[#c8a2c8]/20 transition-all w-56"
              />
            </div>

            {/* Уведомления */}
            <button className="relative p-1.5 text-[#9b8b9b] hover:text-[#c8a2c8] hover:bg-[#f8f0f8] rounded-lg transition-colors">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 bg-[#c8a2c8] rounded-full"></span>
            </button>

            {/* Настройки */}
            <button className="p-1.5 text-[#9b8b9b] hover:text-[#c8a2c8] hover:bg-[#f8f0f8] rounded-lg transition-colors">
              <Settings size={18} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto bg-[#f5f5f5]">
          <div className="max-w-[1600px] mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

function getPageTitle(path) {
  if (path.includes('/dashboard')) return 'Дашборд';
  if (path.includes('/articles')) return 'Управление статьями';
  if (path.includes('/users')) return 'Пользователи системы';
  if (path.includes('/categories')) return 'Категории и рубрики';
  return 'Панель управления';
}
import { Outlet, useLocation, NavLink } from 'react-router-dom';
import {useAuth} from "../context/AuthContext";
import { LogOut, LayoutDashboard, FileText, Users, FolderTree } from 'lucide-react';
import { cn } from '../utils/cn';

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const location = useLocation();



  const navItems = [
    {
      label: 'Дашборд',
      path: '/admin/dashboard',
      icon: <LayoutDashboard size={20} />,
      roles: ['admin', 'editor'],
    },
    {
      label: 'Статьи',
      path: '/admin/articles',
      icon: <FileText size={20} />,
      roles: ['admin', 'editor'],
    },
    {
      label: 'Пользователи',
      path: '/admin/users',
      icon: <Users size={20} />,
      roles: ['admin'],
    },
    {
      label: 'Категории',
      path: '/admin/categories',
      icon: <FolderTree size={20} />,
      roles: ['admin', 'editor'],
    },
  ];

  const filteredNavItems = navItems.filter(item =>
    item.roles.includes(user?.role)
  );

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-gray-100 flex">
      <aside className="w-64 bg-[#1a1a1a] border-r border-gray-800 flex flex-col">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold text-purple-400">
            Content<span className="text-purple-600">CMS</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Панель управления</p>
        </div>

        <nav className="flex-1 px-3 py-6">
          <ul className="space-y-1">
            {filteredNavItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                      isActive
                        ? "bg-purple-900/30 text-purple-300"
                        : "text-gray-400 hover:bg-gray-800/70 hover:text-gray-200"
                    )
                  }
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-800 mt-auto">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-purple-800 flex items-center justify-center text-lg font-semibold">
              {user?.username?.[0]?.toUpperCase() || '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.username}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>

          <button
            onClick={logout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:bg-red-950/30 hover:text-red-300 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-[#1a1a1a] border-b border-gray-800 flex items-center px-8 justify-between">
          <h2 className="text-lg font-medium">
            {getPageTitle(location.pathname)}
          </h2>

          <div className="flex items-center gap-4">
            {/* Можно добавить уведомления, профиль и т.д. */}
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function getPageTitle(path) {
  if (path.includes('/dashboard')) return 'Дашборд';
  if (path.includes('/articles')) return 'Управление статьями';
  if (path.includes('/users')) return 'Пользователи';
  if (path.includes('/categories')) return 'Категории и рубрики';
  return 'Панель управления';
}
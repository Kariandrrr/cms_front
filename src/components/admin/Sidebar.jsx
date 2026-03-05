// src/components/admin/Sidebar.jsx
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, FileText, Users, Settings,
  LogOut, Sparkles, ChevronRight
} from 'lucide-react';

export default function Sidebar({ children }) {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'editor', 'user'] },
    { path: '/admin/posts', label: 'Статьи', icon: FileText, roles: ['admin', 'editor', 'user'] },
    { path: '/admin/users', label: 'Пользователи', icon: Users, roles: ['admin'] },
    { path: '/admin/settings', label: 'Настройки', icon: Settings, roles: ['admin'] },
  ];

  const visibleMenuItems = menuItems.filter(item =>
    item.roles.some(role => hasRole(role))
  );

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#f5f5f5] to-[#e8e8e8]">
      {/* Sidebar */}
      <aside className="w-64 bg-white/95 backdrop-blur-sm border-r border-[#e8d8e8] shadow-xl flex flex-col">
        {/* Логотип */}
        <div className="p-6 border-b border-[#e8d8e8]">
          <Link to="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#c8a2c8] to-[#b088b0] flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-[#4a4a4a]">ContentCMS</h2>
              <p className="text-xs text-[#9b8b9b]">Admin Panel</p>
            </div>
          </Link>
        </div>

        {/* Меню */}
        <nav className="p-4 space-y-2 flex-1">
          {visibleMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group
                  ${isActive 
                    ? 'bg-gradient-to-r from-[#c8a2c8] to-[#b088b0] text-white shadow-lg' 
                    : 'text-[#6b5e6b] hover:bg-[#f8f0f8] hover:text-[#c8a2c8]'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'group-hover:scale-110 transition-transform'}`} />
                  <span className="font-medium">{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 animate-pulse" />}
              </Link>
            );
          })}
        </nav>

        {/* Профиль пользователя */}
        <div className="p-4 border-t border-[#e8d8e8]">
          <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-[#f8f0f8]">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#c8a2c8] to-[#b088b0] flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-sm">
                {user?.username?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#4a4a4a] truncate">{user?.username || 'User'}</p>
              <p className="text-xs text-[#9b8b9b] capitalize">{user?.role || 'user'}</p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm text-[#d32f2f] hover:bg-[#ffebee] rounded-xl transition-colors font-medium"
          >
            <LogOut className="w-4 h-4" />
            <span>Выйти</span>
          </button>
        </div>
      </aside>

      {/* Основной контент */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
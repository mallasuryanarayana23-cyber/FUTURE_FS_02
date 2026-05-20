import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  LogOut,
  ChevronRight,
  TrendingUp,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
    { name: 'Leads', icon: Users, path: '/leads' },
    { name: 'Analytics', icon: TrendingUp, path: '/analytics' },
    { name: 'Calendar', icon: Calendar, path: '/calendar' },
    { name: 'Settings', icon: Settings, path: '/settings' },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-secondary-950/20 backdrop-blur-sm z-[55] lg:hidden"
          onClick={onClose}
        ></div>
      )}
      
      <div className={`w-64 h-screen glass-sidebar flex flex-col fixed left-0 top-0 z-[60] transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary-200">
                <TrendingUp size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-secondary-950 dark:text-white">NexusCRM</span>
            </div>
            <button onClick={onClose} className="lg:hidden p-2 text-secondary-500 hover:bg-secondary-100 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={({ isActive }) =>
                  `flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive 
                    ? 'bg-primary-50 text-primary-600 dark:bg-primary-950/30' 
                    : 'text-secondary-500 hover:bg-secondary-50 hover:text-secondary-900 dark:text-secondary-400 dark:hover:bg-secondary-800 dark:hover:text-white'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="font-medium">{item.name}</span>
                </div>
                <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-secondary-100 dark:border-secondary-800">
          <button 
            onClick={logout}
            className="flex items-center gap-3 px-4 py-3 w-full text-secondary-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-200"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

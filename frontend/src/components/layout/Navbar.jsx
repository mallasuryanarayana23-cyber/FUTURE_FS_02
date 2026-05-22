import React, { useState, useEffect } from 'react';
import { Search, Bell, Moon, Sun, User, Menu, Check, Trash } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { format } from 'date-fns';

const Navbar = ({ onMenuClick }) => {
  const { admin } = useAuth();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');
  const [notifications, setNotifications] = useState([]);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const fetchNotifications = async () => {
    try {
      const response = await api.get('/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Failed to fetch notifications');
    }
  };

  useEffect(() => {
    if (admin) {
      fetchNotifications();
      // Poll every 30 seconds for live updates
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [admin]);

  const markAllRead = async () => {
    try {
      await api.put('/notifications/read-all');
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark notifications as read');
    }
  };

  const markSingleRead = async (id) => {
    try {
      await api.put(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Failed to mark read');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="h-20 bg-white/50 backdrop-blur-sm border-b border-secondary-100 sticky top-0 z-40 lg:ml-64 flex items-center justify-between px-8 dark:bg-secondary-900/50 dark:border-secondary-800">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-secondary-500 hover:bg-secondary-100 dark:hover:bg-secondary-800 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <div className="hidden md:flex items-center gap-4 bg-secondary-50 px-4 py-2 rounded-xl border border-secondary-100 w-96 dark:bg-secondary-800 dark:border-secondary-700">
          <Search size={18} className="text-secondary-400" />
          <input 
            type="text" 
            placeholder="Search leads, tasks, activity..." 
            className="bg-transparent border-none outline-none w-full text-sm text-secondary-900 placeholder:text-secondary-400 dark:text-white"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 relative">
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="p-2.5 text-secondary-500 hover:bg-secondary-50 dark:hover:bg-secondary-800 rounded-xl transition-colors relative"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white flex items-center justify-center animate-pulse dark:border-secondary-900">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Premium Dropdown Notifications Panel */}
          {isNotifOpen && (
            <div className="absolute right-0 top-14 w-80 bg-white dark:bg-secondary-900 rounded-2xl shadow-xl border border-secondary-200 dark:border-secondary-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="px-4 py-2.5 border-b border-secondary-100 dark:border-secondary-800 flex justify-between items-center bg-secondary-50/50 dark:bg-secondary-900/50">
                <span className="font-bold text-sm text-secondary-900 dark:text-white">Notifications</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={markAllRead}
                    className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-semibold"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-[300px] overflow-y-auto divide-y divide-secondary-50 dark:divide-secondary-800">
                {notifications.length === 0 ? (
                  <div className="px-4 py-8 text-center text-xs text-secondary-400 italic">
                    No new notifications
                  </div>
                ) : (
                  notifications.map((notif) => (
                    <div 
                      key={notif._id}
                      onClick={() => markSingleRead(notif._id)}
                      className={`p-4 hover:bg-secondary-50 dark:hover:bg-secondary-800 cursor-pointer transition-colors ${!notif.isRead ? 'bg-primary-50/20' : ''}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <span className={`font-bold text-xs ${!notif.isRead ? 'text-primary-600 dark:text-primary-400' : 'text-secondary-700 dark:text-secondary-300'}`}>
                          {notif.title}
                        </span>
                        {!notif.isRead && (
                          <div className="w-1.5 h-1.5 bg-primary-600 rounded-full mt-1 shrink-0"></div>
                        )}
                      </div>
                      <p className="text-[11px] text-secondary-500 dark:text-secondary-400 mt-1 leading-normal">{notif.message}</p>
                      <span className="text-[9px] text-secondary-400 block mt-2 font-medium">
                        {format(new Date(notif.createdAt), 'MMM dd · hh:mm a')}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 text-secondary-500 hover:bg-secondary-50 rounded-xl transition-colors dark:text-secondary-400 dark:hover:bg-secondary-800"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="h-8 w-px bg-secondary-200 dark:bg-secondary-800"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-semibold text-secondary-950 dark:text-white">{admin?.name}</p>
            <p className="text-xs text-secondary-500 dark:text-secondary-400">Administrator</p>
          </div>
          <div className="w-10 h-10 bg-secondary-100 dark:bg-secondary-800 rounded-xl flex items-center justify-center text-secondary-600 dark:text-secondary-300 group-hover:bg-primary-50 dark:group-hover:bg-primary-950/30 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-all border border-secondary-200 dark:border-secondary-700 overflow-hidden">
            {admin?.profilePicture ? (
              <img 
                src={admin.profilePicture} 
                alt={admin.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <User size={20} />
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

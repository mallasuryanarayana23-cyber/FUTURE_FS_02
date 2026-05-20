import React, { useState, useEffect } from 'react';
import { Search, Bell, Moon, Sun, User, Menu, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar = ({ onMenuClick }) => {
  const { admin } = useAuth();
  const [darkMode, setDarkMode] = useState(localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <header className="h-20 bg-white/50 backdrop-blur-sm border-b border-secondary-100 sticky top-0 z-40 lg:ml-64 flex items-center justify-between px-8 dark:bg-secondary-900/50 dark:border-secondary-800">
      <div className="flex items-center gap-4">
        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2 text-secondary-500 hover:bg-secondary-100 rounded-lg transition-colors"
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
        <div className="flex items-center gap-2">
          <button className="p-2.5 text-secondary-500 hover:bg-secondary-50 rounded-xl transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 text-secondary-500 hover:bg-secondary-50 rounded-xl transition-colors dark:text-secondary-400 dark:hover:bg-secondary-800"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>

        <div className="h-8 w-px bg-secondary-200"></div>

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <p className="text-sm font-semibold text-secondary-950">{admin?.name}</p>
            <p className="text-xs text-secondary-500">Administrator</p>
          </div>
          <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center text-secondary-600 group-hover:bg-primary-50 group-hover:text-primary-600 transition-all border border-secondary-200">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

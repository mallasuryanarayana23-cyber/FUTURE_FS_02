import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    try {
      await api.post('/auth/register', { name, email, password });
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-6 dark:bg-secondary-950">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl text-white shadow-xl shadow-primary-200 mb-4 transform -rotate-6">
            <TrendingUp size={32} />
          </div>
          <h1 className="text-3xl font-bold text-secondary-950 dark:text-white font-sans">Create Admin Account</h1>
          <p className="text-secondary-500 mt-2 text-md dark:text-secondary-400">Register as a system administrator</p>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-xl shadow-secondary-200 border border-secondary-100 dark:bg-secondary-900 dark:border-secondary-800 dark:shadow-none">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                <input
                  type="text"
                  className="input-field pl-12"
                  placeholder="Super Admin"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1.5">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                <input
                  type="email"
                  className="input-field pl-12"
                  placeholder="admin@nexuscrm.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                <input
                  type="password"
                  className="input-field pl-12"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                <input
                  type="password"
                  className="input-field pl-12"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 flex items-center justify-center gap-2 text-md shadow-lg shadow-primary-100 disabled:opacity-70 mt-6"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Register Admin <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center border-t border-secondary-100 dark:border-secondary-800 pt-5">
            <p className="text-sm text-secondary-500 dark:text-secondary-400">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400">
                Sign In
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center mt-6 text-secondary-500 text-xs dark:text-secondary-500">
          &copy; 2024 NexusCRM System. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Register;

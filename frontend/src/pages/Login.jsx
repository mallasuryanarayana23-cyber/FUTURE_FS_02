import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TrendingUp, Lock, Mail, ArrowRight, X, Key } from 'lucide-react';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Forgot Password States
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPassword, setForgotPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back, Admin!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (forgotPassword !== forgotConfirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (forgotPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setForgotLoading(true);
    try {
      const response = await api.post('/auth/forgot-password', {
        email: forgotEmail,
        newPassword: forgotPassword,
      });
      toast.success(response.data?.message || 'Password reset successfully!');
      setIsForgotOpen(false);
      setEmail(forgotEmail);
      setPassword('');
      setForgotEmail('');
      setForgotPassword('');
      setForgotConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 flex items-center justify-center p-6">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-2xl text-white shadow-xl shadow-primary-200 mb-6 transform -rotate-6">
            <TrendingUp size={32} />
          </div>
          <h1 className="text-3xl font-bold text-secondary-950">Welcome to NexusCRM</h1>
          <p className="text-secondary-500 mt-2 text-lg">Secure administrator access</p>
        </div>

        <div className="bg-white p-10 rounded-3xl shadow-xl shadow-secondary-200 border border-secondary-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-secondary-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
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
              <div className="flex justify-between mb-2">
                <label className="text-sm font-semibold text-secondary-700">Password</label>
                <button
                  type="button"
                  onClick={() => setIsForgotOpen(true)}
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 focus:outline-none transition-colors duration-200"
                >
                  Forgot?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
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

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3.5 flex items-center justify-center gap-2 text-lg shadow-lg shadow-primary-100 disabled:opacity-70"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  Sign In <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-8 text-secondary-500 text-sm">
          &copy; 2024 NexusCRM System. All rights reserved.
        </p>
      </div>

      {/* Forgot Password Modal */}
      {isForgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-secondary-950/60 backdrop-blur-sm transition-all duration-300">
          <div className="bg-white dark:bg-secondary-900 rounded-3xl w-full max-w-md shadow-2xl border border-secondary-100 dark:border-secondary-800 overflow-hidden transform scale-100 transition-all duration-300">
            <div className="p-8 relative">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setIsForgotOpen(false)}
                className="absolute right-6 top-6 text-secondary-400 hover:text-secondary-600 dark:hover:text-secondary-200 transition-colors"
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div className="mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-primary-100 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-xl mb-4">
                  <Key size={24} />
                </div>
                <h2 className="text-2xl font-bold text-secondary-950 dark:text-white">Reset Password</h2>
                <p className="text-secondary-500 dark:text-secondary-400 text-sm mt-1">
                  Enter your email to configure a new administrator credential.
                </p>
              </div>

              {/* Form */}
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
                    <input
                      type="email"
                      className="input-field pl-12"
                      placeholder="admin@nexuscrm.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
                    <input
                      type="password"
                      className="input-field pl-12"
                      placeholder="••••••••"
                      value={forgotPassword}
                      onChange={(e) => setForgotPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-secondary-700 dark:text-secondary-300 mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
                    <input
                      type="password"
                      className="input-field pl-12"
                      placeholder="••••••••"
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotOpen(false)}
                    className="w-1/3 btn-secondary py-3 flex items-center justify-center text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="w-2/3 btn-primary py-3 flex items-center justify-center gap-2 text-sm font-semibold shadow-lg shadow-primary-100 dark:shadow-none disabled:opacity-70"
                  >
                    {forgotLoading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

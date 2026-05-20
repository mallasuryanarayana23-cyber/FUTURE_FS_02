import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Shield, 
  Mail,
  Camera,
  Save,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import api from '../services/api';

const Settings = () => {
  const { admin } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'Profile Information', icon: User },
    { id: 'security', name: 'Security & Password', icon: Lock },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'preferences', name: 'System Preferences', icon: Globe },
  ];

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: admin?.name || '',
    email: admin?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === 'security') {
        if (formData.newPassword !== formData.confirmPassword) {
          toast.error('New passwords do not match');
          return;
        }
      }

      const response = await api.put('/auth/me', {
        name: formData.name,
        email: formData.email,
        password: formData.newPassword || undefined
      });

      // Update local storage if token changed
      if (response.data.token) {
        localStorage.setItem('admin', JSON.stringify(response.data));
      }

      toast.success('Settings updated successfully');
      window.location.reload(); // Refresh to update context
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 ml-64 bg-secondary-50 min-h-[calc(100vh-80px)]">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-950">System Settings</h1>
        <p className="text-secondary-500 mt-1">Manage your account preferences and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeTab === tab.id 
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
                : 'text-secondary-500 hover:bg-white hover:text-secondary-900'
              }`}
            >
              <tab.icon size={20} />
              {tab.name}
            </button>
          ))}
        </div>

        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <div className="card animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-secondary-100">
                <h2 className="text-xl font-bold text-secondary-900">Profile Details</h2>
              </div>
              <div className="p-8 space-y-8">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="w-24 h-24 bg-secondary-100 rounded-3xl flex items-center justify-center text-secondary-400 border-2 border-dashed border-secondary-300">
                      <User size={40} />
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-2 bg-primary-600 text-white rounded-xl shadow-lg hover:bg-primary-700 transition-colors">
                      <Camera size={16} />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-bold text-secondary-900 text-lg">Your Photo</h3>
                    <p className="text-sm text-secondary-500 mt-1">This will be displayed on your profile and dashboard.</p>
                    <div className="flex gap-3 mt-3">
                      <button className="text-xs font-bold text-primary-600 hover:underline">Upload New</button>
                      <button className="text-xs font-bold text-red-500 hover:underline">Remove</button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-secondary-700">Full Name</label>
                    <input 
                      type="text" 
                      name="name"
                      className="input-field" 
                      value={formData.name} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-secondary-700">Email Address</label>
                    <input 
                      type="email" 
                      name="email"
                      className="input-field" 
                      value={formData.email} 
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-secondary-700">Job Title</label>
                    <input type="text" className="input-field" defaultValue="Senior Administrator" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-secondary-700">Department</label>
                    <input type="text" className="input-field" defaultValue="Sales Operations" />
                  </div>
                </div>

                <div className="pt-8 border-t border-secondary-100 flex justify-end">
                  <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-8">
                    <Save size={18} /> Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="p-6 border-b border-secondary-100">
                <h2 className="text-xl font-bold text-secondary-900">Password Settings</h2>
              </div>
              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary-700">Current Password</label>
                  <input 
                    type="password" 
                    name="currentPassword"
                    className="input-field" 
                    placeholder="••••••••" 
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary-700">New Password</label>
                  <input 
                    type="password" 
                    name="newPassword"
                    className="input-field" 
                    placeholder="••••••••" 
                    value={formData.newPassword}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-secondary-700">Confirm New Password</label>
                  <input 
                    type="password" 
                    name="confirmPassword"
                    className="input-field" 
                    placeholder="••••••••" 
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex gap-3 mt-8">
                  <Shield className="text-amber-600 shrink-0" size={20} />
                  <div>
                    <p className="text-sm font-bold text-amber-900">Security Recommendation</p>
                    <p className="text-xs text-amber-700 mt-1">Make sure your password is at least 12 characters long and contains a mix of letters, numbers, and symbols.</p>
                  </div>
                </div>

                <div className="pt-8 border-t border-secondary-100 flex justify-end">
                  <button onClick={handleSave} className="btn-primary flex items-center gap-2 px-8">
                    <Save size={18} /> Update Password
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card p-20 text-center">
              <Bell size={48} className="mx-auto text-secondary-300 mb-4" />
              <h2 className="text-xl font-bold text-secondary-900">Notification Settings</h2>
              <p className="text-secondary-500 mt-2">Customize how you want to be notified about lead activities.</p>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="card p-20 text-center">
              <Globe size={48} className="mx-auto text-secondary-300 mb-4" />
              <h2 className="text-xl font-bold text-secondary-900">System Preferences</h2>
              <p className="text-secondary-500 mt-2">Manage language, timezones, and display settings.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;

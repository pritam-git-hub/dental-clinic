import React, { useState, useEffect } from 'react';
import {
  FaUser,
  FaLock,
  FaHistory,
  FaDownload,
  FaUpload,
  FaTrash,
  FaEye,
  FaEyeSlash,
  FaSave,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaEdit,
  FaDatabase
} from 'react-icons/fa';
import authService from '../../services/AuthService.js';
import dataService from '../../services/DataService.js';

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [user, setUser] = useState(null);
  const [auditLog, setAuditLog] = useState([]);
  const [sessionInfo, setSessionInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: FaUser },
    { id: 'security', label: 'Security', icon: FaLock },
    { id: 'audit', label: 'Audit Log', icon: FaHistory },
    { id: 'data', label: 'Data Management', icon: FaDatabase }
  ];

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentUser = authService.getCurrentUser();
      const session = authService.getSessionInfo();
      const data = dataService.getData();
      
      setUser(currentUser);
      setSessionInfo(session);
      setAuditLog(data.auditLog || []);
    } catch (error) {
      console.error('Failed to load settings:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
        <p className="text-gray-600">Manage your account and system settings</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="mr-2" size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <ProfileSettings user={user} onUpdate={loadSettings} />
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <SecuritySettings sessionInfo={sessionInfo} onUpdate={loadSettings} />
      )}

      {/* Audit Log Tab */}
      {activeTab === 'audit' && (
        <AuditLog auditLog={auditLog} />
      )}

      {/* Data Management Tab */}
      {activeTab === 'data' && (
        <DataManagement onUpdate={loadSettings} />
      )}
    </div>
  );
};

// Profile Settings Component
const ProfileSettings = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      // In a real app, this would update the user profile via API
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Profile Information</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
            <FaUser className="text-gray-400" size={32} />
          </div>
          <div>
            <button
              type="button"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Change Avatar
            </button>
            <p className="text-sm text-gray-500 mt-1">JPG, PNG up to 2MB</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>

        {message && (
          <div className={`p-4 rounded-lg ${
            message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
          }`}>
            {message}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" size={16} />
                Save Changes
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// Security Settings Component
const SecuritySettings = ({ sessionInfo, onUpdate }) => {
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [changing, setChanging] = useState(false);
  const [message, setMessage] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('New passwords do not match');
      return;
    }

    setChanging(true);
    setMessage('');

    try {
      const result = await authService.changePassword(
        passwordData.currentPassword,
        passwordData.newPassword
      );

      if (result.success) {
        setMessage('Password changed successfully!');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setShowPasswordForm(false);
      } else {
        setMessage(result.error);
      }
    } catch (error) {
      setMessage('Failed to change password');
    } finally {
      setChanging(false);
    }
  };

  const passwordValidation = authService.validatePassword(passwordData.newPassword);

  return (
    <div className="space-y-6">
      {/* Session Info */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Session</h3>
        
        {sessionInfo && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm font-medium text-gray-700">Login Time</div>
              <div className="text-gray-900">{sessionInfo.loginTime}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">Last Activity</div>
              <div className="text-gray-900">{sessionInfo.lastActivity}</div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">Session Status</div>
              <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                sessionInfo.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {sessionInfo.isActive ? 'Active' : 'Expired'}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium text-gray-700">Time Remaining</div>
              <div className="text-gray-900">{sessionInfo.timeLeft} minutes</div>
            </div>
          </div>
        )}
      </div>

      {/* Password Change */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Password Security</h3>
          <button
            onClick={() => setShowPasswordForm(!showPasswordForm)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            {showPasswordForm ? 'Cancel' : 'Change Password'}
          </button>
        </div>

        {showPasswordForm && (
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? 'text' : 'password'}
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, current: !prev.current }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPasswords.current ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.new ? 'text' : 'password'}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, new: !prev.new }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPasswords.new ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
              
              {passwordData.newPassword && (
                <div className="mt-2">
                  <div className="flex items-center space-x-2 mb-1">
                    <div className="flex-1 bg-gray-200 rounded-full h-1">
                      <div
                        className={`h-1 rounded-full transition-all duration-300 ${
                          passwordValidation.strength === 'weak'
                            ? 'bg-red-500 w-1/3'
                            : passwordValidation.strength === 'medium'
                            ? 'bg-yellow-500 w-2/3'
                            : 'bg-green-500 w-full'
                        }`}
                      />
                    </div>
                    <span className={`text-xs font-medium ${
                      passwordValidation.strength === 'weak'
                        ? 'text-red-600'
                        : passwordValidation.strength === 'medium'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }`}>
                      {passwordValidation.strength.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 space-y-1">
                    <div className={passwordValidation.rules.minLength ? 'text-green-600' : 'text-red-600'}>
                      ✓ At least 8 characters
                    </div>
                    <div className={passwordValidation.rules.hasUpperCase ? 'text-green-600' : 'text-red-600'}>
                      ✓ One uppercase letter
                    </div>
                    <div className={passwordValidation.rules.hasLowerCase ? 'text-green-600' : 'text-red-600'}>
                      ✓ One lowercase letter
                    </div>
                    <div className={passwordValidation.rules.hasNumber ? 'text-green-600' : 'text-red-600'}>
                      ✓ One number
                    </div>
                    <div className={passwordValidation.rules.hasSpecialChar ? 'text-green-600' : 'text-red-600'}>
                      ✓ One special character
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showPasswords.confirm ? 'text' : 'password'}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(prev => ({ ...prev, confirm: !prev.confirm }))}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPasswords.confirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                </button>
              </div>
            </div>

            {message && (
              <div className={`p-4 rounded-lg ${
                message.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              }`}>
                {message}
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowPasswordForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={changing || !passwordValidation.isValid}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
              >
                {changing ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

// Audit Log Component
const AuditLog = ({ auditLog }) => {
  const [filter, setFilter] = useState('all');
  const [filteredLog, setFilteredLog] = useState([]);

  useEffect(() => {
    let filtered = [...auditLog];
    if (filter !== 'all') {
      filtered = filtered.filter(entry => entry.action === filter);
    }
    setFilteredLog(filtered.slice(0, 100)); // Show only last 100 entries
  }, [auditLog, filter]);

  const getActionColor = (action) => {
    switch (action) {
      case 'create':
        return 'bg-green-100 text-green-800';
      case 'update':
        return 'bg-blue-100 text-blue-800';
      case 'delete':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Audit Log</h3>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Actions</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
          </select>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {filteredLog.length === 0 ? (
          <div className="p-8 text-center">
            <FaHistory className="mx-auto text-gray-400 mb-4" size={48} />
            <h4 className="text-lg font-medium text-gray-900 mb-2">No audit entries</h4>
            <p className="text-gray-600">Activity will appear here as you use the system.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredLog.map((entry) => (
              <div key={entry.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getActionColor(entry.action)}`}>
                      {entry.action}
                    </span>
                    <span className="text-sm font-medium text-gray-900">
                      {entry.entity}
                    </span>
                    <span className="text-sm text-gray-600">
                      ID: {entry.entityId}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(entry.timestamp).toLocaleString()}
                  </div>
                </div>
                <div className="mt-1 text-sm text-gray-600">
                  User: {entry.user}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Data Management Component
const DataManagement = ({ onUpdate }) => {
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);

  const exportData = async () => {
    setExporting(true);
    try {
      const data = dataService.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `dental-clinic-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setExporting(false);
    }
  };

  const importData = async (file) => {
    setImporting(true);
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      dataService.importData(data);
      onUpdate();
      alert('Data imported successfully!');
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import data. Please check the file format.');
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Data Backup & Restore</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Export Data</h4>
            <p className="text-sm text-gray-600 mb-4">
              Download a complete backup of all your data including doctors, services, appointments, and settings.
            </p>
            <button
              onClick={exportData}
              disabled={exporting}
              className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {exporting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Exporting...
                </>
              ) : (
                <>
                  <FaDownload className="mr-2" size={16} />
                  Export Data
                </>
              )}
            </button>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Import Data</h4>
            <p className="text-sm text-gray-600 mb-4">
              Restore data from a previous backup. This will replace all current data.
            </p>
            <label className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 cursor-pointer transition-colors">
              {importing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600 mr-2"></div>
                  Importing...
                </>
              ) : (
                <>
                  <FaUpload className="mr-2" size={16} />
                  Import Data
                </>
              )}
              <input
                type="file"
                accept=".json"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file && window.confirm('This will replace all current data. Are you sure?')) {
                    importData(file);
                  }
                }}
                className="hidden"
                disabled={importing}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-start">
          <FaExclamationTriangle className="text-red-600 mt-1 mr-3" size={20} />
          <div>
            <h4 className="font-medium text-red-900 mb-2">Danger Zone</h4>
            <p className="text-sm text-red-700 mb-4">
              These actions are irreversible. Please be certain before proceeding.
            </p>
            <button
              onClick={() => {
                if (window.confirm('This will delete ALL data including doctors, services, appointments, and media. This action cannot be undone. Are you absolutely sure?')) {
                  if (window.confirm('Last chance! This will permanently delete everything. Continue?')) {
                    localStorage.removeItem('dentalClinicData');
                    window.location.reload();
                  }
                }
              }}
              className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <FaTrash className="mr-2" size={16} />
              Reset All Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

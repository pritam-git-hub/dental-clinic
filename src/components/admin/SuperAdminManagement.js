import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FaUsers,
  FaUserShield,
  FaCheck,
  FaTimes,
  FaEye,
  FaPlus,
  FaCrown,
  FaSpinner,
  FaBell,
  FaCalendarAlt,
  FaEnvelope,
  FaPhone
} from 'react-icons/fa';
import authService from '../../services/AuthService';

// Super Admin creation schema
const superAdminSchema = z.object({
  id: z.string().min(3, 'ID must be at least 3 characters'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters')
});

const SuperAdminManagement = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [subAdmins, setSubAdmins] = useState([]);
  const [superAdmins, setSuperAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showCreateSuperAdmin, setShowCreateSuperAdmin] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(superAdminSchema)
  });

  useEffect(() => {
    loadData();
    const session = localStorage.getItem('adminSession');
    if (session) {
      setCurrentUser(JSON.parse(session).user);
    }
  }, []);

  const loadData = () => {
    setPendingApprovals(authService.getPendingApprovals());
    setSubAdmins(authService.getSubAdmins());
    setSuperAdmins(authService.getSuperAdmins());
  };

  const handleApproveSubAdmin = async (adminId) => {
    setLoading(true);
    try {
      const result = authService.approveSubAdmin(adminId);
      if (result.success) {
        loadData();
        alert('Sub admin approved successfully!');
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Failed to approve sub admin');
    } finally {
      setLoading(false);
    }
  };

  const handleRejectSubAdmin = async (adminId) => {
    if (window.confirm('Are you sure you want to reject this sub admin registration?')) {
      setLoading(true);
      try {
        const result = authService.rejectSubAdmin(adminId);
        if (result.success) {
          loadData();
          alert('Sub admin registration rejected');
        } else {
          alert(result.error);
        }
      } catch (error) {
        alert('Failed to reject sub admin');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCreateSuperAdmin = async (data) => {
    setLoading(true);
    try {
      const result = authService.createSuperAdmin(data, currentUser?.id);
      if (result.success) {
        loadData();
        setShowCreateSuperAdmin(false);
        reset();
        alert('Super admin created successfully!');
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Failed to create super admin');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPermissionBadgeColor = (permission) => {
    const colors = {
      appointments: 'bg-blue-100 text-blue-800',
      patients: 'bg-green-100 text-green-800',
      services: 'bg-purple-100 text-purple-800',
      doctors: 'bg-orange-100 text-orange-800',
      content: 'bg-pink-100 text-pink-800',
      analytics: 'bg-indigo-100 text-indigo-800',
      feedback: 'bg-yellow-100 text-yellow-800'
    };
    return colors[permission] || 'bg-gray-100 text-gray-800';
  };

  const isPrimarySuperAdmin = currentUser?.id === 'pg13000122017';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Super Admin Management</h1>
          <p className="text-neutral-600">Manage sub admin approvals and super admin accounts</p>
        </div>
        {isPrimarySuperAdmin && (
          <button
            onClick={() => setShowCreateSuperAdmin(true)}
            className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
          >
            <FaPlus size={16} />
            <span>Create Super Admin</span>
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <FaBell className="text-yellow-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Pending Approvals</p>
              <p className="text-2xl font-bold text-neutral-900">{pendingApprovals.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaUsers className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Active Sub Admins</p>
              <p className="text-2xl font-bold text-neutral-900">
                {subAdmins.filter(admin => admin.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaUserShield className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Super Admins</p>
              <p className="text-2xl font-bold text-neutral-900">{superAdmins.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaCalendarAlt className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Admins</p>
              <p className="text-2xl font-bold text-neutral-900">
                {subAdmins.filter(admin => admin.status === 'approved').length + superAdmins.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('pending')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'pending'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Pending Approvals ({pendingApprovals.length})
            </button>
            <button
              onClick={() => setActiveTab('subadmins')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'subadmins'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Sub Admins ({subAdmins.filter(admin => admin.status === 'approved').length})
            </button>
            <button
              onClick={() => setActiveTab('superadmins')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'superadmins'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700'
              }`}
            >
              Super Admins ({superAdmins.length})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Pending Approvals Tab */}
          {activeTab === 'pending' && (
            <div className="space-y-4">
              {pendingApprovals.length === 0 ? (
                <div className="text-center py-8">
                  <FaBell className="mx-auto text-neutral-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No Pending Approvals</h3>
                  <p className="text-neutral-600">All sub admin registrations have been processed.</p>
                </div>
              ) : (
                pendingApprovals.map((admin) => (
                  <div key={admin.id} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center">
                            <FaUsers className="text-neutral-600" size={16} />
                          </div>
                          <div>
                            <h4 className="font-semibold text-neutral-900">{admin.name}</h4>
                            <p className="text-sm text-neutral-600">{admin.department}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <FaEnvelope className="text-neutral-400" size={14} />
                            <span className="text-sm text-neutral-600">{admin.email}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FaPhone className="text-neutral-400" size={14} />
                            <span className="text-sm text-neutral-600">{admin.phone}</span>
                          </div>
                        </div>

                        <div className="mb-4">
                          <p className="text-sm font-medium text-neutral-700 mb-2">Requested Permissions:</p>
                          <div className="flex flex-wrap gap-2">
                            {admin.permissions?.map((permission) => (
                              <span
                                key={permission}
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getPermissionBadgeColor(permission)}`}
                              >
                                {permission.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                              </span>
                            ))}
                          </div>
                        </div>

                        <p className="text-xs text-neutral-500">
                          Submitted: {formatDate(admin.submittedAt)}
                        </p>
                      </div>

                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => setSelectedAdmin(admin)}
                          className="p-2 text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => handleApproveSubAdmin(admin.id)}
                          disabled={loading}
                          className="p-2 text-green-600 hover:text-green-800 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-50"
                          title="Approve"
                        >
                          <FaCheck size={16} />
                        </button>
                        <button
                          onClick={() => handleRejectSubAdmin(admin.id)}
                          disabled={loading}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
                          title="Reject"
                        >
                          <FaTimes size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Sub Admins Tab */}
          {activeTab === 'subadmins' && (
            <div className="space-y-4">
              {subAdmins.filter(admin => admin.status === 'approved').length === 0 ? (
                <div className="text-center py-8">
                  <FaUsers className="mx-auto text-neutral-400 mb-4" size={48} />
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">No Sub Admins</h3>
                  <p className="text-neutral-600">No sub admin accounts have been approved yet.</p>
                </div>
              ) : (
                subAdmins.filter(admin => admin.status === 'approved').map((admin) => (
                  <div key={admin.id} className="border border-neutral-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <FaUsers className="text-green-600" size={16} />
                        </div>
                        <div>
                          <h4 className="font-semibold text-neutral-900">{admin.name}</h4>
                          <p className="text-sm text-neutral-600">{admin.department}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-neutral-600">{admin.email}</p>
                        <p className="text-xs text-neutral-500">
                          Approved: {formatDate(admin.approvedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Super Admins Tab */}
          {activeTab === 'superadmins' && (
            <div className="space-y-4">
              {superAdmins.map((admin) => (
                <div key={admin.id} className="border border-neutral-200 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        {admin.id === 'pg13000122017' ? (
                          <FaCrown className="text-yellow-600" size={16} />
                        ) : (
                          <FaUserShield className="text-purple-600" size={16} />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-neutral-900">{admin.name}</h4>
                          {admin.id === 'pg13000122017' && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                              Primary
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-neutral-600">ID: {admin.id}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-neutral-600">{admin.email}</p>
                      {admin.createdAt && (
                        <p className="text-xs text-neutral-500">
                          Created: {formatDate(admin.createdAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Super Admin Modal */}
      {showCreateSuperAdmin && isPrimarySuperAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Create Super Admin</h3>
            
            <form onSubmit={handleSubmit(handleCreateSuperAdmin)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Admin ID *
                </label>
                <input
                  {...register('id')}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter unique admin ID"
                />
                {errors.id && (
                  <p className="mt-1 text-sm text-red-600">{errors.id.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Full Name *
                </label>
                <input
                  {...register('name')}
                  type="text"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Password *
                </label>
                <input
                  {...register('password')}
                  type="password"
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateSuperAdmin(false);
                    reset();
                  }}
                  className="flex-1 px-4 py-2 text-neutral-700 bg-neutral-200 rounded-lg hover:bg-neutral-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin" size={16} />
                      <span>Creating...</span>
                    </>
                  ) : (
                    <span>Create Super Admin</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Admin Details Modal */}
      {selectedAdmin && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-2xl">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">Sub Admin Details</h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Name</label>
                  <p className="text-neutral-900">{selectedAdmin.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Department</label>
                  <p className="text-neutral-900">{selectedAdmin.department}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Email</label>
                  <p className="text-neutral-900">{selectedAdmin.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700">Phone</label>
                  <p className="text-neutral-900">{selectedAdmin.phone}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">Requested Permissions</label>
                <div className="flex flex-wrap gap-2">
                  {selectedAdmin.permissions?.map((permission) => (
                    <span
                      key={permission}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getPermissionBadgeColor(permission)}`}
                    >
                      {permission.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700">Submitted At</label>
                <p className="text-neutral-900">{formatDate(selectedAdmin.submittedAt)}</p>
              </div>
            </div>

            <div className="flex space-x-3 pt-6">
              <button
                onClick={() => setSelectedAdmin(null)}
                className="flex-1 px-4 py-2 text-neutral-700 bg-neutral-200 rounded-lg hover:bg-neutral-300 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleApproveSubAdmin(selectedAdmin.id);
                  setSelectedAdmin(null);
                }}
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
              >
                <FaCheck size={16} />
                <span>Approve</span>
              </button>
              <button
                onClick={() => {
                  handleRejectSubAdmin(selectedAdmin.id);
                  setSelectedAdmin(null);
                }}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors flex items-center space-x-2"
              >
                <FaTimes size={16} />
                <span>Reject</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminManagement;

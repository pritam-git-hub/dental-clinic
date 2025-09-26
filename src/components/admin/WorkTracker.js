import React, { useState, useEffect } from 'react';
import {
  FaUser,
  FaClock,
  FaEdit,
  FaEye,
  FaCalendarAlt,
  FaChartLine,
  FaFilter,
  FaDownload
} from 'react-icons/fa';

const WorkTracker = () => {
  const [activities, setActivities] = useState([]);
  const [subAdmins, setSubAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState('all');
  const [dateRange, setDateRange] = useState('today');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    loadData();
    const session = localStorage.getItem('adminSession');
    if (session) {
      setCurrentUser(JSON.parse(session).user);
    }
  }, []);

  const loadData = () => {
    // Load sub admins
    const savedSubAdmins = localStorage.getItem('subAdmins');
    if (savedSubAdmins) {
      const approvedSubAdmins = JSON.parse(savedSubAdmins).filter(admin => admin.status === 'approved');
      setSubAdmins(approvedSubAdmins);
    }

    // Load or generate sample activities
    const savedActivities = localStorage.getItem('adminActivities');
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    } else {
      generateSampleActivities();
    }
  };

  const generateSampleActivities = () => {
    const sampleActivities = [
      {
        id: 1,
        adminId: 'sub_admin_1',
        adminName: 'John Doe',
        action: 'Updated patient record',
        module: 'Patients',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        details: 'Modified contact information for patient ID: P001'
      },
      {
        id: 2,
        adminId: 'sub_admin_1',
        adminName: 'John Doe',
        action: 'Created new appointment',
        module: 'Appointments',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        details: 'Scheduled appointment for Dr. Smith on 2024-01-15'
      },
      {
        id: 3,
        adminId: 'sub_admin_2',
        adminName: 'Jane Smith',
        action: 'Updated service pricing',
        module: 'Services',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        details: 'Modified pricing for Root Canal Treatment'
      },
      {
        id: 4,
        adminId: 'sub_admin_2',
        adminName: 'Jane Smith',
        action: 'Added new doctor',
        module: 'Doctors',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        details: 'Added Dr. Patel to the team'
      },
      {
        id: 5,
        adminId: 'sub_admin_1',
        adminName: 'John Doe',
        action: 'Updated website content',
        module: 'Content',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        details: 'Modified hero section text'
      }
    ];

    setActivities(sampleActivities);
    localStorage.setItem('adminActivities', JSON.stringify(sampleActivities));
  };

  const logActivity = (adminId, adminName, action, module, details) => {
    const newActivity = {
      id: Date.now(),
      adminId,
      adminName,
      action,
      module,
      timestamp: new Date().toISOString(),
      details
    };

    const updatedActivities = [newActivity, ...activities];
    setActivities(updatedActivities);
    localStorage.setItem('adminActivities', JSON.stringify(updatedActivities));
  };

  const getFilteredActivities = () => {
    let filtered = activities;

    // Filter by admin
    if (selectedAdmin !== 'all') {
      filtered = filtered.filter(activity => activity.adminId === selectedAdmin);
    }

    // Filter by date range
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    switch (dateRange) {
      case 'today':
        filtered = filtered.filter(activity => new Date(activity.timestamp) >= today);
        break;
      case 'week':
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(activity => new Date(activity.timestamp) >= weekAgo);
        break;
      case 'month':
        const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
        filtered = filtered.filter(activity => new Date(activity.timestamp) >= monthAgo);
        break;
      default:
        break;
    }

    return filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  const getActivityStats = () => {
    const filtered = getFilteredActivities();
    const stats = {
      total: filtered.length,
      byModule: {},
      byAdmin: {}
    };

    filtered.forEach(activity => {
      // Count by module
      stats.byModule[activity.module] = (stats.byModule[activity.module] || 0) + 1;
      
      // Count by admin
      stats.byAdmin[activity.adminName] = (stats.byAdmin[activity.adminName] || 0) + 1;
    });

    return stats;
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now - date) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)} hours ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getModuleIcon = (module) => {
    const icons = {
      'Patients': FaUser,
      'Appointments': FaCalendarAlt,
      'Services': FaEdit,
      'Doctors': FaUser,
      'Content': FaEdit,
      'Analytics': FaChartLine
    };
    return icons[module] || FaEdit;
  };

  const getModuleColor = (module) => {
    const colors = {
      'Patients': 'bg-blue-100 text-blue-800',
      'Appointments': 'bg-green-100 text-green-800',
      'Services': 'bg-purple-100 text-purple-800',
      'Doctors': 'bg-orange-100 text-orange-800',
      'Content': 'bg-pink-100 text-pink-800',
      'Analytics': 'bg-indigo-100 text-indigo-800'
    };
    return colors[module] || 'bg-gray-100 text-gray-800';
  };

  const stats = getActivityStats();
  const filteredActivities = getFilteredActivities();

  // Only show to super admins
  if (currentUser?.role !== 'super_admin') {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <FaUser className="mx-auto text-neutral-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-neutral-900 mb-2">Access Restricted</h3>
          <p className="text-neutral-600">Only super admins can view work tracking.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Work Tracker</h1>
          <p className="text-neutral-600">Monitor sub admin activities and performance</p>
        </div>
        <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2">
          <FaDownload size={16} />
          <span>Export Report</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <FaFilter className="text-neutral-400" size={16} />
            <span className="text-sm font-medium text-neutral-700">Filters:</span>
          </div>
          
          <select
            value={selectedAdmin}
            onChange={(e) => setSelectedAdmin(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="all">All Sub Admins</option>
            {subAdmins.map(admin => (
              <option key={admin.id} value={admin.id}>{admin.name}</option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="all">All Time</option>
          </select>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaChartLine className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Activities</p>
              <p className="text-2xl font-bold text-neutral-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaUser className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Active Sub Admins</p>
              <p className="text-2xl font-bold text-neutral-900">{Object.keys(stats.byAdmin).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaEdit className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Modules Used</p>
              <p className="text-2xl font-bold text-neutral-900">{Object.keys(stats.byModule).length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaClock className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Avg. per Day</p>
              <p className="text-2xl font-bold text-neutral-900">
                {dateRange === 'today' ? stats.total : Math.round(stats.total / (dateRange === 'week' ? 7 : 30))}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Feed */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <h3 className="text-lg font-semibold text-neutral-900">Recent Activities</h3>
        </div>
        
        <div className="divide-y divide-neutral-200">
          {filteredActivities.length === 0 ? (
            <div className="p-8 text-center">
              <FaClock className="mx-auto text-neutral-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No Activities Found</h3>
              <p className="text-neutral-600">No activities match your current filters.</p>
            </div>
          ) : (
            filteredActivities.map((activity) => {
              const IconComponent = getModuleIcon(activity.module);
              return (
                <div key={activity.id} className="p-6 hover:bg-neutral-50 transition-colors">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <IconComponent className="text-neutral-600" size={16} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h4 className="font-medium text-neutral-900">{activity.adminName}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getModuleColor(activity.module)}`}>
                          {activity.module}
                        </span>
                        <span className="text-sm text-neutral-500">{formatTimestamp(activity.timestamp)}</span>
                      </div>
                      
                      <p className="text-neutral-700 mb-1">{activity.action}</p>
                      
                      {activity.details && (
                        <p className="text-sm text-neutral-500">{activity.details}</p>
                      )}
                    </div>

                    <button className="p-2 hover:bg-neutral-200 rounded-lg transition-colors">
                      <FaEye className="text-neutral-400" size={14} />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Module Activity Breakdown */}
      {Object.keys(stats.byModule).length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <h3 className="text-lg font-semibold text-neutral-900 mb-4">Activity by Module</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {Object.entries(stats.byModule).map(([module, count]) => (
              <div key={module} className="text-center p-4 bg-neutral-50 rounded-lg">
                <div className="text-2xl font-bold text-neutral-900">{count}</div>
                <div className="text-sm text-neutral-600">{module}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkTracker;

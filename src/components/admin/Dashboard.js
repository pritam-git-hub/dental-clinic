import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaUserMd,
  FaTooth,
  FaCalendarAlt,
  FaExclamationTriangle,
  FaPlus,
  FaClock,
  FaUser,
  FaPhone,
  FaCheckCircle,
  FaTimesCircle,
  FaUpload
} from 'react-icons/fa';
import dataService from '../../services/DataService.js';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const dashboardStats = dataService.getDashboardStats();
      setStats(dashboardStats);
      setTodaysAppointments(dashboardStats.todaysAppointments);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      name: 'Add Doctor',
      description: 'Add a new doctor to the team',
      icon: FaUserMd,
      color: 'bg-blue-500',
      action: () => navigate('/admin/doctors/new')
    },
    {
      name: 'Add Service',
      description: 'Create a new service offering',
      icon: FaTooth,
      color: 'bg-green-500',
      action: () => navigate('/admin/services/new')
    },
    {
      name: 'Create Slots',
      description: 'Generate appointment slots',
      icon: FaCalendarAlt,
      color: 'bg-purple-500',
      action: () => navigate('/admin/appointments/slots')
    },
    {
      name: 'Upload Image',
      description: 'Add images to media library',
      icon: FaUpload,
      color: 'bg-orange-500',
      action: () => navigate('/admin/media')
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked':
        return 'text-blue-600 bg-blue-100';
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'booked':
        return <FaClock size={12} />;
      case 'completed':
        return <FaCheckCircle size={12} />;
      case 'cancelled':
        return <FaTimesCircle size={12} />;
      default:
        return <FaClock size={12} />;
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
    <div className="space-y-4 sm:space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaUserMd className="text-blue-600" size={16} />
              </div>
            </div>
            <div className="ml-3 sm:ml-4">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.totalDoctors || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Active Doctors</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FaTooth className="text-green-600" size={16} />
              </div>
            </div>
            <div className="ml-3 sm:ml-4">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.totalServices || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Active Services</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaCalendarAlt className="text-purple-600" size={16} />
              </div>
            </div>
            <div className="ml-3 sm:ml-4">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.openSlotsThisWeek || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Open Slots This Week</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaExclamationTriangle className="text-orange-600" size={16} />
              </div>
            </div>
            <div className="ml-3 sm:ml-4">
              <div className="text-xl sm:text-2xl font-bold text-gray-900">{stats?.upcomingBookings || 0}</div>
              <div className="text-xs sm:text-sm text-gray-600">Upcoming Bookings</div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="flex items-center p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors text-left"
              >
                <div className={`w-8 h-8 sm:w-10 sm:h-10 ${action.color} rounded-lg flex items-center justify-center mr-2 sm:mr-3`}>
                  <Icon className="text-white" size={16} />
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 text-sm sm:text-base truncate">{action.name}</div>
                  <div className="text-xs sm:text-sm text-gray-600 truncate">{action.description}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's Agenda */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Today's Agenda</h3>
            <button
              onClick={() => navigate('/admin/appointments')}
              className="text-primary-600 hover:text-primary-700 text-xs sm:text-sm font-medium"
            >
              View All
            </button>
          </div>
        </div>
        
        <div className="p-4 sm:p-6">
          {todaysAppointments.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <FaCalendarAlt className="mx-auto text-gray-400 mb-4" size={36} />
              <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-2">No appointments today</h4>
              <p className="text-sm sm:text-base text-gray-600">Your schedule is clear for today.</p>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              {todaysAppointments.slice(0, 10).map((appointment, index) => (
                <div
                  key={appointment.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg space-y-2 sm:space-y-0"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">
                      {appointment.slot?.startTime} - {appointment.slot?.endTime}
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaUser className="text-gray-400" size={12} />
                      <span className="text-xs sm:text-sm text-gray-700 truncate">{appointment.patientName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FaUserMd className="text-gray-400" size={12} />
                      <span className="text-xs sm:text-sm text-gray-700 truncate">{appointment.doctor}</span>
                    </div>
                    {appointment.phone && (
                      <div className="flex items-center space-x-2">
                        <FaPhone className="text-gray-400" size={12} />
                        <span className="text-xs sm:text-sm text-gray-700">{appointment.phone}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center justify-end sm:justify-start">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(appointment.status)}`}>
                      {getStatusIcon(appointment.status)}
                      <span className="ml-1 capitalize">{appointment.status}</span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Alerts Section */}
      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">System Alerts</h3>
        <div className="space-y-3">
          {stats?.openSlotsThisWeek < 10 && (
            <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <FaExclamationTriangle className="text-yellow-600 mr-3" size={16} />
              <div>
                <div className="text-sm font-medium text-yellow-800">Low Capacity Alert</div>
                <div className="text-sm text-yellow-700">
                  Only {stats?.openSlotsThisWeek} open slots remaining this week. Consider adding more slots.
                </div>
              </div>
            </div>
          )}
          
          {stats?.totalDoctors === 0 && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <FaExclamationTriangle className="text-red-600 mr-3" size={16} />
              <div>
                <div className="text-sm font-medium text-red-800">No Active Doctors</div>
                <div className="text-sm text-red-700">
                  Add doctors to your team to start accepting appointments.
                </div>
              </div>
            </div>
          )}

          {stats?.totalServices === 0 && (
            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
              <FaExclamationTriangle className="text-red-600 mr-3" size={16} />
              <div>
                <div className="text-sm font-medium text-red-800">No Active Services</div>
                <div className="text-sm text-red-700">
                  Add services to showcase your clinic's offerings.
                </div>
              </div>
            </div>
          )}

          {stats?.openSlotsThisWeek >= 10 && stats?.totalDoctors > 0 && stats?.totalServices > 0 && (
            <div className="flex items-center p-3 bg-green-50 border border-green-200 rounded-lg">
              <FaCheckCircle className="text-green-600 mr-3" size={16} />
              <div>
                <div className="text-sm font-medium text-green-800">System Status: Good</div>
                <div className="text-sm text-green-700">
                  All systems are running smoothly. No immediate action required.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

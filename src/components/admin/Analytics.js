import React, { useState, useEffect } from 'react';
import { 
  FaChartLine, 
  FaUsers, 
  FaCalendarCheck, 
  FaUserMd,
  FaTooth,
  FaDownload,
  FaFilter,
  FaEye,
  FaPhone,
  FaEnvelope
} from 'react-icons/fa';

const Analytics = () => {
  const [dateRange, setDateRange] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('appointments');

  // Mock analytics data
  const analyticsData = {
    overview: {
      totalAppointments: 156,
      totalPatients: 89,
      totalDoctors: 12,
      totalServices: 25,
      appointmentGrowth: 12.5,
      patientGrowth: 8.3,
      revenue: 45000,
      revenueGrowth: 15.2
    },
    appointments: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      data: [12, 15, 8, 18, 22, 16, 5],
      total: 96
    },
    services: [
      { name: 'General Dentistry', count: 45, percentage: 28.8 },
      { name: 'Dental Implants', count: 32, percentage: 20.5 },
      { name: 'Orthodontics', count: 28, percentage: 17.9 },
      { name: 'Cosmetic Dentistry', count: 25, percentage: 16.0 },
      { name: 'Root Canal', count: 20, percentage: 12.8 },
      { name: 'Others', count: 6, percentage: 3.8 }
    ],
    doctors: [
      { name: 'Dr. Udey Vir Gandhi', appointments: 45, rating: 4.9 },
      { name: 'Dr. Nipa Gandhi', appointments: 38, rating: 4.8 },
      { name: 'Dr. Manas De', appointments: 32, rating: 4.7 },
      { name: 'Dr. Angshuman Bhattacharya', appointments: 28, rating: 4.8 },
      { name: 'Dr. Manela Shill', appointments: 25, rating: 4.6 }
    ],
    patientDemographics: {
      ageGroups: [
        { range: '18-25', count: 25, percentage: 28.1 },
        { range: '26-35', count: 32, percentage: 36.0 },
        { range: '36-45', count: 18, percentage: 20.2 },
        { range: '46-55', count: 10, percentage: 11.2 },
        { range: '55+', count: 4, percentage: 4.5 }
      ],
      gender: {
        male: 52,
        female: 37
      }
    },
    recentActivity: [
      { type: 'appointment', message: 'New appointment booked by Priya Sharma', time: '2 minutes ago' },
      { type: 'patient', message: 'New patient registration: Rajesh Kumar', time: '15 minutes ago' },
      { type: 'service', message: 'Dental Implant service updated', time: '1 hour ago' },
      { type: 'doctor', message: 'Dr. Gandhi updated availability', time: '2 hours ago' },
      { type: 'appointment', message: 'Appointment completed for Anita Das', time: '3 hours ago' }
    ]
  };

  const StatCard = ({ title, value, growth, icon: Icon, color }) => (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {growth && (
            <p className={`text-sm ${growth > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {growth > 0 ? '+' : ''}{growth}% from last period
            </p>
          )}
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  const exportData = () => {
    // Mock export functionality
    const data = JSON.stringify(analyticsData, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <FaChartLine className="mr-3" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">Monitor your clinic's performance and insights</p>
        </div>
        
        <div className="flex space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="1year">Last Year</option>
          </select>
          
          <button
            onClick={exportData}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2"
          >
            <FaDownload size={16} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Appointments"
          value={analyticsData.overview.totalAppointments}
          growth={analyticsData.overview.appointmentGrowth}
          icon={FaCalendarCheck}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Patients"
          value={analyticsData.overview.totalPatients}
          growth={analyticsData.overview.patientGrowth}
          icon={FaUsers}
          color="bg-green-500"
        />
        <StatCard
          title="Active Doctors"
          value={analyticsData.overview.totalDoctors}
          icon={FaUserMd}
          color="bg-purple-500"
        />
        <StatCard
          title="Services Offered"
          value={analyticsData.overview.totalServices}
          icon={FaTooth}
          color="bg-orange-500"
        />
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Appointments Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Appointments</h3>
          <div className="space-y-3">
            {analyticsData.appointments.labels.map((day, index) => (
              <div key={day} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 w-12">{day}</span>
                <div className="flex-1 mx-3">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ 
                        width: `${(analyticsData.appointments.data[index] / Math.max(...analyticsData.appointments.data)) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-900 w-8">
                  {analyticsData.appointments.data[index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Services</h3>
          <div className="space-y-3">
            {analyticsData.services.map((service, index) => (
              <div key={service.name} className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{service.name}</span>
                    <span className="text-sm text-gray-600">{service.count}</span>
                  </div>
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                      style={{ width: `${service.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Doctor Performance and Patient Demographics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Doctor Performance */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Doctor Performance</h3>
          <div className="space-y-4">
            {analyticsData.doctors.map((doctor, index) => (
              <div key={doctor.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FaUserMd className="text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{doctor.name}</p>
                    <p className="text-sm text-gray-600">{doctor.appointments} appointments</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★</span>
                    <span className="text-sm font-medium">{doctor.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Patient Demographics */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Demographics</h3>
          
          <div className="mb-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Age Groups</h4>
            <div className="space-y-2">
              {analyticsData.patientDemographics.ageGroups.map((group) => (
                <div key={group.range} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">{group.range}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${group.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 w-8">{group.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">Gender Distribution</h4>
            <div className="flex space-x-4">
              <div className="flex-1 text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{analyticsData.patientDemographics.gender.male}</p>
                <p className="text-sm text-gray-600">Male</p>
              </div>
              <div className="flex-1 text-center p-3 bg-pink-50 rounded-lg">
                <p className="text-2xl font-bold text-pink-600">{analyticsData.patientDemographics.gender.female}</p>
                <p className="text-sm text-gray-600">Female</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {analyticsData.recentActivity.map((activity, index) => (
            <div key={index} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg">
              <div className={`p-2 rounded-full ${
                activity.type === 'appointment' ? 'bg-blue-100' :
                activity.type === 'patient' ? 'bg-green-100' :
                activity.type === 'service' ? 'bg-purple-100' :
                'bg-orange-100'
              }`}>
                {activity.type === 'appointment' && <FaCalendarCheck className="text-blue-600" size={16} />}
                {activity.type === 'patient' && <FaUsers className="text-green-600" size={16} />}
                {activity.type === 'service' && <FaTooth className="text-purple-600" size={16} />}
                {activity.type === 'doctor' && <FaUserMd className="text-orange-600" size={16} />}
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.message}</p>
                <p className="text-xs text-gray-500">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;

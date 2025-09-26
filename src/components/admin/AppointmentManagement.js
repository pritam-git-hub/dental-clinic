import React, { useState, useEffect } from 'react';
import { format, addDays, startOfWeek, endOfWeek, isSameDay, parseISO } from 'date-fns';
import {
  FaCalendarAlt,
  FaPlus,
  FaClock,
  FaUser,
  FaPhone,
  FaEnvelope,
  FaEdit,
  FaTrash,
  FaCalendarPlus,
  FaFilter,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle
} from 'react-icons/fa';
import dataService from '../../services/DataService.js';

const AppointmentManagement = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('week'); // 'week', 'day', 'month'
  const [appointments, setAppointments] = useState([]);
  const [slots, setSlots] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState('all');
  const [showSlotModal, setShowSlotModal] = useState(false);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const doctorsData = dataService.getDoctors();
      const slotsData = dataService.getAppointmentSlots();
      const appointmentsData = []; // Will be populated from DataService
      
      setDoctors(doctorsData);
      setSlots(slotsData);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Failed to load appointment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getWeekDays = () => {
    const start = startOfWeek(currentDate);
    const end = endOfWeek(currentDate);
    const days = [];
    
    for (let day = start; day <= end; day = addDays(day, 1)) {
      days.push(day);
    }
    
    return days;
  };

  const getSlotsForDate = (date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return slots.filter(slot => 
      slot.date === dateStr && 
      (selectedDoctor === 'all' || slot.doctorId === selectedDoctor)
    );
  };

  const getDoctorName = (doctorId) => {
    const doctor = doctors.find(d => d.id === doctorId);
    return doctor ? doctor.name : 'Unknown Doctor';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'closed':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'archived':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <FaCheckCircle size={12} />;
      case 'closed':
        return <FaTimesCircle size={12} />;
      case 'archived':
        return <FaExclamationCircle size={12} />;
      default:
        return <FaClock size={12} />;
    }
  };

  const navigateDate = (direction) => {
    const days = view === 'week' ? 7 : view === 'day' ? 1 : 30;
    const newDate = addDays(currentDate, direction * days);
    setCurrentDate(newDate);
  };

  const handleCreateSlots = () => {
    setShowSlotModal(true);
  };

  const handleSlotClick = (slot) => {
    setSelectedSlot(slot);
    setShowAppointmentModal(true);
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointment Management</h1>
          <p className="text-gray-600">Manage schedules and appointments</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCreateSlots}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <FaCalendarPlus className="mr-2" size={16} />
            Create Slots
          </button>
          <button
            onClick={() => setShowAppointmentModal(true)}
            className="inline-flex items-center px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors"
          >
            <FaPlus className="mr-2" size={16} />
            Manual Booking
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center justify-between">
          {/* View Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex rounded-lg border border-gray-300">
              {['day', 'week', 'month'].map((viewType) => (
                <button
                  key={viewType}
                  onClick={() => setView(viewType)}
                  className={`px-4 py-2 text-sm font-medium capitalize ${
                    view === viewType
                      ? 'bg-primary-600 text-white'
                      : 'text-gray-700 hover:bg-gray-50'
                  } ${viewType === 'day' ? 'rounded-l-lg' : viewType === 'month' ? 'rounded-r-lg' : ''}`}
                >
                  {viewType}
                </button>
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <FaFilter className="text-gray-400" size={16} />
              <select
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="all">All Doctors</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigateDate(-1)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaChevronLeft size={16} />
            </button>
            
            <div className="text-lg font-semibold text-gray-900 min-w-[200px] text-center">
              {view === 'week' 
                ? `${format(startOfWeek(currentDate), 'MMM d')} - ${format(endOfWeek(currentDate), 'MMM d, yyyy')}`
                : format(currentDate, view === 'day' ? 'EEEE, MMM d, yyyy' : 'MMMM yyyy')
              }
            </div>
            
            <button
              onClick={() => navigateDate(1)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaChevronRight size={16} />
            </button>
            
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Today
            </button>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {view === 'week' && (
          <div className="p-6">
            <div className="grid grid-cols-8 gap-4">
              {/* Time column */}
              <div className="space-y-4">
                <div className="h-12"></div> {/* Header spacer */}
                {Array.from({ length: 10 }, (_, i) => (
                  <div key={i} className="h-16 text-sm text-gray-500 text-right pr-2">
                    {9 + i}:00
                  </div>
                ))}
              </div>

              {/* Day columns */}
              {getWeekDays().map((day, dayIndex) => (
                <div key={dayIndex} className="space-y-4">
                  {/* Day header */}
                  <div className="h-12 text-center">
                    <div className="text-sm font-medium text-gray-900">
                      {format(day, 'EEE')}
                    </div>
                    <div className={`text-lg font-bold ${
                      isSameDay(day, new Date()) ? 'text-primary-600' : 'text-gray-700'
                    }`}>
                      {format(day, 'd')}
                    </div>
                  </div>

                  {/* Time slots */}
                  <div className="space-y-2">
                    {getSlotsForDate(day).map((slot) => (
                      <button
                        key={slot.id}
                        onClick={() => handleSlotClick(slot)}
                        className={`w-full p-2 text-left text-xs rounded border transition-colors hover:shadow-sm ${getStatusColor(slot.status)}`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium">{slot.startTime}</span>
                          {getStatusIcon(slot.status)}
                        </div>
                        <div className="text-gray-600 truncate">
                          {getDoctorName(slot.doctorId)}
                        </div>
                        <div className="text-gray-500">
                          {slot.booked}/{slot.capacity}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'day' && (
          <div className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {format(currentDate, 'EEEE, MMMM d, yyyy')}
              </h3>
              
              <div className="grid gap-4">
                {getSlotsForDate(currentDate).length === 0 ? (
                  <div className="text-center py-12">
                    <FaCalendarAlt className="mx-auto text-gray-400 mb-4" size={48} />
                    <h4 className="text-lg font-medium text-gray-900 mb-2">No slots scheduled</h4>
                    <p className="text-gray-600 mb-4">Create appointment slots for this day.</p>
                    <button
                      onClick={handleCreateSlots}
                      className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <FaCalendarPlus className="mr-2" size={16} />
                      Create Slots
                    </button>
                  </div>
                ) : (
                  getSlotsForDate(currentDate).map((slot) => (
                    <div
                      key={slot.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-colors hover:shadow-sm ${getStatusColor(slot.status)}`}
                      onClick={() => handleSlotClick(slot)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="text-lg font-semibold">
                            {slot.startTime} - {slot.endTime}
                          </div>
                          <div className="text-sm text-gray-600">
                            {getDoctorName(slot.doctorId)}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm">
                            {slot.booked}/{slot.capacity} booked
                          </span>
                          {getStatusIcon(slot.status)}
                        </div>
                      </div>
                      {slot.notes && (
                        <p className="mt-2 text-sm text-gray-600">{slot.notes}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCheckCircle className="text-green-600" size={16} />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {slots.filter(s => s.status === 'open').length}
              </div>
              <div className="text-sm text-gray-600">Open Slots</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaUser className="text-blue-600" size={16} />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {slots.reduce((sum, slot) => sum + slot.booked, 0)}
              </div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaCalendarAlt className="text-purple-600" size={16} />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {slots.filter(s => s.date === format(new Date(), 'yyyy-MM-dd')).length}
              </div>
              <div className="text-sm text-gray-600">Today's Slots</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                <FaClock className="text-orange-600" size={16} />
              </div>
            </div>
            <div className="ml-4">
              <div className="text-2xl font-bold text-gray-900">
                {Math.round((slots.reduce((sum, slot) => sum + slot.booked, 0) / Math.max(slots.reduce((sum, slot) => sum + slot.capacity, 0), 1)) * 100)}%
              </div>
              <div className="text-sm text-gray-600">Utilization</div>
            </div>
          </div>
        </div>
      </div>

      {/* Slot Creation Modal */}
      {showSlotModal && (
        <SlotCreationModal
          doctors={doctors}
          onClose={() => setShowSlotModal(false)}
          onSuccess={() => {
            setShowSlotModal(false);
            loadData();
          }}
        />
      )}

      {/* Appointment Modal */}
      {showAppointmentModal && (
        <AppointmentModal
          slot={selectedSlot}
          onClose={() => {
            setShowAppointmentModal(false);
            setSelectedSlot(null);
          }}
          onSuccess={() => {
            setShowAppointmentModal(false);
            setSelectedSlot(null);
            loadData();
          }}
        />
      )}
    </div>
  );
};

// Slot Creation Modal Component
const SlotCreationModal = ({ doctors, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    doctorId: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(addDays(new Date(), 7), 'yyyy-MM-dd'),
    startTime: '09:00',
    endTime: '17:00',
    interval: 30,
    capacity: 1
  });
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCreating(true);

    try {
      await dataService.createBulkSlots(
        formData.doctorId,
        formData.startDate,
        formData.endDate,
        formData.startTime,
        formData.endTime,
        formData.interval,
        formData.capacity
      );
      onSuccess();
    } catch (error) {
      console.error('Failed to create slots:', error);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Create Appointment Slots</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Doctor</label>
            <select
              value={formData.doctorId}
              onChange={(e) => setFormData(prev => ({ ...prev, doctorId: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select Doctor</option>
              {doctors.map(doctor => (
                <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Interval (minutes)</label>
              <select
                value={formData.interval}
                onChange={(e) => setFormData(prev => ({ ...prev, interval: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value={15}>15 minutes</option>
                <option value={20}>20 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={45}>45 minutes</option>
                <option value={60}>60 minutes</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Capacity per slot</label>
              <input
                type="number"
                min="1"
                max="10"
                value={formData.capacity}
                onChange={(e) => setFormData(prev => ({ ...prev, capacity: parseInt(e.target.value) }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
            >
              {creating ? 'Creating...' : 'Create Slots'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Appointment Modal Component (placeholder)
const AppointmentModal = ({ slot, onClose, onSuccess }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Appointment Details</h3>
        <p className="text-gray-600 mb-4">
          {slot ? `Slot: ${slot.startTime} - ${slot.endTime}` : 'Manual booking form would go here'}
        </p>
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AppointmentManagement;

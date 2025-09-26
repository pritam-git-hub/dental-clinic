import React, { useState, useEffect } from 'react';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaUser, 
  FaEdit, 
  FaCheck,
  FaTimes,
  FaCalendarCheck
} from 'react-icons/fa';

const CalendarManagement = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [doctorSchedules, setDoctorSchedules] = useState({});
  const [appointments, setAppointments] = useState([]);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);

  const doctors = [
    { id: 'dr1', name: 'Dr. Gandhi', specialization: 'General Dentistry' },
    { id: 'dr2', name: 'Dr. Sharma', specialization: 'Orthodontics' },
    { id: 'dr3', name: 'Dr. Patel', specialization: 'Oral Surgery' },
    { id: 'dr4', name: 'Dr. Kumar', specialization: 'Periodontics' }
  ];

  const defaultTimeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '14:00', '14:30', '15:00', '15:30',
    '16:00', '16:30', '17:00'
  ];

  useEffect(() => {
    loadScheduleData();
  }, []);

  const loadScheduleData = () => {
    const savedSchedules = localStorage.getItem('doctorSchedules');
    const savedAppointments = localStorage.getItem('appointments');
    
    if (savedSchedules) {
      setDoctorSchedules(JSON.parse(savedSchedules));
    }
    
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
    }
  };

  const saveScheduleData = (schedules) => {
    localStorage.setItem('doctorSchedules', JSON.stringify(schedules));
    setDoctorSchedules(schedules);
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  const getDoctorAvailability = (doctorId, date) => {
    const dateStr = formatDate(date);
    const schedule = doctorSchedules[doctorId]?.[dateStr];
    return schedule || { available: false, slots: [] };
  };

  const updateDoctorSchedule = (doctorId, date, availability) => {
    const dateStr = formatDate(date);
    const updatedSchedules = {
      ...doctorSchedules,
      [doctorId]: {
        ...doctorSchedules[doctorId],
        [dateStr]: availability
      }
    };
    saveScheduleData(updatedSchedules);
  };

  const getAppointmentsForDate = (date) => {
    const dateStr = formatDate(date);
    return appointments.filter(apt => apt.date === dateStr);
  };

  const isDateAvailable = (date) => {
    return doctors.some(doctor => {
      const availability = getDoctorAvailability(doctor.id, date);
      return availability.available;
    });
  };

  const handleSetDoctorSchedule = (doctorId, available, slots = []) => {
    const dateStr = formatDate(selectedDate);
    updateDoctorSchedule(doctorId, selectedDate, {
      available,
      slots: available ? slots : []
    });
    setShowScheduleModal(false);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const isToday = (date) => {
    const today = new Date();
    return date && 
           date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  const isSelected = (date) => {
    return date && 
           date.getDate() === selectedDate.getDate() &&
           date.getMonth() === selectedDate.getMonth() &&
           date.getFullYear() === selectedDate.getFullYear();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Calendar & Appointments</h1>
          <p className="text-neutral-600">Manage doctor availability and appointments</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex space-x-2">
              <button
                onClick={() => navigateMonth(-1)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                ←
              </button>
              <button
                onClick={() => navigateMonth(1)}
                className="p-2 hover:bg-neutral-100 rounded-lg transition-colors"
              >
                →
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-4">
            {weekDays.map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-neutral-600">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {getDaysInMonth(currentDate).map((date, index) => (
              <div key={index} className="aspect-square">
                {date && (
                  <button
                    onClick={() => setSelectedDate(date)}
                    className={`w-full h-full p-1 text-sm rounded-lg transition-colors relative ${
                      isSelected(date)
                        ? 'bg-primary-600 text-white'
                        : isToday(date)
                        ? 'bg-primary-100 text-primary-600'
                        : 'hover:bg-neutral-100'
                    }`}
                  >
                    <span className="block">{date.getDate()}</span>
                    {isDateAvailable(date) && (
                      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-green-500 rounded-full"></div>
                    )}
                    {getAppointmentsForDate(date).length > 0 && (
                      <div className="absolute top-1 right-1 w-1 h-1 bg-blue-500 rounded-full"></div>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center space-x-4 text-xs">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Doctor Available</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Has Appointments</span>
            </div>
          </div>
        </div>

        {/* Selected Date Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h3 className="text-lg font-semibold text-neutral-900 mb-4">
              {selectedDate.toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>

            <div className="space-y-4">
              <h4 className="font-medium text-neutral-700">Doctor Availability</h4>
              {doctors.map(doctor => {
                const availability = getDoctorAvailability(doctor.id, selectedDate);
                return (
                  <div key={doctor.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
                    <div>
                      <div className="font-medium text-neutral-900">{doctor.name}</div>
                      <div className="text-sm text-neutral-600">{doctor.specialization}</div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {availability.available ? (
                        <span className="flex items-center space-x-1 text-green-600">
                          <FaCheck size={12} />
                          <span className="text-xs">Available</span>
                        </span>
                      ) : (
                        <span className="flex items-center space-x-1 text-red-600">
                          <FaTimes size={12} />
                          <span className="text-xs">Not Available</span>
                        </span>
                      )}
                      <button
                        onClick={() => {
                          setSelectedDoctor(doctor.id);
                          setTimeSlots(availability.slots || []);
                          setShowScheduleModal(true);
                        }}
                        className="p-1 hover:bg-neutral-200 rounded transition-colors"
                      >
                        <FaEdit size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Appointments for selected date */}
          <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-6">
            <h4 className="font-medium text-neutral-700 mb-4">Appointments</h4>
            {getAppointmentsForDate(selectedDate).length === 0 ? (
              <p className="text-neutral-500 text-sm">No appointments scheduled</p>
            ) : (
              <div className="space-y-2">
                {getAppointmentsForDate(selectedDate).map((appointment, index) => (
                  <div key={index} className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-neutral-900">{appointment.patientName}</div>
                    <div className="text-sm text-neutral-600">{appointment.time} - {appointment.service}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Schedule Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              Set Schedule for {doctors.find(d => d.id === selectedDoctor)?.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={timeSlots.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setTimeSlots([...defaultTimeSlots]);
                      } else {
                        setTimeSlots([]);
                      }
                    }}
                    className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                  />
                  <span className="text-sm font-medium text-neutral-700">Available on this date</span>
                </label>
              </div>

              {timeSlots.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Available Time Slots</label>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {defaultTimeSlots.map(slot => (
                      <label key={slot} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={timeSlots.includes(slot)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTimeSlots([...timeSlots, slot]);
                            } else {
                              setTimeSlots(timeSlots.filter(s => s !== slot));
                            }
                          }}
                          className="w-3 h-3 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                        />
                        <span className="text-xs text-neutral-700">{slot}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowScheduleModal(false)}
                  className="flex-1 px-4 py-2 text-neutral-700 bg-neutral-200 rounded-lg hover:bg-neutral-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleSetDoctorSchedule(selectedDoctor, timeSlots.length > 0, timeSlots)}
                  className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Save Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FaCalendarAlt className="text-blue-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Today's Appointments</p>
              <p className="text-2xl font-bold text-neutral-900">
                {getAppointmentsForDate(new Date()).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <FaCalendarCheck className="text-green-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Available Doctors</p>
              <p className="text-2xl font-bold text-neutral-900">
                {doctors.filter(doctor => getDoctorAvailability(doctor.id, new Date()).available).length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <FaClock className="text-orange-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Time Slots</p>
              <p className="text-2xl font-bold text-neutral-900">
                {doctors.reduce((total, doctor) => {
                  const availability = getDoctorAvailability(doctor.id, new Date());
                  return total + (availability.slots?.length || 0);
                }, 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-neutral-200">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FaUser className="text-purple-600" size={20} />
            </div>
            <div>
              <p className="text-sm text-neutral-600">Total Doctors</p>
              <p className="text-2xl font-bold text-neutral-900">{doctors.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarManagement;

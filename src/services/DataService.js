// DataService - Abstract data layer for admin CMS
// Currently uses localStorage, can be replaced with backend API later

class DataService {
  constructor() {
    this.version = '1.0.0';
    this.initializeData();
  }

  // Initialize default data structure
  initializeData() {
    const existingData = localStorage.getItem('dentalClinicData');
    if (!existingData) {
      const defaultData = {
        version: this.version,
        doctors: [
          {
            id: 'dr-udey-gandhi',
            name: 'Dr. Udey Vir Gandhi',
            roleTitle: 'Consultant Prosthodontist',
            credentials: 'BDS, MDS (Cal), PGDHHM',
            bio: 'Leading prosthodontist with over 15 years of experience in dental implants and smile design.',
            phone: '+91 9051864455',
            email: 'udey@dentalavenue.com',
            avatarUrl: null,
            active: true,
            displayOrder: 1,
            tags: ['prosthodontics', 'implants', 'featured']
          },
          {
            id: 'dr-nipa-gandhi',
            name: 'Dr. Nipa Gandhi',
            roleTitle: 'Dental Surgeon & Laser Specialist',
            credentials: 'BDS (Cal), PGDHHM',
            bio: 'Expert in laser dentistry and minimally invasive dental procedures.',
            phone: '+91 9830032088',
            email: 'nipa@dentalavenue.com',
            avatarUrl: null,
            active: true,
            displayOrder: 2,
            tags: ['laser', 'general', 'featured']
          }
        ],
        services: [
          {
            id: 'general-dentistry',
            name: 'General Dentistry',
            category: 'General & Preventive',
            descriptionShort: 'Comprehensive oral health assessment and routine care',
            descriptionFull: 'Complete dental examination, cleaning, and preventive treatments to maintain optimal oral health.',
            active: true,
            displayOrder: 1
          },
          {
            id: 'dental-implants',
            name: 'Dental Implants',
            category: 'Restorative & Prosthodontics',
            descriptionShort: 'Permanent tooth replacement solution',
            descriptionFull: 'Advanced implant dentistry for single tooth or full mouth reconstruction.',
            active: true,
            displayOrder: 2
          }
        ],
        highlights: [
          { id: 'h1', text: 'Painless Dentistry', active: true, displayOrder: 1 },
          { id: 'h2', text: 'Modern Techniques and Equipment', active: true, displayOrder: 2 },
          { id: 'h3', text: 'Over 20 Years of Experience', active: true, displayOrder: 3 }
        ],
        branches: [
          { id: 'b1', name: 'Lansdowne Paddapukur, Kolkata', city: 'Kolkata', address: 'Lansdowne Paddapukur Area', active: true, displayOrder: 1 },
          { id: 'b2', name: 'Medica Superspeciality Hospital, Kolkata', city: 'Kolkata', address: 'Medica Hospital Complex', active: true, displayOrder: 2 },
          { id: 'b3', name: 'Sunny Enclave, Mohali, Punjab', city: 'Mohali', address: 'Sunny Enclave Area', active: true, displayOrder: 3 }
        ],
        contact: {
          phones: ['+91 9051864455', '+91 9830032088'],
          email: 'dentalavenue14@gmail.com',
          website: 'www.drgandhis.in',
          address: 'Dental Avenue @ Disha Eye Hospital (New Town), 7th Floor, Premises No. 29, Street No 327, Plot No - DG – 20/22, Action Area 1D, New Town, Kolkata – 700156',
          hours: '9 AM to 5 PM'
        },
        appointmentSlots: [],
        appointments: [],
        media: [],
        auditLog: []
      };
      
      localStorage.setItem('dentalClinicData', JSON.stringify(defaultData));
    }
  }

  // Generic CRUD operations
  getData() {
    const data = localStorage.getItem('dentalClinicData');
    return data ? JSON.parse(data) : null;
  }

  saveData(data) {
    data.version = this.version;
    localStorage.setItem('dentalClinicData', JSON.stringify(data));
  }

  // Audit logging
  logAction(action, entity, entityId, changes = {}) {
    const data = this.getData();
    const logEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action, // 'create', 'update', 'delete'
      entity, // 'doctor', 'service', etc.
      entityId,
      changes,
      user: 'admin' // In future, get from auth context
    };
    
    data.auditLog.unshift(logEntry);
    // Keep only last 1000 entries
    if (data.auditLog.length > 1000) {
      data.auditLog = data.auditLog.slice(0, 1000);
    }
    
    this.saveData(data);
    return logEntry;
  }

  // Doctor operations
  getDoctors() {
    const data = this.getData();
    return data.doctors.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getDoctor(id) {
    const data = this.getData();
    return data.doctors.find(d => d.id === id);
  }

  createDoctor(doctor) {
    const data = this.getData();
    const newDoctor = {
      ...doctor,
      id: doctor.id || `dr-${Date.now()}`,
      displayOrder: doctor.displayOrder || data.doctors.length + 1
    };
    
    data.doctors.push(newDoctor);
    this.saveData(data);
    this.logAction('create', 'doctor', newDoctor.id, newDoctor);
    return newDoctor;
  }

  updateDoctor(id, updates) {
    const data = this.getData();
    const index = data.doctors.findIndex(d => d.id === id);
    if (index === -1) return null;
    
    const oldDoctor = { ...data.doctors[index] };
    data.doctors[index] = { ...data.doctors[index], ...updates };
    this.saveData(data);
    this.logAction('update', 'doctor', id, { before: oldDoctor, after: data.doctors[index] });
    return data.doctors[index];
  }

  deleteDoctor(id) {
    const data = this.getData();
    const index = data.doctors.findIndex(d => d.id === id);
    if (index === -1) return false;
    
    const doctor = data.doctors[index];
    data.doctors.splice(index, 1);
    this.saveData(data);
    this.logAction('delete', 'doctor', id, doctor);
    return true;
  }

  // Service operations
  getServices() {
    const data = this.getData();
    return data.services.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  getService(id) {
    const data = this.getData();
    return data.services.find(s => s.id === id);
  }

  createService(service) {
    const data = this.getData();
    const newService = {
      ...service,
      id: service.id || `service-${Date.now()}`,
      displayOrder: service.displayOrder || data.services.length + 1
    };
    
    data.services.push(newService);
    this.saveData(data);
    this.logAction('create', 'service', newService.id, newService);
    return newService;
  }

  updateService(id, updates) {
    const data = this.getData();
    const index = data.services.findIndex(s => s.id === id);
    if (index === -1) return null;
    
    const oldService = { ...data.services[index] };
    data.services[index] = { ...data.services[index], ...updates };
    this.saveData(data);
    this.logAction('update', 'service', id, { before: oldService, after: data.services[index] });
    return data.services[index];
  }

  deleteService(id) {
    const data = this.getData();
    const index = data.services.findIndex(s => s.id === id);
    if (index === -1) return false;
    
    const service = data.services[index];
    data.services.splice(index, 1);
    this.saveData(data);
    this.logAction('delete', 'service', id, service);
    return true;
  }

  // Appointment slot operations
  getAppointmentSlots(filters = {}) {
    const data = this.getData();
    let slots = data.appointmentSlots;
    
    if (filters.doctorId) {
      slots = slots.filter(s => s.doctorId === filters.doctorId);
    }
    
    if (filters.date) {
      slots = slots.filter(s => s.date === filters.date);
    }
    
    if (filters.status) {
      slots = slots.filter(s => s.status === filters.status);
    }
    
    return slots.sort((a, b) => new Date(a.date + ' ' + a.startTime) - new Date(b.date + ' ' + b.startTime));
  }

  createAppointmentSlot(slot) {
    const data = this.getData();
    const newSlot = {
      ...slot,
      id: slot.id || `slot-${Date.now()}`,
      booked: 0,
      status: slot.status || 'open'
    };
    
    data.appointmentSlots.push(newSlot);
    this.saveData(data);
    this.logAction('create', 'appointmentSlot', newSlot.id, newSlot);
    return newSlot;
  }

  // Bulk create slots
  createBulkSlots(doctorId, startDate, endDate, startTime, endTime, interval, capacity = 1) {
    const slots = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let date = start; date <= end; date.setDate(date.getDate() + 1)) {
      const dateStr = date.toISOString().split('T')[0];
      
      // Generate time slots for this date
      const timeSlots = this.generateTimeSlots(startTime, endTime, interval);
      
      timeSlots.forEach(time => {
        const slot = this.createAppointmentSlot({
          doctorId,
          date: dateStr,
          startTime: time.start,
          endTime: time.end,
          capacity,
          location: 'Main Clinic',
          notes: '',
          status: 'open'
        });
        slots.push(slot);
      });
    }
    
    return slots;
  }

  generateTimeSlots(startTime, endTime, intervalMinutes) {
    const slots = [];
    const start = this.timeToMinutes(startTime);
    const end = this.timeToMinutes(endTime);
    
    for (let current = start; current < end; current += intervalMinutes) {
      const startTimeStr = this.minutesToTime(current);
      const endTimeStr = this.minutesToTime(current + intervalMinutes);
      
      slots.push({
        start: startTimeStr,
        end: endTimeStr
      });
    }
    
    return slots;
  }

  timeToMinutes(timeStr) {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  minutesToTime(minutes) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  // Export/Import operations
  exportData() {
    return this.getData();
  }

  importData(data) {
    // Validate data structure
    if (!data.version || !data.doctors || !data.services) {
      throw new Error('Invalid data format');
    }
    
    this.saveData(data);
    this.logAction('import', 'system', 'all', { message: 'Data imported' });
    return true;
  }

  // Get dashboard statistics
  getDashboardStats() {
    const data = this.getData();
    const today = new Date().toISOString().split('T')[0];
    const thisWeek = this.getWeekDates();
    
    return {
      totalDoctors: data.doctors.filter(d => d.active).length,
      totalServices: data.services.filter(s => s.active).length,
      openSlotsThisWeek: data.appointmentSlots.filter(s => 
        thisWeek.includes(s.date) && s.status === 'open' && s.booked < s.capacity
      ).length,
      upcomingBookings: data.appointments.filter(a => 
        a.status === 'booked' && this.getSlotDate(a.slotId) >= today
      ).length,
      todaysAppointments: this.getTodaysAppointments()
    };
  }

  getWeekDates() {
    const today = new Date();
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  }

  getTodaysAppointments() {
    const data = this.getData();
    const today = new Date().toISOString().split('T')[0];
    
    return data.appointments
      .filter(a => this.getSlotDate(a.slotId) === today)
      .map(a => {
        const slot = data.appointmentSlots.find(s => s.id === a.slotId);
        const doctor = data.doctors.find(d => d.id === slot?.doctorId);
        return {
          ...a,
          slot,
          doctor: doctor?.name || 'Unknown Doctor'
        };
      })
      .sort((a, b) => a.slot?.startTime.localeCompare(b.slot?.startTime));
  }

  getSlotDate(slotId) {
    const data = this.getData();
    const slot = data.appointmentSlots.find(s => s.id === slotId);
    return slot?.date;
  }
}

// Create singleton instance
const dataService = new DataService();
export default dataService;

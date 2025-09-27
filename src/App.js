import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header.js';
import Hero from './components/Hero.js';
import Services from './components/Services.js';
import Doctors from './components/Doctors.js';
import PatientFeedbackTicker from './components/PatientFeedbackTicker.js';
import Location from './components/Location.js';
import HighlightsBullets from './components/HighlightsBullets.js';
import Footer from './components/Footer.js';
import AdminLogin from './components/admin/AdminLogin.js';
import AdminLayout from './components/admin/AdminLayout.js';
import ProtectedRoute from './components/admin/ProtectedRoute.js';
import Dashboard from './components/admin/Dashboard.js';
import DoctorsManagement from './components/admin/DoctorsManagement.js';
import DoctorForm from './components/admin/DoctorForm.js';
import ServicesManagement from './components/admin/ServicesManagement.js';
import ServiceForm from './components/admin/ServiceForm.js';
import AppointmentManagement from './components/admin/AppointmentManagement.js';
import ContentManagement from './components/admin/ContentManagement.js';
import MediaLibrary from './components/admin/MediaLibrary.js';
import AdminSettings from './components/admin/AdminSettings.js';
import UserManagement from './components/admin/UserManagement.js';
import Analytics from './components/admin/Analytics.js';
import SuperAdminManagement from './components/admin/SuperAdminManagement.js';
import CalendarManagement from './components/admin/CalendarManagement.js';
import WebsiteContentManager from './components/admin/WebsiteContentManager.js';
import WorkTracker from './components/admin/WorkTracker.js';

// Public site component
const PublicSite = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'services', 'doctors', 'feedback', 'location', 'highlights'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 80;
      const elementPosition = element.offsetTop - headerHeight;
      
      // Check for reduced motion preference
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      
      window.scrollTo({
        top: elementPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });
    }
  };

  return (
    <div className="App">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      
      <Header activeSection={activeSection} scrollToSection={scrollToSection} />
      
      <main id="main-content">
        <section id="home">
          <Hero scrollToSection={scrollToSection} />
        </section>
        
        <section id="services">
          <Services />
        </section>
        
        <section id="doctors">
          <Doctors />
        </section>
        
        <section id="feedback">
          <PatientFeedbackTicker />
        </section>
        
        <section id="location">
          <Location />
        </section>
        
        <section id="highlights">
          <HighlightsBullets />
        </section>
        
      </main>
      
      <Footer scrollToSection={scrollToSection} />
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PublicSite />} />
        
        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Navigate to="/" replace />} />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="super-admin" element={<SuperAdminManagement />} />
          <Route path="calendar" element={<CalendarManagement />} />
          <Route path="website-content" element={<WebsiteContentManager />} />
          <Route path="work-tracker" element={<WorkTracker />} />
          <Route path="doctors" element={<DoctorsManagement />} />
          <Route path="doctors/new" element={<DoctorForm />} />
          <Route path="doctors/:id/edit" element={<DoctorForm />} />
          <Route path="services" element={<ServicesManagement />} />
          <Route path="services/new" element={<ServiceForm />} />
          <Route path="services/:id/edit" element={<ServiceForm />} />
          <Route path="appointments" element={<AppointmentManagement />} />
          <Route path="content" element={<ContentManagement />} />
          <Route path="media" element={<MediaLibrary />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

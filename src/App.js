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
        
        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;

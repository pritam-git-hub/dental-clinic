import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import Highlights from './components/Highlights';
import Services from './components/Services';
import Doctors from './components/Doctors';
import WhyUs from './components/WhyUs';
import FAQ from './components/FAQ';
import Location from './components/Location';
import AppointmentForm from './components/AppointmentForm';
import Footer from './components/Footer';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'highlights', 'services', 'doctors', 'why-us', 'faq', 'location', 'appointment'];
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
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth'
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
        
        <section id="highlights">
          <Highlights />
        </section>
        
        <section id="services">
          <Services />
        </section>
        
        <section id="doctors">
          <Doctors />
        </section>
        
        <section id="why-us">
          <WhyUs scrollToSection={scrollToSection} />
        </section>
        
        <section id="faq">
          <FAQ />
        </section>
        
        <section id="location">
          <Location />
        </section>
        
        <section id="appointment">
          <AppointmentForm />
        </section>
      </main>
      
      <Footer scrollToSection={scrollToSection} />
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FaBars,
  FaTimes,
  FaUser,
  FaPhoneAlt,
  FaUserShield
} from 'react-icons/fa';
import { siteConfig } from '../config/site';

const Header = ({ activeSection, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showAdminMessage, setShowAdminMessage] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'location', label: 'Contact' }
  ];

  const handleNavClick = (sectionId) => {
    scrollToSection(sectionId);
    setIsMenuOpen(false);
  };

  const handleKeyDown = (event, sectionId) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavClick(sectionId);
    }
  };

  const handleLoginClick = () => {
    setShowAdminMessage(true);
    setTimeout(() => {
      setShowAdminMessage(false);
    }, 5000);
  };

  return (
    <>
      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary-600 text-white px-4 py-2 rounded-md z-50"
      >
        Skip to main content
      </a>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'glass-effect shadow-soft-lg' 
          : 'bg-transparent'
      }`}>
      <nav className={`navbar navbar-expand-lg transition-all duration-300 ${
        isScrolled ? 'py-2' : 'py-4'
      }`}>
        <div className="section-container d-flex justify-content-between align-items-center w-100">
          <a 
            href="#home" 
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="navbar-brand d-flex align-items-center text-decoration-none"
          >
            <img 
              src="/svg.svg" 
              alt="Dr. Gandhi's Dental Avenue Logo" 
              className="me-2"
              style={{ height: '40px', width: 'auto' }}
            />
            <div className="d-flex flex-column">
              <span className="font-bold text-lg sm:text-xl lg:text-2xl text-primary-700 hover:text-primary-800 transition-colors">
                DR. GANDHI'S
              </span>
              <span className="font-bold text-base sm:text-lg lg:text-xl text-secondary-600 hover:text-secondary-700 transition-colors">
                DENTAL AVENUE
              </span>
            </div>
          </a>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-md text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 transition-colors border-0 bg-transparent"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="navbar-nav"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex ml-auto items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                className={`
                  border-0 bg-transparent
                  ${item.isButton 
                    ? 'btn-primary' 
                    : `nav-link font-medium transition-colors hover:text-primary-600 ${
                        activeSection === item.id 
                          ? 'text-primary-600 border-b-2 border-primary-600' 
                          : 'text-neutral-700'
                      }`
                  }
                `}
              >
                {item.label}
              </button>
            ))}
            
            <Link
              to="/admin/login"
              className="btn btn-outline-primary btn-sm d-flex align-items-center"
              aria-label="Admin Login"
            >
              <FaUserShield size={14} className="me-1" />
              Admin Login
            </Link>
            
          </div>

          {/* Mobile Navigation */}
          <div
            id="navbar-nav"
            className={`
              lg:hidden position-absolute top-100 start-0 end-0 bg-white shadow-lg border-top
              ${isMenuOpen ? 'd-block' : 'd-none'}
            `}
            style={{ zIndex: 1000 }}
          >
            <div className="d-flex flex-column p-4 gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  className={`
                    text-start py-3 px-4 rounded-md transition-colors border-0
                    ${item.isButton 
                      ? 'btn-primary w-100' 
                      : `hover:bg-neutral-100 ${
                          activeSection === item.id 
                            ? 'text-primary-600 bg-primary-50' 
                            : 'text-neutral-700 bg-transparent'
                        }`
                    }
                  `}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                >
                  {item.label}
                </button>
              ))}
              
              <Link
                to="/admin/login"
                className="d-flex align-items-center gap-3 py-3 px-4 text-primary-600 hover:bg-primary-50 rounded-md transition-colors text-decoration-none"
                aria-label="Admin Login"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUserShield size={16} />
                <span>Admin Login</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Admin Message Modal */}
      {showAdminMessage && (
        <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ zIndex: 9999, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white p-4 rounded-lg shadow-lg text-center" style={{ maxWidth: '400px', margin: '20px' }}>
            <div className="text-warning mb-3">
              <FaUser size={48} />
            </div>
            <h4 className="text-dark mb-3">Admin Access Only</h4>
            <p className="text-muted mb-4">This page is for admin only. Kindly go back.</p>
            <button 
              onClick={() => setShowAdminMessage(false)}
              className="btn btn-primary"
            >
              Go Back
            </button>
          </div>
        </div>
      )}
    </header>
    </>
  );
};

export default Header;

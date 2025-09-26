import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { FaBars, FaTimes, FaPhone } from 'react-icons/fa';
import { siteConfig } from '../config/site';

const Header = ({ activeSection, scrollToSection }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'doctors', label: 'Doctors' },
    { id: 'highlights', label: 'Highlights' },
    { id: 'location', label: 'Contact' },
    { id: 'appointment', label: 'Book', isButton: true }
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

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <Navbar expand="lg" className="py-3">
        <Container fluid className="section-container">
          <Navbar.Brand 
            href="#home" 
            onClick={(e) => {
              e.preventDefault();
              handleNavClick('home');
            }}
            className="font-bold text-xl lg:text-2xl text-primary-700 hover:text-primary-800 transition-colors"
          >
            {siteConfig.name}
          </Navbar.Brand>

          {/* Mobile menu toggle */}
          <button
            className="lg:hidden p-2 rounded-md text-neutral-600 hover:text-primary-600 hover:bg-neutral-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-expanded={isMenuOpen}
            aria-controls="navbar-nav"
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          {/* Desktop Navigation */}
          <Nav className="hidden lg:flex ml-auto items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                onKeyDown={(e) => handleKeyDown(e, item.id)}
                className={`
                  ${item.isButton 
                    ? 'btn-primary' 
                    : `nav-link font-medium transition-colors hover:text-primary-600 ${
                        activeSection === item.id 
                          ? 'text-primary-600 border-b-2 border-primary-600' 
                          : 'text-neutral-700'
                      }`
                  }
                `}
                aria-current={activeSection === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
            
            <a
              href={`tel:${siteConfig.phones[0]}`}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
              aria-label={`Call us at ${siteConfig.phones[0]}`}
            >
              <FaPhone size={16} />
              <span className="hidden xl:inline">{siteConfig.phones[0]}</span>
            </a>
          </Nav>

          {/* Mobile Navigation */}
          <div
            id="navbar-nav"
            className={`
              lg:hidden absolute top-full left-0 right-0 bg-white shadow-lg border-t
              ${isMenuOpen ? 'block' : 'hidden'}
            `}
          >
            <Nav className="flex flex-col p-4 space-y-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  onKeyDown={(e) => handleKeyDown(e, item.id)}
                  className={`
                    text-left py-3 px-4 rounded-md transition-colors
                    ${item.isButton 
                      ? 'btn-primary w-full' 
                      : `hover:bg-neutral-100 ${
                          activeSection === item.id 
                            ? 'text-primary-600 bg-primary-50' 
                            : 'text-neutral-700'
                        }`
                    }
                  `}
                  aria-current={activeSection === item.id ? 'page' : undefined}
                >
                  {item.label}
                </button>
              ))}
              
              <a
                href={`tel:${siteConfig.phones[0]}`}
                className="flex items-center space-x-3 py-3 px-4 text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
                aria-label={`Call us at ${siteConfig.phones[0]}`}
              >
                <FaPhone size={16} />
                <span>{siteConfig.phones[0]}</span>
              </a>
            </Nav>
          </div>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;

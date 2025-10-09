import React from 'react';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaArrowUp
} from 'react-icons/fa';
import { siteConfig } from '../config/site';

const Footer = ({ scrollToSection }) => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'doctors', label: 'Our Team' },
    { id: 'highlights', label: 'Why Choose Us' },
    { id: 'faq', label: 'FAQ' }
  ];

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <footer className="bg-neutral-900 text-white">
      {/* Main Footer */}
      <div className="section-container py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {siteConfig.name}
              </h3>
              <p className="text-primary-400 font-medium mb-4">
                {siteConfig.tagline}
              </p>
              <p className="text-neutral-300 leading-relaxed">
                Providing comprehensive, ethical dental care with a gentle approach 
                for over 20 years. Our multidisciplinary team is committed to your 
                oral health and comfort.
              </p>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <FaMapMarkerAlt className="text-primary-400 mt-1 flex-shrink-0" size={16} />
                <div>
                  <p className="text-neutral-300 text-sm leading-relaxed">
                    {siteConfig.address.full}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <FaClock className="text-primary-400 flex-shrink-0" size={16} />
                <span className="text-neutral-300 text-sm">{siteConfig.hours}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <FaPhone className="text-primary-400 flex-shrink-0" size={16} />
                <div className="flex flex-wrap gap-2">
                  {siteConfig.phones.map((phone, index) => (
                    <a
                      key={index}
                      href={`tel:${phone}`}
                      className="text-neutral-300 hover:text-primary-400 transition-colors text-sm"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <FaEnvelope className="text-primary-400 flex-shrink-0" size={16} />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-neutral-300 hover:text-primary-400 transition-colors text-sm"
                >
                  {siteConfig.email}
                </a>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Quick Links</h4>
            <nav className="space-y-3">
              {quickLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block text-neutral-300 hover:text-primary-400 transition-colors text-sm text-left"
                >
                  {link.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Branches */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-6">Our Locations</h4>
            <div className="space-y-3">
              {siteConfig.branches.map((branch, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-2"
                >
                  <FaMapMarkerAlt className="text-primary-400 mt-1 flex-shrink-0" size={12} />
                  <span className="text-neutral-300 text-sm">{branch}</span>
                </div>
              ))}
            </div>

            {/* Social Links Placeholder */}
            <div className="mt-8">
              <h5 className="text-sm font-semibold text-white mb-4">Follow Us</h5>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 hover:text-primary-400 hover:bg-neutral-700 transition-all"
                  aria-label="Facebook"
                >
                  <FaFacebook size={16} />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 hover:text-primary-400 hover:bg-neutral-700 transition-all"
                  aria-label="Instagram"
                >
                  <FaInstagram size={16} />
                </a>
                <a
                  href="#"
                  className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 hover:text-primary-400 hover:bg-neutral-700 transition-all"
                  aria-label="LinkedIn"
                >
                  <FaLinkedin size={16} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-neutral-800">
        <div className="section-container py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-neutral-400">
              <p>© {currentYear} {siteConfig.name}. All rights reserved.</p>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-primary-400 transition-colors">
                  Terms of Service
                </a>
              </div>
            </div>

            {/* Back to Top */}
            <button
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-neutral-400 hover:text-primary-400 transition-colors text-sm group"
              aria-label="Back to top"
            >
              <span>Back to Top</span>
              <FaArrowUp className="group-hover:transform group-hover:-translate-y-1 transition-transform" size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="bg-neutral-950 border-t border-neutral-800">
        <div className="section-container py-4">
          <p className="text-xs text-neutral-500 text-center leading-relaxed">
            <strong>Medical Disclaimer:</strong> The information on this website is for educational purposes only 
            and should not be used as a substitute for professional medical advice. Please consult with a 
            qualified healthcare provider for diagnosis and treatment recommendations.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

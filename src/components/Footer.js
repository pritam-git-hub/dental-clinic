import React from 'react';
import { 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaWhatsapp,
  FaPhoneAlt
} from 'react-icons/fa';
import { siteConfig } from '../config/site';
import { branches } from '../data/branches';

const Footer = ({ scrollToSection }) => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'doctors', label: 'Our Team' },
    { id: 'highlights', label: 'Why Choose Us' }
  ];

  return (
    <footer className="bg-neutral-900 text-white">
      {/* Main Footer */}
      <div className="section-container py-16">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Brand & Description */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-4 mb-4">
              <img 
                src="/svg.svg" 
                alt="Dr. Gandhi's Dental Avenue Logo" 
                className="h-12 w-auto"
              />
            </div>
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
                <FaPhoneAlt className="text-primary-400 flex-shrink-0" size={16} />
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
          <div className="space-y-4">
            <h4 className="text-lg font-semibold text-white mb-6">Our Branches</h4>
            {branches.map((branch, index) => {
              // Create Google Maps search URLs for each branch
              const branchUrls = {
                'Lansdowne Paddapukur, Kolkata': 'https://maps.app.goo.gl/9sjIb8sR6NzjTp4Z8',
                'Medica Superspeciality Hospital, Kolkata': 'https://maps.google.com/?q=Medica+Superspeciality+Hospital+Kolkata',
                'Sunny Enclave, Mohali, Punjab': 'https://maps.google.com/?q=Sunny+Enclave+Mohali+Punjab'
              };
              
              return (
                <div key={index} className="space-y-1">
                  <button
                    onClick={() => window.open(branchUrls[branch] || `https://maps.google.com/?q=${encodeURIComponent(branch)}`, '_blank')}
                    className="flex items-start space-x-2 text-left hover:bg-neutral-800 p-2 rounded-lg transition-colors w-full group"
                  >
                    <FaMapMarkerAlt className="text-primary-400 mt-1 flex-shrink-0 group-hover:text-primary-300 transition-colors" size={12} />
                    <div>
                      <span className="text-neutral-300 text-sm group-hover:text-white transition-colors">{branch}</span>
                      <div className="text-xs text-neutral-500 group-hover:text-neutral-400 transition-colors mt-1">
                        Click for directions
                      </div>
                    </div>
                  </button>
                </div>
              );
            })}

            {/* Social Media */}
            <div className="mt-8">
              <h5 className="text-sm font-semibold text-white mb-4">Follow Us</h5>
              <div className="flex space-x-4">
                <a
                  href="https://wa.me/919051864455"
                  className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 hover:text-green-400 hover:bg-neutral-700 transition-all"
                  aria-label="WhatsApp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaWhatsapp size={16} />
                </a>
                <a
                  href="https://facebook.com"
                  className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 hover:text-primary-400 hover:bg-neutral-700 transition-all"
                  aria-label="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaFacebook size={16} />
                </a>
                <a
                  href="https://instagram.com"
                  className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 hover:text-primary-400 hover:bg-neutral-700 transition-all"
                  aria-label="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaInstagram size={16} />
                </a>
                <a
                  href="https://linkedin.com"
                  className="w-8 h-8 bg-neutral-800 rounded-full flex items-center justify-center text-neutral-400 hover:text-primary-400 hover:bg-neutral-700 transition-all"
                  aria-label="LinkedIn"
                  target="_blank"
                  rel="noopener noreferrer"
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
          <div className="flex flex-col items-center space-y-3">
            {/* Copyright */}
            <p className="text-sm text-neutral-400 text-center">
              © {currentYear} DR. GANDHI'S DENTAL AVENUE. All rights reserved.
            </p>
            
            {/* Developed By */}
            <p className="text-sm text-neutral-500">
              Developed by <span className="text-primary-400 font-semibold">Simtrak Solutions</span>
            </p>
          </div>
        </div>
      </div>

    </footer>
  );
};

export default Footer;

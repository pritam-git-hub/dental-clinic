import React from 'react';
import { FaPhone, FaCalendarAlt } from 'react-icons/fa';
import { siteConfig } from '../config/site';

const Hero = ({ scrollToSection }) => {
  return (
    <section className="bg-gradient-to-br from-primary-50 to-secondary-50 section-padding">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8 animate-fade-in">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-neutral-900 leading-tight">
                Advanced dental care.{' '}
                <span className="text-primary-600">Gentle approach.</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-neutral-600 leading-relaxed max-w-2xl">
                From preventive care to implants and smile design, receive comprehensive, 
                painless treatment from a multidisciplinary team.
              </p>
              
              <div className="inline-flex items-center space-x-2 bg-primary-100 text-primary-800 px-4 py-2 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-primary-500 rounded-full animate-pulse"></span>
                <span>{siteConfig.tagline}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => scrollToSection('appointment')}
                className="btn-primary flex items-center justify-center space-x-2 text-lg"
                aria-label="Book an appointment"
              >
                <FaCalendarAlt size={18} />
                <span>Book Appointment</span>
              </button>
              
              <a
                href={`tel:${siteConfig.phones[0]}`}
                className="btn-secondary flex items-center justify-center space-x-2 text-lg"
                aria-label={`Call us now at ${siteConfig.phones[0]}`}
              >
                <FaPhone size={18} />
                <span>Call Now</span>
              </a>
            </div>

            {/* Quick Info */}
            <div className="grid sm:grid-cols-2 gap-6 pt-8 border-t border-neutral-200">
              <div className="space-y-2">
                <h3 className="font-semibold text-neutral-900">Hours</h3>
                <p className="text-neutral-600">{siteConfig.hours}</p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-neutral-900">Emergency Care</h3>
                <p className="text-neutral-600">Available for urgent cases</p>
              </div>
            </div>
          </div>

          {/* Image/Visual */}
          <div className="relative animate-slide-up animation-delay-200">
            <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12">
              <div className="space-y-6">
                {/* Placeholder for dental clinic image */}
                <div className="aspect-square bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-primary-200 rounded-full mx-auto flex items-center justify-center">
                      <svg className="w-12 h-12 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 4a1 1 0 011-1h12a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1V8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-semibold text-neutral-900">Modern Facility</h4>
                      <p className="text-sm text-neutral-600">State-of-the-art equipment for precise care</p>
                    </div>
                  </div>
                </div>

                {/* Trust indicators */}
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-primary-600">20+</div>
                    <div className="text-xs text-neutral-600">Years Experience</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-primary-600">14+</div>
                    <div className="text-xs text-neutral-600">Expert Specialists</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-lg font-bold text-primary-600">21+</div>
                    <div className="text-xs text-neutral-600">Services Offered</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-secondary-200 rounded-full opacity-60 animate-pulse"></div>
            <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-primary-200 rounded-full opacity-40 animate-pulse animation-delay-400"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

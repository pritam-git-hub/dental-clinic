import React from 'react';
import { FaPhoneAlt, FaEye } from 'react-icons/fa';
import { siteConfig } from '../config/site';
import Button from './ui/Button.js';
import useInView from '../hooks/useInView.js';
import ClinicCarousel from './ClinicCarousel.js';

const Hero = ({ scrollToSection }) => {
  const [heroRef, isHeroInView] = useInView();

  return (
    <section className="relative bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 section-padding overflow-hidden text-white">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <defs>
            <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
        </svg>
      </div>

      <div className="section-container relative z-10">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start lg:items-center">
          {/* Content */}
          <div ref={heroRef} className={`space-y-6 sm:space-y-8 ${isHeroInView ? 'animate-in' : 'opacity-0'}`}>
            <div className="space-y-6">
              {/* Logo and Branding */}
              <div className="flex items-center space-x-4 mb-8">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center p-1 overflow-hidden">
                  <img 
                    src="/svg.svg" 
                    alt="Dr. Gandhi's Dental Avenue" 
                    className="w-12 h-12 object-cover rounded-full"
                  />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                    DR. GANDHI'S
                  </h1>
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-secondary-300">
                    DENTAL AVENUE
                  </h2>
                </div>
              </div>
              
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-white/90 whitespace-nowrap">
                {siteConfig.tagline}
              </h3>
              
              <p className="text-white/90 text-base sm:text-lg max-w-2xl leading-relaxed">
                From preventive care to implants and smile design, receive comprehensive, 
                painless treatment from a multidisciplinary team.
              </p>
              
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-col sm:flex-row gap-2 justify-center sm:justify-start ${isHeroInView ? 'animate-in animate-in-delay-200' : 'opacity-0'}`}>
              <Button
                variant="primary"
                size="md"
                onClick={() => scrollToSection('location')}
                className="whitespace-nowrap font-medium text-sm px-3 py-2 w-full sm:w-auto"
              >
                Book Appointment
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => window.open(`tel:${siteConfig.phones[0]}`, '_self')}
                  icon={<FaPhoneAlt size={14} />}
                  className="whitespace-nowrap font-medium text-sm px-3 py-2 flex-1 sm:flex-none"
                >
                  Call Now
                </Button>
                
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => window.open('https://drive.google.com/file/d/1y-mnlZ4BGdLIA8c0MMDSoB9gaE0tW0nN/view?usp=drive_link', '_blank')}
                  icon={<FaEye size={14} />}
                  className="whitespace-nowrap font-medium text-sm px-3 py-2 flex-1 sm:flex-none"
                >
                  View Brochure
                </Button>
              </div>
            </div>

            {/* Quick Info */}
            <div className={`pt-8 border-t border-white/50 ${isHeroInView ? 'animate-in animate-in-delay-300' : 'opacity-0'}`}>
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-4 sm:p-5 border border-white/50 shadow-xl">
                <h3 className="font-semibold text-neutral-900 mb-3 text-base sm:text-lg">Clinic Hours</h3>
                <div className="text-sm sm:text-base space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-700 font-medium">Mon - Sat</span>
                    <span className="text-primary-600 font-semibold bg-primary-50 px-3 py-1 rounded-lg">9 AM - 5 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-neutral-700 font-medium">Sunday</span>
                    <span className="text-red-600 font-semibold bg-red-50 px-3 py-1 rounded-lg">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Visual Section */}
          <div className={`relative ${isHeroInView ? 'animate-in animate-in-delay-400' : 'opacity-0'}`}>
            <div className="relative bg-white rounded-3xl shadow-soft-lg p-4 sm:p-6 lg:p-12 border border-neutral-100">
              <div className="space-y-8">
                {/* Clinic Photos Carousel */}
                <div className="aspect-square bg-gradient-to-br from-primary-100 via-primary-50 to-secondary-100 rounded-2xl relative overflow-hidden">
                  <ClinicCarousel />
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-center">
                  <div className="space-y-1 p-2 sm:p-3 bg-primary-50 rounded-lg">
                    <div className="text-xs sm:text-sm font-bold text-primary-600">10000+</div>
                    <div className="text-xs font-medium text-neutral-700">Happy Patients</div>
                  </div>
                  <div className="space-y-1 p-2 sm:p-3 bg-secondary-50 rounded-lg">
                    <div className="text-xs sm:text-sm font-bold text-secondary-600">20+</div>
                    <div className="text-xs font-medium text-neutral-700"><span className="sm:hidden">Years Exp.</span><span className="hidden sm:inline">Years Experience</span></div>
                  </div>
                  <div className="space-y-1 p-2 sm:p-3 bg-green-50 rounded-lg">
                    <div className="text-xs sm:text-sm font-bold text-green-600">14+</div>
                    <div className="text-xs font-medium text-neutral-700"><span className="sm:hidden">Specialists</span><span className="hidden sm:inline">Expert Specialists</span></div>
                  </div>
                  <div className="space-y-1 p-2 sm:p-3 bg-orange-50 rounded-lg">
                    <div className="text-xs sm:text-sm font-bold text-orange-600">21+</div>
                    <div className="text-xs font-medium text-neutral-700"><span className="sm:hidden">Services</span><span className="hidden sm:inline">Services Offered</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-secondary-200 to-secondary-300 rounded-full opacity-50 animate-bounce-gentle blur-sm hidden lg:block"></div>
            <div className="absolute -bottom-4 -left-4 w-14 h-14 bg-gradient-to-br from-primary-200 to-primary-300 rounded-full opacity-30 animate-bounce-gentle blur-sm hidden lg:block" style={{animationDelay: '1.5s'}}></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;

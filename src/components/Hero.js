import React from 'react';
import { FaPhoneAlt, FaClock, FaEye } from 'react-icons/fa';
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
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start lg:items-center">
          {/* Content */}
          <div ref={heroRef} className={`space-y-8 ${isHeroInView ? 'animate-in' : 'opacity-0'}`}>
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
                  <h1 className="text-3xl lg:text-4xl font-bold text-white">
                    DR. GANDHI'S
                  </h1>
                  <h2 className="text-2xl lg:text-3xl font-bold text-secondary-300">
                    DENTAL AVENUE
                  </h2>
                </div>
              </div>
              
              <h3 className="text-xl lg:text-2xl font-semibold text-white/90">
                {siteConfig.tagline}
              </h3>
              
              <p className="text-white/90 text-lg max-w-2xl leading-relaxed">
                From preventive care to implants and smile design, receive comprehensive, 
                painless treatment from a multidisciplinary team.
              </p>
              
            </div>

            {/* CTA Buttons */}
            <div className={`flex flex-row gap-2 flex-wrap justify-center sm:justify-start ${isHeroInView ? 'animate-in animate-in-delay-200' : 'opacity-0'}`}>
              <Button
                variant="primary"
                size="md"
                onClick={() => scrollToSection('appointment')}
                className="whitespace-nowrap font-medium text-sm px-4 py-2"
              >
                Book Appointment
              </Button>
              
              <Button
                variant="secondary"
                size="md"
                onClick={() => window.open(`tel:${siteConfig.phones[0]}`, '_self')}
                icon={<FaPhoneAlt size={14} />}
                className="whitespace-nowrap font-medium text-sm px-4 py-2"
              >
                Call Now
              </Button>
              
              <Button
                variant="outline"
                size="md"
                onClick={() => window.open('https://drive.google.com/file/d/1y-mnlZ4BGdLIA8c0MMDSoB9gaE0tW0nN/view?usp=drive_link', '_blank')}
                icon={<FaEye size={14} />}
                className="whitespace-nowrap font-medium text-sm px-4 py-2"
              >
                View Brochure
              </Button>
            </div>

            {/* Quick Info */}
            <div className={`pt-8 border-t border-white/50 ${isHeroInView ? 'animate-in animate-in-delay-300' : 'opacity-0'}`}>
              <div className="bg-white/90 backdrop-blur-md rounded-xl p-5 border border-white/50 shadow-xl">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center shadow-sm">
                    <FaClock className="text-white" size={18} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 mb-3 text-base">Clinic Hours</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-700">Monday - Saturday</span>
                        <span className="text-primary-600 font-semibold bg-primary-50 px-2 py-1 rounded">{siteConfig.hours}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-700">Sunday</span>
                        <span className="text-red-600 font-semibold bg-red-50 px-2 py-1 rounded">Closed</span>
                      </div>
                    </div>
                    <div className="mt-4 inline-flex items-center space-x-2 bg-green-100 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium border border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Open Today</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Visual Section */}
          <div className={`relative ${isHeroInView ? 'animate-in animate-in-delay-400' : 'opacity-0'}`}>
            <div className="relative bg-white rounded-3xl shadow-soft-lg p-8 lg:p-12 border border-neutral-100">
              <div className="space-y-8">
                {/* Clinic Photos Carousel */}
                <div className="aspect-square bg-gradient-to-br from-primary-100 via-primary-50 to-secondary-100 rounded-2xl relative overflow-hidden">
                  <ClinicCarousel />
                </div>

                {/* Trust Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                  <div className="space-y-1 p-3 bg-primary-50 rounded-lg">
                    <div className="text-sm font-bold text-primary-600">10000+</div>
                    <div className="text-xs font-medium text-neutral-700">Happy Patients</div>
                  </div>
                  <div className="space-y-1 p-3 bg-secondary-50 rounded-lg">
                    <div className="text-sm font-bold text-secondary-600">20+</div>
                    <div className="text-xs font-medium text-neutral-700">Years Experience</div>
                  </div>
                  <div className="space-y-1 p-3 bg-green-50 rounded-lg">
                    <div className="text-sm font-bold text-green-600">14+</div>
                    <div className="text-xs font-medium text-neutral-700">Expert Specialists</div>
                  </div>
                  <div className="space-y-1 p-3 bg-orange-50 rounded-lg">
                    <div className="text-sm font-bold text-orange-600">21+</div>
                    <div className="text-xs font-medium text-neutral-700">Services Offered</div>
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

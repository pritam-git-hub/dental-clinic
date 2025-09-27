import React from 'react';
import { FaTooth } from 'react-icons/fa';
import { services } from '../data/services';
import Card from './ui/Card.js';
import Section from './ui/Section.js';
import useInView from '../hooks/useInView.js';

const Services = () => {
  const [servicesRef, isServicesInView] = useInView();

  return (
    <Section background="white" padding="default">
      <div ref={servicesRef} className="text-center mb-16">
        <h2 className={`heading-secondary ${isServicesInView ? 'animate-in' : 'opacity-0'}`}>
          Comprehensive Dental Services
        </h2>
        <p className={`text-body-large max-w-3xl mx-auto ${isServicesInView ? 'animate-in animate-in-delay-100' : 'opacity-0'}`}>
          From routine cleanings to complex procedures, we offer a full range of 
          dental services to meet all your oral health needs.
        </p>
      </div>

      {/* Direct Services Listing */}
      <div className="animate-scale-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
          {services && services.length > 0 ? services.sort().map((service, index) => (
            <Card
              key={`service-${index}`}
              className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-102 bg-white border border-neutral-200 hover:border-primary-300 cursor-pointer"
            >
              <div className="flex items-center space-x-3 p-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center group-hover:from-primary-600 group-hover:to-primary-700 transition-all duration-300 shadow-md">
                  <FaTooth size={12} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-neutral-900 group-hover:text-primary-700 transition-colors text-xs leading-tight">
                    {service}
                  </h4>
                </div>
              </div>
            </Card>
          )) : (
            <div className="col-span-full text-center py-8">
              <p>No services available</p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default Services;

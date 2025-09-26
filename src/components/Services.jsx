import React, { useState } from 'react';
import { 
  FaTooth, 
  FaCrown, 
  FaStar, 
  FaUserMd, 
  FaScalpel,
  FaChevronRight 
} from 'react-icons/fa';
import { serviceGroups } from '../data/services';

const Services = () => {
  const [activeGroup, setActiveGroup] = useState(serviceGroups[0].id);

  const groupIcons = {
    'general-preventive': FaTooth,
    'restorative-prosthodontics': FaCrown,
    'cosmetic-smile': FaStar,
    'specialty-care': FaUserMd,
    'surgery-advanced': FaScalpel
  };

  const activeGroupData = serviceGroups.find(group => group.id === activeGroup);

  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="heading-secondary">
            Comprehensive Dental Services
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            From routine cleanings to complex procedures, we offer a full range of 
            dental services to meet all your oral health needs.
          </p>
        </div>

        {/* Service Group Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {serviceGroups.map((group) => {
            const IconComponent = groupIcons[group.id];
            const isActive = activeGroup === group.id;
            
            return (
              <button
                key={group.id}
                onClick={() => setActiveGroup(group.id)}
                className={`
                  flex items-center space-x-3 px-6 py-3 rounded-full font-medium transition-all
                  ${isActive 
                    ? 'bg-primary-600 text-white shadow-lg' 
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }
                `}
                aria-pressed={isActive}
                aria-label={`View ${group.title} services`}
              >
                <IconComponent size={18} />
                <span>{group.title}</span>
              </button>
            );
          })}
        </div>

        {/* Active Service Group */}
        <div className="animate-fade-in">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">
              {activeGroupData.title}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {activeGroupData.items.map((service, index) => (
              <div
                key={service.id}
                className="card group hover:border-primary-200 border border-transparent transition-all duration-300 relative"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors">
                      {service.name}
                    </h4>
                    <FaChevronRight 
                      size={14} 
                      className="text-neutral-400 group-hover:text-primary-500 transition-colors mt-1" 
                    />
                  </div>
                  
                  <p className="text-sm text-neutral-600 leading-relaxed">
                    {service.benefit}
                  </p>

                  {/* Service indicator */}
                  <div className="flex items-center space-x-2 pt-2">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span className="text-xs text-primary-600 font-medium">Available</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* All Services Overview */}
        <div className="mt-16 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-neutral-900">
                Complete Dental Care Under One Roof
              </h3>
              <p className="text-neutral-600 leading-relaxed">
                Our comprehensive approach ensures you receive all the dental care you need 
                without the hassle of multiple referrals. From preventive care to complex 
                reconstructive procedures, our team of specialists works together to give 
                you the best possible outcomes.
              </p>
              
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-primary-600">21+</div>
                  <div className="text-sm text-neutral-600">Services Offered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary-600">100%</div>
                  <div className="text-sm text-neutral-600">Patient Satisfaction</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {serviceGroups.map((group, index) => {
                const IconComponent = groupIcons[group.id];
                return (
                  <div
                    key={group.id}
                    className="flex items-center space-x-4 bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center text-primary-600">
                      <IconComponent size={18} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-neutral-900">{group.title}</h4>
                      <p className="text-sm text-neutral-600">{group.items.length} specialized services</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Services;

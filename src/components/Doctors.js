import React from 'react';
import { 
  FaUserMd, 
  FaTooth,
  FaCrown,
  FaCut,
  FaChild,
  FaHeart,
  FaEye,
  FaStethoscope
} from 'react-icons/fa';
import { doctors } from '../data/doctors';
import Card from './ui/Card.js';
import Section from './ui/Section.js';
import useInView from '../hooks/useInView.js';

const Doctors = () => {
  const [doctorsRef, isDoctorsInView] = useInView();

  // Department icon mapping
  const departmentIcons = {
    prosthodontics: { icon: FaCrown, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    laser: { icon: FaEye, color: 'text-red-600', bg: 'bg-red-100' },
    surgery: { icon: FaCut, color: 'text-red-600', bg: 'bg-red-100' },
    orthodontics: { icon: FaTooth, color: 'text-blue-600', bg: 'bg-blue-100' },
    implants: { icon: FaCrown, color: 'text-purple-600', bg: 'bg-purple-100' },
    endodontics: { icon: FaHeart, color: 'text-pink-600', bg: 'bg-pink-100' },
    general: { icon: FaUserMd, color: 'text-green-600', bg: 'bg-green-100' },
    pediatric: { icon: FaChild, color: 'text-orange-600', bg: 'bg-orange-100' },
    periodontics: { icon: FaStethoscope, color: 'text-teal-600', bg: 'bg-teal-100' }
  };

  const getDepartmentIcon = (department) => {
    return departmentIcons[department] || departmentIcons.general;
  };

  return (
    <Section background="neutral" padding="default">
      <div ref={doctorsRef} className="text-center mb-16">
        <h2 className={`heading-secondary ${isDoctorsInView ? 'animate-in' : 'opacity-0'}`}>
          Meet Our Expert Team
        </h2>
        <p className={`text-body-large max-w-3xl mx-auto ${isDoctorsInView ? 'animate-in animate-in-delay-100' : 'opacity-0'}`}>
          Our multidisciplinary team of experienced dentists and specialists 
          provides comprehensive care with the latest techniques and technology.
        </p>
      </div>

      {/* Direct Doctors Listing */}
      <div className="animate-scale-in">
        <div className="text-center mb-4">
          <p>Total Doctors: {doctors.length}</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {doctors && doctors.length > 0 ? doctors.map((doctor, index) => {
            const departmentConfig = getDepartmentIcon(doctor.department);
            const DepartmentIcon = departmentConfig.icon;
            
            return (
              <Card
                key={doctor.id}
                className="group hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 hover:scale-102 bg-white border border-neutral-200 hover:border-primary-300 cursor-pointer"
              >
                <div className="p-6 text-center">
                  <div className={`w-16 h-16 ${departmentConfig.bg} rounded-full flex items-center justify-center mx-auto mb-4 relative`}>
                    <DepartmentIcon size={24} className={departmentConfig.color} />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <FaUserMd size={10} className="text-neutral-600" />
                    </div>
                  </div>
                  <h4 className="font-bold text-neutral-900 mb-2 group-hover:text-primary-700 transition-colors">
                    {doctor.name}
                  </h4>
                  <p className="text-sm text-neutral-600 mb-2">{doctor.role}</p>
                  <p className="text-xs text-neutral-500">{doctor.credentials}</p>
                  <div className="flex items-center justify-center mt-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse-gentle mr-2"></div>
                    <span className="text-xs text-green-600 font-medium">Available</span>
                  </div>
                </div>
              </Card>
            );
          }) : (
            <div className="col-span-full text-center py-8">
              <p>No doctors available</p>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default Doctors;

import React, { useState } from 'react';
import { FaUserMd, FaGraduationCap, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { featuredDoctors, teamDoctors } from '../data/doctors';

const Doctors = () => {
  const [showAllDoctors, setShowAllDoctors] = useState(false);

  return (
    <section className="section-padding bg-neutral-50">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="heading-secondary">
            Meet Our Expert Team
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Our multidisciplinary team of experienced dentists and specialists 
            are committed to providing you with the highest quality dental care.
          </p>
        </div>

        {/* Featured Doctors */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-neutral-900 mb-8 text-center">
            Leading Specialists
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {featuredDoctors.map((doctor, index) => (
              <div
                key={doctor.id}
                className="card group hover:shadow-lg transition-all duration-300 animate-fade-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="space-y-6">
                  {/* Doctor Avatar */}
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white">
                      <FaUserMd size={32} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
                        {doctor.name}
                      </h4>
                      <p className="text-primary-600 font-medium">{doctor.role}</p>
                    </div>
                  </div>

                  {/* Credentials */}
                  <div className="flex items-start space-x-3">
                    <FaGraduationCap className="text-neutral-400 mt-1 flex-shrink-0" size={16} />
                    <div>
                      <p className="font-medium text-neutral-900 mb-1">Qualifications</p>
                      <p className="text-neutral-600 text-sm">{doctor.credentials}</p>
                    </div>
                  </div>

                  {/* Specialization badge */}
                  <div className="inline-flex items-center space-x-2 bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm font-medium">
                    <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
                    <span>Lead Specialist</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Team Doctors Section */}
        <div className="bg-white rounded-2xl p-8 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-neutral-900">
              Our Complete Team
            </h3>
            <button
              onClick={() => setShowAllDoctors(!showAllDoctors)}
              className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium transition-colors"
              aria-expanded={showAllDoctors}
              aria-controls="team-doctors-list"
            >
              <span>{showAllDoctors ? 'Show Less' : 'Meet the Team'}</span>
              {showAllDoctors ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
            </button>
          </div>

          {/* Team Overview */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="text-center p-6 bg-primary-50 rounded-xl">
              <div className="text-3xl font-bold text-primary-600 mb-2">14+</div>
              <div className="text-neutral-700 font-medium">Specialist Doctors</div>
              <div className="text-sm text-neutral-600 mt-1">Multi-disciplinary expertise</div>
            </div>
            <div className="text-center p-6 bg-secondary-50 rounded-xl">
              <div className="text-3xl font-bold text-secondary-600 mb-2">20+</div>
              <div className="text-neutral-700 font-medium">Years Experience</div>
              <div className="text-sm text-neutral-600 mt-1">Combined expertise</div>
            </div>
            <div className="text-center p-6 bg-green-50 rounded-xl">
              <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
              <div className="text-neutral-700 font-medium">Qualified Professionals</div>
              <div className="text-sm text-neutral-600 mt-1">Licensed & certified</div>
            </div>
          </div>

          {/* Expandable Team List */}
          <div
            id="team-doctors-list"
            className={`transition-all duration-500 overflow-hidden ${
              showAllDoctors ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-neutral-200">
              {teamDoctors.map((doctor, index) => (
                <div
                  key={doctor.id}
                  className="flex items-center space-x-4 p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                  style={{ 
                    animationDelay: showAllDoctors ? `${index * 50}ms` : '0ms' 
                  }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-neutral-300 to-neutral-400 rounded-full flex items-center justify-center text-white flex-shrink-0">
                    <FaUserMd size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="font-semibold text-neutral-900 text-sm truncate">
                      {doctor.name}
                    </h5>
                    <p className="text-xs text-neutral-600 mb-1">{doctor.role}</p>
                    <p className="text-xs text-neutral-500 truncate">{doctor.credentials}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Team Specializations */}
            <div className="mt-8 p-6 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl">
              <h4 className="font-bold text-neutral-900 mb-4">Our Specializations Include:</h4>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                  'Prosthodontics',
                  'Periodontics', 
                  'Oral & Maxillofacial Surgery',
                  'Orthodontics',
                  'Conservative Dentistry',
                  'Pediatric Dentistry',
                  'Geriatric Dentistry',
                  'Laser Dentistry',
                  'Public Health Dentistry'
                ].map((specialization, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-2 text-sm"
                  >
                    <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0"></div>
                    <span className="text-neutral-700">{specialization}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 shadow-sm border">
            <div className="text-left">
              <div className="font-semibold text-neutral-900">Ready to meet our team?</div>
              <div className="text-sm text-neutral-600">Schedule a consultation today</div>
            </div>
            <div className="w-px h-8 bg-neutral-200"></div>
            <div className="flex items-center space-x-2 text-primary-600 font-medium">
              <FaUserMd size={16} />
              <span>Book Consultation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Doctors;

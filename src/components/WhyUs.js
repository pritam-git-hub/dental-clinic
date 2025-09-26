import React from 'react';
import { 
  FaAward, 
  FaCog, 
  FaShieldAlt, 
  FaHeart, 
  FaClock, 
  FaHandshake,
  FaCalendarAlt 
} from 'react-icons/fa';

const WhyUs = ({ scrollToSection }) => {
  const differentiators = [
    {
      icon: FaAward,
      text: 'Years of trusted dental excellence',
      color: 'text-yellow-500'
    },
    {
      icon: FaCog,
      text: 'State-of-the-art modern technology',
      color: 'text-primary-600'
    },
    {
      icon: FaShieldAlt,
      text: 'Standardized sterilization protocols',
      color: 'text-green-500'
    },
    {
      icon: FaHeart,
      text: 'Comfort-first patient care approach',
      color: 'text-red-500'
    },
    {
      icon: FaClock,
      text: 'Emergency dental care available',
      color: 'text-orange-500'
    },
    {
      icon: FaHandshake,
      text: 'Ethical practice with transparent pricing',
      color: 'text-blue-500'
    }
  ];

  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="heading-secondary">
                Why Choose Dr. Gandhi's Dental Avenue?
              </h2>
              <p className="text-lg text-neutral-600 leading-relaxed">
                We believe that exceptional dental care goes beyond just treating teeth. 
                Our commitment to excellence, patient comfort, and ethical practice has made 
                us a trusted name in dental care for over two decades.
              </p>
            </div>

            {/* Differentiators List */}
            <div className="space-y-4">
              {differentiators.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-4 rounded-lg hover:bg-neutral-50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-neutral-100 flex items-center justify-center ${item.color}`}>
                      <IconComponent size={20} />
                    </div>
                    <p className="text-neutral-700 font-medium">{item.text}</p>
                  </div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button
                onClick={() => scrollToSection('appointment')}
                className="btn-primary flex items-center space-x-2"
                aria-label="Book an appointment with our team"
              >
                <FaCalendarAlt size={18} />
                <span>Book Your Appointment</span>
              </button>
            </div>
          </div>

          {/* Visual/Stats */}
          <div className="space-y-8">
            {/* Main Stats Card */}
            <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-2xl p-8">
              <div className="text-center space-y-6">
                <h3 className="text-2xl font-bold text-neutral-900">
                  Our Track Record
                </h3>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="text-lg font-bold text-primary-600">Many</div>
                    <div className="text-sm text-neutral-600">Happy Patients</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-lg font-bold text-secondary-600">Comprehensive</div>
                    <div className="text-sm text-neutral-600">Services Offered</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-lg font-bold text-green-600">Multiple</div>
                    <div className="text-sm text-neutral-600">Clinic Locations</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-lg font-bold text-orange-600">Expert</div>
                    <div className="text-sm text-neutral-600">Specialists</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Preview */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FaAward key={star} className="text-yellow-400" size={16} />
                  ))}
                </div>
                <blockquote className="text-neutral-700 italic">
                  "Exceptional care with a gentle touch. The team made my dental 
                  implant procedure completely painless and the results are amazing!"
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                    S
                  </div>
                  <div>
                    <div className="font-medium text-neutral-900">Satisfied Patient</div>
                    <div className="text-sm text-neutral-600">Dental Implant Treatment</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-lg border p-4 text-center">
                <FaShieldAlt className="text-green-500 mx-auto mb-2" size={24} />
                <div className="font-semibold text-neutral-900 text-sm">Safe & Hygienic</div>
                <div className="text-xs text-neutral-600">WHO Standards</div>
              </div>
              <div className="bg-white rounded-lg border p-4 text-center">
                <FaCog className="text-primary-600 mx-auto mb-2" size={24} />
                <div className="font-semibold text-neutral-900 text-sm">Modern Tech</div>
                <div className="text-xs text-neutral-600">Latest Equipment</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Banner */}
        <div className="mt-16 bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-8 text-white text-center">
          <div className="max-w-3xl mx-auto space-y-4">
            <h3 className="text-2xl font-bold">
              Experience the Difference in Dental Care
            </h3>
            <p className="text-primary-100 leading-relaxed">
              Join thousands of satisfied patients who have trusted us with their smiles. 
              Our commitment to excellence and patient comfort sets us apart.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => scrollToSection('appointment')}
                className="bg-white text-primary-600 hover:bg-neutral-100 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Schedule Consultation
              </button>
              <button
                onClick={() => scrollToSection('location')}
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-semibold py-3 px-6 rounded-lg transition-all"
              >
                Visit Our Clinic
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyUs;

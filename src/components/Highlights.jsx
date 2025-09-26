import React from 'react';
import { 
  FaCog, 
  FaShieldAlt, 
  FaHeart, 
  FaSmile, 
  FaUserMd, 
  FaClock 
} from 'react-icons/fa';

const Highlights = () => {
  const highlights = [
    {
      id: 'modern-techniques',
      icon: FaCog,
      title: 'Modern Techniques & Equipment',
      description: 'Precise, comfortable care with state-of-the-art technology and advanced dental techniques.',
      color: 'text-primary-600'
    },
    {
      id: 'sterilization',
      icon: FaShieldAlt,
      title: 'Standardized Sterilization',
      description: 'Hygienic environment with strict sterilization protocols ensuring your safety.',
      color: 'text-secondary-600'
    },
    {
      id: 'preventive-care',
      icon: FaHeart,
      title: 'Comprehensive Preventive Care',
      description: 'Long-term oral health through thorough preventive treatments and education.',
      color: 'text-red-500'
    },
    {
      id: 'painless-dentistry',
      icon: FaSmile,
      title: 'Painless Dentistry',
      description: 'Patient comfort protocols ensuring a gentle, anxiety-free dental experience.',
      color: 'text-yellow-500'
    },
    {
      id: 'emergency-management',
      icon: FaClock,
      title: 'Emergency Management',
      description: 'Prompt attention and immediate care for dental emergencies when you need it most.',
      color: 'text-orange-500'
    },
    {
      id: 'friendly-team',
      icon: FaUserMd,
      title: 'Friendly, Ethical Team',
      description: 'Well-trained, compassionate professionals committed to ethical dental practice.',
      color: 'text-green-500'
    }
  ];

  return (
    <section className="bg-neutral-50 section-padding">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="heading-secondary">
            Why Choose Our Dental Care?
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Experience the difference with our patient-centered approach, 
            modern technology, and commitment to excellence in dental care.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {highlights.map((highlight, index) => {
            const IconComponent = highlight.icon;
            
            return (
              <div
                key={highlight.id}
                className="card-highlight group animate-fade-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="space-y-4">
                  <div className={`inline-flex p-4 rounded-full bg-neutral-100 group-hover:bg-white transition-colors ${highlight.color}`}>
                    <IconComponent size={32} />
                  </div>
                  
                  <h3 className="text-xl font-bold text-neutral-900">
                    {highlight.title}
                  </h3>
                  
                  <p className="text-neutral-600 leading-relaxed">
                    {highlight.description}
                  </p>
                </div>

                {/* Decorative element */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-primary-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 shadow-sm">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full border-2 border-white flex items-center justify-center text-white text-sm font-semibold"
                >
                  {i}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="font-semibold text-neutral-900">Join Our Happy Patients</div>
              <div className="text-sm text-neutral-600">Trusted dental care since 2003</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Highlights;

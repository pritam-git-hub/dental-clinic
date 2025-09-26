import React from 'react';
import { 
  FaCog, 
  FaShieldAlt, 
  FaHeart, 
  FaSmile, 
  FaUserMd, 
  FaClock,
  FaAward,
  FaHandsHelping,
  FaHome
} from 'react-icons/fa';
import Card from './ui/Card.js';
import Badge from './ui/Badge.js';
import Section from './ui/Section.js';
import useInView from '../hooks/useInView.js';
import { highlights } from '../data/highlights.js';

const Highlights = () => {
  const [highlightsRef, isHighlightsInView] = useInView();
  
  // Map highlights to icons and descriptions
  const highlightData = highlights.map((highlight, index) => {
    const iconMap = {
      'Modern Techniques and Equipment': { icon: FaCog, color: 'text-primary-600', description: 'Precise, comfortable care with state-of-the-art technology and advanced dental techniques.' },
      'Comprehensive Preventive Care': { icon: FaHeart, color: 'text-red-500', description: 'Long-term oral health through thorough preventive treatments and education.' },
      'Over 20 Years of Experience': { icon: FaAward, color: 'text-yellow-500', description: 'Two decades of excellence in dental care and patient satisfaction.' },
      'Convenient Clinic Timings': { icon: FaClock, color: 'text-blue-500', description: 'Flexible scheduling to accommodate your busy lifestyle.' },
      'Management of Dental Emergencies': { icon: FaSmile, color: 'text-orange-500', description: 'Prompt attention and immediate care for dental emergencies when you need it most.' },
      'Well Trained and Ethical Doctors': { icon: FaUserMd, color: 'text-green-500', description: 'Well-trained, compassionate professionals committed to ethical dental practice.' },
      'Standardized Sterilization': { icon: FaShieldAlt, color: 'text-secondary-600', description: 'Hygienic environment with strict sterilization protocols ensuring your safety.' },
      'Friendly Staff': { icon: FaHandsHelping, color: 'text-purple-500', description: 'Warm, welcoming team dedicated to your comfort and care.' },
      'Comfortable and Hygienic Environment': { icon: FaHome, color: 'text-teal-500', description: 'Clean, comfortable facilities designed for your peace of mind.' }
    };
    
    const config = iconMap[highlight] || { icon: FaCog, color: 'text-primary-600', description: 'Quality dental care service.' };
    
    return {
      id: `highlight-${index}`,
      title: highlight,
      icon: config.icon,
      color: config.color,
      description: config.description
    };
  });

  return (
    <Section background="neutral" padding="default">
      <div ref={highlightsRef} className="text-center mb-16">
        <h2 className={`heading-secondary ${isHighlightsInView ? 'animate-in' : 'opacity-0'}`}>
          Our Excellence in Dental Care
        </h2>
        <p className={`text-body-large max-w-3xl mx-auto ${isHighlightsInView ? 'animate-in animate-in-delay-100' : 'opacity-0'}`}>
          Experience the difference with our patient-centered approach, 
          modern technology, and commitment to excellence in dental care.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {highlightData.map((highlight, index) => {
          const IconComponent = highlight.icon;
          
          return (
            <Card
              key={highlight.id}
              variant="highlight"
              className={`group text-center relative overflow-hidden ${
                isHighlightsInView ? 'animate-in' : 'opacity-0'
              }`}
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              <div className="space-y-6">
                <div className={`inline-flex p-6 rounded-2xl bg-gradient-to-br from-neutral-50 to-neutral-100 group-hover:from-white group-hover:to-neutral-50 transition-all duration-300 ${highlight.color} group-hover:scale-110 group-hover:shadow-soft`}>
                  <IconComponent size={40} />
                </div>
                
                <div className="space-y-3">
                  <h3 className="heading-tertiary group-hover:text-primary-600 transition-colors">
                    {highlight.title}
                  </h3>
                  
                  <p className="text-neutral-600 leading-relaxed">
                    {highlight.description}
                  </p>
                </div>

                <Badge variant="primary" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                  Learn More
                </Badge>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-4 right-4 w-3 h-3 bg-primary-200 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:animate-pulse-gentle"></div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full opacity-0 group-hover:opacity-30 transition-all duration-500 group-hover:scale-150"></div>
            </Card>
          );
        })}
      </div>
      
      {/* Source note */}
      <div className="text-center mt-8">
        <Badge variant="outline" size="sm">Source: Brochure</Badge>
      </div>

      {/* Bottom CTA */}
      <div className={`text-center mt-16 ${isHighlightsInView ? 'animate-in animate-in-delay-400' : 'opacity-0'}`}>
        <Card className="inline-flex items-center space-x-6 px-8 py-6 shadow-soft-lg hover:shadow-glow transition-all duration-300">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-12 h-12 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full border-3 border-white flex items-center justify-center text-white font-bold shadow-soft animate-bounce-gentle"
                style={{ animationDelay: `${i * 0.2}s` }}
              >
                {i}
              </div>
            ))}
          </div>
          <div className="text-left">
            <div className="text-lg font-bold text-neutral-900">Join Our Happy Patients</div>
            <div className="text-neutral-600">Trusted dental care since 2003</div>
          </div>
        </Card>
      </div>
    </Section>
  );
};

export default Highlights;

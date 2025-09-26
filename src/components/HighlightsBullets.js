import React from 'react';
import { 
  FaCog, 
  FaHeart, 
  FaAward, 
  FaClock, 
  FaShieldAlt, 
  FaUsers,
  FaHome,
  FaHandHoldingHeart
} from 'react-icons/fa';
import Section from './ui/Section.js';
import './HighlightsBullets.css';

const HighlightsBullets = () => {
  const highlights = [
    {
      icon: FaCog,
      title: "Modern Techniques and Equipment",
      description: "State-of-the-art technology and advanced dental techniques for precise care.",
      color: "text-blue-600"
    },
    {
      icon: FaHeart,
      title: "Comprehensive Preventive Care",
      description: "Thorough preventive treatments and education for long-term oral health.",
      color: "text-red-500"
    },
    {
      icon: FaAward,
      title: "Over 20 Years of Experience",
      description: "Two decades of excellence in dental care and patient satisfaction.",
      color: "text-yellow-600"
    },
    {
      icon: FaClock,
      title: "Convenient Clinic Timings",
      description: "Flexible scheduling to accommodate your busy lifestyle.",
      color: "text-green-600"
    },
    {
      icon: FaShieldAlt,
      title: "Standardized Sterilization",
      description: "Strict sterilization protocols ensuring your safety and hygiene.",
      color: "text-purple-600"
    },
    {
      icon: FaUsers,
      title: "Well Trained and Ethical Doctors",
      description: "Compassionate professionals committed to ethical dental practice.",
      color: "text-indigo-600"
    },
    {
      icon: FaHandHoldingHeart,
      title: "Management of Dental Emergencies",
      description: "Prompt attention and immediate care for dental emergencies.",
      color: "text-pink-600"
    },
    {
      icon: FaHome,
      title: "Comfortable and Hygienic Environment",
      description: "Clean, comfortable facilities designed for your peace of mind.",
      color: "text-teal-600"
    }
  ];

  return (
    <Section background="neutral" padding="default">
      <div className="text-center mb-12">
        <h2 className="heading-secondary">
          Why Choose Dr. Gandhi's Dental Avenue
        </h2>
        <p className="text-body-large max-w-3xl mx-auto">
          Experience the difference with our patient-centered approach, modern technology, 
          and commitment to excellence in dental care.
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="highlights-grid">
          {highlights.map((highlight, index) => {
            const IconComponent = highlight.icon;
            
            return (
              <div
                key={index}
                className="highlight-card"
                role="article"
                aria-labelledby={`highlight-title-${index}`}
              >
                <div className="highlight-layout">
                  <div className="highlight-icon">
                    <IconComponent 
                      className={`${highlight.color}`} 
                      size={18} 
                      aria-hidden="true"
                    />
                  </div>
                  <div className="highlight-content">
                    <h3 
                      id={`highlight-title-${index}`}
                      className="highlight-title"
                    >
                      {highlight.title}
                    </h3>
                    <p className="highlight-description">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
};

export default HighlightsBullets;

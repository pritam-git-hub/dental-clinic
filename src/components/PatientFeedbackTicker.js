import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import Section from './ui/Section.js';
import useInView from '../hooks/useInView.js';
import './PatientFeedbackTicker.css';

const PatientFeedbackTicker = () => {
  const [feedbackRef, isFeedbackInView] = useInView();
  const [testimonials, setTestimonials] = useState([
    {
      id: 1,
      name: "Priya Sharma",
      treatment: "Dental Implant",
      rating: 5,
      text: "Exceptional care with a gentle touch. The team made my dental implant procedure completely painless and the results are amazing!",
      location: "New Town, Kolkata"
    },
    {
      id: 2,
      name: "Rajesh Kumar",
      treatment: "Root Canal Treatment",
      rating: 5,
      text: "Dr. Gandhi's expertise in root canal treatment is outstanding. What I thought would be painful was completely comfortable.",
      location: "Salt Lake, Kolkata"
    },
    {
      id: 3,
      name: "Anita Das",
      treatment: "Cosmetic Dentistry",
      rating: 5,
      text: "My smile transformation exceeded all expectations. The modern facility and professional staff made the experience wonderful.",
      location: "Park Street, Kolkata"
    },
    {
      id: 4,
      name: "Vikram Singh",
      treatment: "Orthodontics",
      rating: 5,
      text: "The orthodontic treatment was perfectly planned and executed. My teeth alignment is now perfect and I couldn't be happier.",
      location: "Howrah, Kolkata"
    },
    {
      id: 5,
      name: "Meera Gupta",
      treatment: "Preventive Care",
      rating: 5,
      text: "Regular checkups here have kept my oral health in perfect condition. The preventive care approach is truly comprehensive.",
      location: "Ballygunge, Kolkata"
    },
    {
      id: 6,
      name: "Amit Banerjee",
      treatment: "Oral Surgery",
      rating: 5,
      text: "The surgical expertise and post-operative care were exceptional. Recovery was smooth and results are excellent.",
      location: "Jadavpur, Kolkata"
    }
  ]);

  const [isHovered, setIsHovered] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState(60); // pixels per second
  const tickerRef = useRef(null);
  const containerRef = useRef(null);
  const animationRef = useRef(null);

  // Function to add new testimonial (for hot-injection)
  const addTestimonial = useCallback((newTestimonial) => {
    const testimonialWithId = {
      ...newTestimonial,
      id: Date.now() + Math.random() // Ensure unique ID
    };
    setTestimonials(prev => [...prev, testimonialWithId]);
  }, []);

  // Expose addTestimonial function globally for form submission
  useEffect(() => {
    window.addTestimonialToTicker = addTestimonial;
    return () => {
      delete window.addTestimonialToTicker;
    };
  }, [addTestimonial]);

  // Auto-scrolling animation
  useEffect(() => {
    const ticker = tickerRef.current;
    const container = containerRef.current;
    
    if (!ticker || !container || isHovered) return;

    let startTime = null;
    let startPosition = 0;

    const animate = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
        startPosition = ticker.scrollLeft;
      }

      const elapsed = timestamp - startTime;
      const distance = (elapsed / 1000) * animationSpeed;
      const newPosition = startPosition + distance;

      // Check if we need to reset to create seamless loop
      const maxScroll = ticker.scrollWidth - ticker.clientWidth;
      
      if (newPosition >= maxScroll) {
        ticker.scrollLeft = 0;
        startTime = timestamp;
        startPosition = 0;
      } else {
        ticker.scrollLeft = newPosition;
      }

      if (!isHovered) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isHovered, animationSpeed, testimonials]);

  // Handle hover events
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  // Render star rating
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`${i < rating ? 'text-yellow-400' : 'text-gray-300'} text-sm`}
      />
    ));
  };

  // Create duplicated testimonials for seamless loop
  const duplicatedTestimonials = [...testimonials, ...testimonials];

  return (
    <Section background="white" padding="default">
      <div ref={feedbackRef} className="text-center mb-12">
        <h2 className={`heading-secondary text-neutral-900 ${isFeedbackInView ? 'animate-in' : 'opacity-0'}`}>
          What Our Patients Say
        </h2>
        <p className={`text-body-large max-w-3xl mx-auto text-neutral-600 ${isFeedbackInView ? 'animate-in animate-in-delay-100' : 'opacity-0'}`}>
          Real experiences from our satisfied patients who trust us with their dental care.
        </p>
      </div>

      {/* Testimonial Ticker */}
      <div 
        className={`feedback-ticker-container w-full ${isFeedbackInView ? 'animate-in animate-in-delay-200' : 'opacity-0'}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="region"
        aria-label="Patient testimonials"
        aria-live="polite"
      >
        {/* Gradient overlays for smooth edges */}
        <div className="gradient-overlay-left"></div>
        <div className="gradient-overlay-right"></div>
        
        <div ref={containerRef} className="relative">
          <div ref={tickerRef} className="feedback-ticker">
            {duplicatedTestimonials.map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="feedback-card w-80 mx-4 first:ml-8 last:mr-8"
                role="article"
                aria-labelledby={`testimonial-${testimonial.id}-${index}`}
              >
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 h-full">
                  {/* Quote Icon */}
                  <div className="flex justify-center mb-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                      <FaQuoteLeft size={16} className="text-primary-600" />
                    </div>
                  </div>

                  {/* Rating Stars */}
                  <div className="star-rating mb-4">
                    {renderStars(testimonial.rating)}
                  </div>

                  {/* Testimonial Text */}
                  <p className="testimonial-text text-neutral-700 text-sm leading-relaxed mb-4 italic text-center">
                    "{testimonial.text}"
                  </p>

                  {/* Patient Info */}
                  <div className="border-t border-neutral-200 pt-4 text-center">
                    <h4 
                      id={`testimonial-${testimonial.id}-${index}`}
                      className="font-bold text-neutral-900 text-base mb-1"
                    >
                      {testimonial.name}
                    </h4>
                    <p className="text-primary-600 font-medium text-sm mb-1">
                      {testimonial.treatment}
                    </p>
                    <p className="text-neutral-500 text-xs">
                      {testimonial.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pause indicator */}
        <div className="pause-indicator">
          Paused
        </div>
      </div>


    </Section>
  );
};

export default PatientFeedbackTicker;

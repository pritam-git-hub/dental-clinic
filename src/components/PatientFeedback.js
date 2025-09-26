import React, { useState, useEffect } from 'react';
import { FaStar, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Card from './ui/Card.js';
import Section from './ui/Section.js';
import useInView from '../hooks/useInView.js';

const PatientFeedback = () => {
  const [feedbackRef, isFeedbackInView] = useInView();
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
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
  ];

  // Auto-slide functionality with LED-like continuous movement
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    }, 2500); // Faster transition like LED lights

    return () => clearInterval(interval);
  }, [testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <Section background="white" padding="default">
      <div ref={feedbackRef} className="text-center mb-16">
        <h2 className={`heading-secondary text-neutral-900 ${isFeedbackInView ? 'animate-in' : 'opacity-0'}`}>
          What Our Patients Say
        </h2>
        <p className={`text-body-large max-w-3xl mx-auto text-neutral-600 ${isFeedbackInView ? 'animate-in animate-in-delay-100' : 'opacity-0'}`}>
          Real experiences from our satisfied patients who trust us with their dental care.
        </p>
      </div>

      {/* Testimonial Slider */}
      <div className={`relative max-w-4xl mx-auto ${isFeedbackInView ? 'animate-in animate-in-delay-200' : 'opacity-0'}`}>
        <div className="relative overflow-hidden rounded-2xl">
          <div 
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {testimonials.map((testimonial, index) => (
              <div key={testimonial.id} className="w-full flex-shrink-0">
                <Card className="mx-4 bg-white/95 backdrop-blur-sm border-0 shadow-2xl">
                  <div className="p-8 text-center">
                    {/* Quote Icon */}
                    <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <FaQuoteLeft size={24} className="text-primary-600" />
                    </div>

                    {/* Rating Stars */}
                    <div className="flex justify-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-400 text-lg mx-1" />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-neutral-700 text-lg leading-relaxed mb-6 italic">
                      "{testimonial.text}"
                    </p>

                    {/* Patient Info */}
                    <div className="border-t border-neutral-200 pt-6">
                      <h4 className="font-bold text-neutral-900 text-lg mb-1">
                        {testimonial.name}
                      </h4>
                      <p className="text-primary-600 font-medium mb-1">
                        {testimonial.treatment}
                      </p>
                      <p className="text-neutral-500 text-sm">
                        {testimonial.location}
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Previous testimonial"
        >
          <FaChevronLeft className="text-primary-600" size={16} />
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 w-12 h-12 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
          aria-label="Next testimonial"
        >
          <FaChevronRight className="text-primary-600" size={16} />
        </button>

        {/* Slide Indicators */}
        <div className="flex justify-center mt-8 space-x-2">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Statistics */}
      <div className={`grid md:grid-cols-3 gap-8 mt-16 ${isFeedbackInView ? 'animate-in animate-in-delay-400' : 'opacity-0'}`}>
        <div className="text-center p-6 bg-primary-50 rounded-xl">
          <div className="text-4xl font-bold mb-2 text-primary-600 animate-pulse-gentle">1000+</div>
          <div className="text-neutral-700 font-medium">Happy Patients</div>
        </div>
        <div className="text-center p-6 bg-secondary-50 rounded-xl">
          <div className="text-4xl font-bold mb-2 text-secondary-600 animate-pulse-gentle" style={{animationDelay: '0.5s'}}>21+</div>
          <div className="text-neutral-700 font-medium">Services Offered</div>
        </div>
        <div className="text-center p-6 bg-green-50 rounded-xl">
          <div className="text-4xl font-bold mb-2 text-green-600 animate-pulse-gentle" style={{animationDelay: '1s'}}>12+</div>
          <div className="text-neutral-700 font-medium">Specialists</div>
        </div>
      </div>
    </Section>
  );
};

export default PatientFeedback;

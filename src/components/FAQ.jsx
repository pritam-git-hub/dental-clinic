import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp, FaQuestionCircle } from 'react-icons/fa';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = useState(0);

  const faqs = [
    {
      id: 0,
      question: "Is treatment painful?",
      answer: "We prioritize patient comfort with our painless dentistry approach. We use advanced anesthesia techniques, sedation options when needed, and modern equipment to ensure your treatment is as comfortable as possible. Most patients report minimal to no discomfort during procedures."
    },
    {
      id: 1,
      question: "How is sterilization ensured?",
      answer: "We follow strict WHO sterilization protocols with state-of-the-art autoclaves and sterilization equipment. All instruments are properly sterilized between patients, and we maintain a hygienic environment with regular sanitization of all surfaces and equipment."
    },
    {
      id: 2,
      question: "Do you handle emergencies?",
      answer: "Yes, we provide emergency dental care for urgent situations like severe tooth pain, dental trauma, or infections. Our team is available to address dental emergencies promptly. Please call us immediately if you have a dental emergency."
    },
    {
      id: 3,
      question: "What about fees and insurance?",
      answer: "We believe in transparent pricing and will provide detailed treatment estimates before any procedure. We accept various payment methods and can discuss payment plans for extensive treatments. Please contact us to discuss insurance coverage and payment options."
    },
    {
      id: 4,
      question: "How to choose the right treatment plan?",
      answer: "Our specialists will conduct a comprehensive examination and discuss all available treatment options with you. We consider your oral health needs, lifestyle, budget, and preferences to create a personalized treatment plan that's right for you."
    },
    {
      id: 5,
      question: "What makes your clinic different?",
      answer: "Our multidisciplinary approach means you can receive comprehensive care under one roof. With 20+ years of experience, modern technology, ethical practices, and a patient-first approach, we ensure you receive the highest quality dental care in a comfortable environment."
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? -1 : index);
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleFAQ(index);
    }
  };

  return (
    <section className="section-padding bg-neutral-50">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="heading-secondary">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Get answers to common questions about our dental services, 
            procedures, and what to expect during your visit.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFAQ === index;
              
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-neutral-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset"
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${faq.id}`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <FaQuestionCircle className="text-primary-600" size={16} />
                      </div>
                      <h3 className="font-semibold text-neutral-900 text-lg">
                        {faq.question}
                      </h3>
                    </div>
                    
                    <div className="flex-shrink-0 ml-4">
                      {isOpen ? (
                        <FaChevronUp className="text-primary-600" size={16} />
                      ) : (
                        <FaChevronDown className="text-neutral-400" size={16} />
                      )}
                    </div>
                  </button>

                  <div
                    id={`faq-answer-${faq.id}`}
                    className={`transition-all duration-300 ease-in-out ${
                      isOpen 
                        ? 'max-h-96 opacity-100' 
                        : 'max-h-0 opacity-0'
                    } overflow-hidden`}
                  >
                    <div className="px-6 pb-5">
                      <div className="pl-12">
                        <p className="text-neutral-600 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Additional Help Section */}
          <div className="mt-12 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-8 text-center">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-neutral-900">
                Still Have Questions?
              </h3>
              <p className="text-neutral-600 max-w-2xl mx-auto">
                Our friendly team is here to help! Don't hesitate to reach out 
                if you need more information about our services or have specific 
                concerns about your dental health.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <a
                  href="tel:+91 9051864455"
                  className="btn-primary flex items-center justify-center space-x-2"
                >
                  <span>Call Us Now</span>
                </a>
                <a
                  href="mailto:dentalavenue14@gmail.com"
                  className="btn-secondary flex items-center justify-center space-x-2"
                >
                  <span>Send Email</span>
                </a>
              </div>
            </div>
          </div>

          {/* Quick Tips */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-green-600 text-xl">💡</span>
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">Before Your Visit</h4>
              <p className="text-sm text-neutral-600">Bring your insurance cards and list of current medications</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-blue-600 text-xl">⏰</span>
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">Appointment Time</h4>
              <p className="text-sm text-neutral-600">Please arrive 15 minutes early for paperwork</p>
            </div>
            
            <div className="bg-white rounded-lg p-6 text-center shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-purple-600 text-xl">🦷</span>
              </div>
              <h4 className="font-semibold text-neutral-900 mb-2">After Care</h4>
              <p className="text-sm text-neutral-600">Follow post-treatment instructions for best results</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

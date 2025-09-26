import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  FaCalendarAlt, 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaTooth,
  FaCheckCircle,
  FaExclamationTriangle 
} from 'react-icons/fa';
import { serviceGroups } from '../data/services';
import { siteConfig } from '../config/site';

// Validation schema
const appointmentSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phone: z.string().regex(/^[+]?[0-9\s-()]{10,15}$/, 'Please enter a valid phone number'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  preferredDate: z.string().min(1, 'Please select a preferred date'),
  preferredTime: z.string().min(1, 'Please select a preferred time'),
  service: z.string().min(1, 'Please select a service'),
  message: z.string().optional(),
  consent: z.boolean().refine(val => val === true, 'You must agree to the terms'),
  honeypot: z.string().max(0, 'Bot detected') // Hidden field for spam protection
});

const AppointmentForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [lastSubmitTime, setLastSubmitTime] = useState(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      honeypot: ''
    }
  });

  // Get all services for dropdown
  const allServices = serviceGroups.flatMap(group => 
    group.items.map(service => ({
      id: service.id,
      name: service.name,
      group: group.title
    }))
  );

  // Time slots
  const timeSlots = [
    '9:00 AM', '9:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '12:30 PM', '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
    '4:00 PM', '4:30 PM'
  ];

  const onSubmit = async (data) => {
    // Rate limiting check
    const now = Date.now();
    if (now - lastSubmitTime < 5000) {
      setSubmitStatus({
        type: 'error',
        message: 'Please wait before submitting another request.'
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simulate API call
      const response = await fetch('/api/appointment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString(),
          source: 'website'
        }),
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Appointment request submitted successfully! We will contact you soon to confirm your appointment.'
        });
        reset();
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      // Fallback to mailto
      const subject = encodeURIComponent('Appointment Request');
      const body = encodeURIComponent(`
Name: ${data.fullName}
Phone: ${data.phone}
Email: ${data.email || 'Not provided'}
Preferred Date: ${data.preferredDate}
Preferred Time: ${data.preferredTime}
Service: ${data.service}
Message: ${data.message || 'None'}
      `);
      
      window.location.href = `mailto:${siteConfig.email}?subject=${subject}&body=${body}`;
      
      setSubmitStatus({
        type: 'error',
        message: 'Unable to submit online. Please call us directly or try again later.'
      });
    } finally {
      setIsSubmitting(false);
      setLastSubmitTime(now);
    }
  };

  return (
    <section className="section-padding bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="heading-secondary">
            Book Your Appointment
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Take the first step towards better oral health. Schedule your consultation 
            with our experienced dental team today.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid lg:grid-cols-2">
              {/* Form */}
              <div className="p-8 lg:p-12">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  {/* Honeypot field - hidden from users */}
                  <input
                    {...register('honeypot')}
                    type="text"
                    style={{ display: 'none' }}
                    tabIndex="-1"
                    autoComplete="off"
                  />

                  {/* Full Name */}
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-neutral-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                      <input
                        {...register('fullName')}
                        type="text"
                        id="fullName"
                        className={`form-control pl-10 ${errors.fullName ? 'is-invalid' : ''}`}
                        placeholder="Enter your full name"
                        aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                      />
                    </div>
                    {errors.fullName && (
                      <div id="fullName-error" className="invalid-feedback" role="alert">
                        {errors.fullName.message}
                      </div>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                      <input
                        {...register('phone')}
                        type="tel"
                        id="phone"
                        className={`form-control pl-10 ${errors.phone ? 'is-invalid' : ''}`}
                        placeholder="+91 9876543210"
                        aria-describedby={errors.phone ? 'phone-error' : undefined}
                      />
                    </div>
                    {errors.phone && (
                      <div id="phone-error" className="invalid-feedback" role="alert">
                        {errors.phone.message}
                      </div>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
                      Email Address (Optional)
                    </label>
                    <div className="relative">
                      <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                      <input
                        {...register('email')}
                        type="email"
                        id="email"
                        className={`form-control pl-10 ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="your.email@example.com"
                        aria-describedby={errors.email ? 'email-error' : undefined}
                      />
                    </div>
                    {errors.email && (
                      <div id="email-error" className="invalid-feedback" role="alert">
                        {errors.email.message}
                      </div>
                    )}
                  </div>

                  {/* Date and Time */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="preferredDate" className="block text-sm font-medium text-neutral-700 mb-2">
                        Preferred Date *
                      </label>
                      <div className="relative">
                        <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                        <input
                          {...register('preferredDate')}
                          type="date"
                          id="preferredDate"
                          min={new Date().toISOString().split('T')[0]}
                          className={`form-control pl-10 ${errors.preferredDate ? 'is-invalid' : ''}`}
                          aria-describedby={errors.preferredDate ? 'preferredDate-error' : undefined}
                        />
                      </div>
                      {errors.preferredDate && (
                        <div id="preferredDate-error" className="invalid-feedback" role="alert">
                          {errors.preferredDate.message}
                        </div>
                      )}
                    </div>

                    <div>
                      <label htmlFor="preferredTime" className="block text-sm font-medium text-neutral-700 mb-2">
                        Preferred Time *
                      </label>
                      <div className="relative">
                        <FaClock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                        <select
                          {...register('preferredTime')}
                          id="preferredTime"
                          className={`form-control pl-10 ${errors.preferredTime ? 'is-invalid' : ''}`}
                          aria-describedby={errors.preferredTime ? 'preferredTime-error' : undefined}
                        >
                          <option value="">Select time</option>
                          {timeSlots.map((time) => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>
                      {errors.preferredTime && (
                        <div id="preferredTime-error" className="invalid-feedback" role="alert">
                          {errors.preferredTime.message}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Service */}
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium text-neutral-700 mb-2">
                      Service Required *
                    </label>
                    <div className="relative">
                      <FaTooth className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                      <select
                        {...register('service')}
                        id="service"
                        className={`form-control pl-10 ${errors.service ? 'is-invalid' : ''}`}
                        aria-describedby={errors.service ? 'service-error' : undefined}
                      >
                        <option value="">Select a service</option>
                        {serviceGroups.map((group) => (
                          <optgroup key={group.id} label={group.title}>
                            {group.items.map((service) => (
                              <option key={service.id} value={service.name}>
                                {service.name}
                              </option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                    </div>
                    {errors.service && (
                      <div id="service-error" className="invalid-feedback" role="alert">
                        {errors.service.message}
                      </div>
                    )}
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                      Additional Message (Optional)
                    </label>
                    <textarea
                      {...register('message')}
                      id="message"
                      rows="4"
                      className="form-control"
                      placeholder="Any specific concerns or questions..."
                    ></textarea>
                  </div>

                  {/* Consent */}
                  <div>
                    <div className="flex items-start space-x-3">
                      <input
                        {...register('consent')}
                        type="checkbox"
                        id="consent"
                        className={`mt-1 ${errors.consent ? 'is-invalid' : ''}`}
                        aria-describedby={errors.consent ? 'consent-error' : undefined}
                      />
                      <label htmlFor="consent" className="text-sm text-neutral-700">
                        I agree to the terms and conditions and consent to being contacted 
                        regarding my appointment request. *
                      </label>
                    </div>
                    {errors.consent && (
                      <div id="consent-error" className="invalid-feedback" role="alert">
                        {errors.consent.message}
                      </div>
                    )}
                  </div>

                  {/* Submit Status */}
                  {submitStatus && (
                    <div
                      className={`p-4 rounded-lg flex items-start space-x-3 ${
                        submitStatus.type === 'success' 
                          ? 'bg-green-50 text-green-800 border border-green-200' 
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                      role="alert"
                      aria-live="polite"
                    >
                      {submitStatus.type === 'success' ? (
                        <FaCheckCircle className="flex-shrink-0 mt-0.5" size={16} />
                      ) : (
                        <FaExclamationTriangle className="flex-shrink-0 mt-0.5" size={16} />
                      )}
                      <span className="text-sm">{submitStatus.message}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full btn-primary flex items-center justify-center space-x-2 ${
                      isSubmitting ? 'opacity-75 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Submitting...</span>
                      </>
                    ) : (
                      <>
                        <FaCalendarAlt size={18} />
                        <span>Book Appointment</span>
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Info Panel */}
              <div className="bg-gradient-to-br from-primary-600 to-secondary-600 p-8 lg:p-12 text-white">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-4">What to Expect</h3>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm font-bold">1</span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Confirmation Call</h4>
                          <p className="text-primary-100 text-sm">We'll call within 24 hours to confirm your appointment</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm font-bold">2</span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Consultation</h4>
                          <p className="text-primary-100 text-sm">Comprehensive examination and treatment planning</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-sm font-bold">3</span>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-1">Treatment</h4>
                          <p className="text-primary-100 text-sm">Personalized care with modern techniques</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-white border-opacity-20 pt-8">
                    <h4 className="font-bold mb-4">Quick Contact</h4>
                    <div className="space-y-3">
                      <a
                        href={`tel:${siteConfig.phones[0]}`}
                        className="flex items-center space-x-3 text-white hover:text-primary-100 transition-colors"
                      >
                        <FaPhone size={16} />
                        <span>{siteConfig.phones[0]}</span>
                      </a>
                      <a
                        href={`mailto:${siteConfig.email}`}
                        className="flex items-center space-x-3 text-white hover:text-primary-100 transition-colors"
                      >
                        <FaEnvelope size={16} />
                        <span>{siteConfig.email}</span>
                      </a>
                    </div>
                  </div>

                  <div className="bg-white bg-opacity-10 rounded-lg p-4">
                    <p className="text-sm text-primary-100">
                      <strong>Emergency?</strong> For urgent dental care, please call us directly 
                      at {siteConfig.phones[0]} for immediate assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppointmentForm;

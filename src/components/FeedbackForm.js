import React, { useState } from 'react';
import { 
  FaStar, 
  FaUser, 
  FaEnvelope, 
  FaComment, 
  FaPaperPlane,
  FaCheckCircle,
  FaCamera,
  FaSpinner
} from 'react-icons/fa';
import Section from './ui/Section.js';

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    rating: 0,
    service: '',
    feedback: '',
    recommend: '',
    photo: null,
    consent: false
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [errors, setErrors] = useState({});
  const [characterCount, setCharacterCount] = useState(0);
  const [photoPreview, setPhotoPreview] = useState(null);

  const services = [
    'General Dentistry',
    'Dental Implants',
    'Orthodontics',
    'Cosmetic Dentistry',
    'Root Canal Treatment',
    'Teeth Whitening',
    'Periodontal Treatment',
    'Oral Surgery',
    'Other'
  ];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (!formData.feedback.trim()) {
      newErrors.feedback = 'Feedback is required';
    } else if (formData.feedback.length < 10) {
      newErrors.feedback = 'Please provide at least 10 characters';
    }
    
    if (!formData.recommend) {
      newErrors.recommend = 'Please select if you would recommend us';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    
    // Update character count for feedback
    if (name === 'feedback') {
      setCharacterCount(value.length);
    }
  };

  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
    
    // Clear rating error
    if (errors.rating) {
      setErrors(prev => ({
        ...prev,
        rating: ''
      }));
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setErrors(prev => ({
          ...prev,
          photo: 'Photo size must be less than 5MB'
        }));
        return;
      }
      
      setFormData(prev => ({
        ...prev,
        photo: file
      }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target.result);
      };
      reader.readAsDataURL(file);
      
      // Clear photo error
      if (errors.photo) {
        setErrors(prev => ({
          ...prev,
          photo: ''
        }));
      }
    }
  };

  const getRatingText = (rating) => {
    const texts = {
      1: 'Poor',
      2: 'Fair', 
      3: 'Good',
      4: 'Very Good',
      5: 'Excellent'
    };
    return texts[rating] || '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      // Create new testimonial object
      const newTestimonial = {
        name: formData.name,
        treatment: formData.service || 'General Care',
        rating: formData.rating,
        text: formData.feedback,
        location: 'New Patient' // Could be enhanced to capture actual location
      };

      // Hot-inject into ticker if available
      if (window.addTestimonialToTicker) {
        window.addTestimonialToTicker(newTestimonial);
      }

      setIsSubmitted(true);
      setIsSubmitting(false);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({
          name: '',
          email: '',
          rating: 0,
          service: '',
          feedback: '',
          recommend: '',
          photo: null,
          consent: false
        });
        setCharacterCount(0);
        setPhotoPreview(null);
        setErrors({});
      }, 3000);
    }, 1000);
  };

  if (isSubmitted) {
    return (
      <Section background="gradient" padding="default">
        <div className="max-w-2xl mx-auto text-center">
          <div className="bg-white rounded-2xl p-12 shadow-2xl">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="text-green-600" size={32} />
            </div>
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">Thank You!</h2>
            <p className="text-lg text-neutral-600 mb-6">
              Your feedback has been submitted successfully. We appreciate your time and will use your feedback to improve our services.
            </p>
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`text-2xl ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </Section>
    );
  }

  return (
    <Section background="gradient" padding="default">
      <div className="max-w-4xl mx-auto">
        {/* Light panel overlay for better contrast */}
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 mb-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Share Your Experience
            </h2>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Help us improve our services by sharing your feedback. Your experience matters to us.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-2xl border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  <FaUser className="inline mr-2" />
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all ${
                    errors.name 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-300 focus:border-primary-500'
                  }`}
                  placeholder="Enter your full name"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">!</span>
                    {errors.name}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-neutral-700 mb-2">
                  <FaEnvelope className="inline mr-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all ${
                    errors.email 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-300 focus:border-primary-500'
                  }`}
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">!</span>
                    {errors.email}
                  </p>
                )}
              </div>
            </div>

            {/* Interactive Rating */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                Overall Rating *
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className={`text-2xl transition-all duration-200 hover:scale-110 transform focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded ${
                        star <= (hoveredRating || formData.rating) 
                          ? 'text-yellow-400' 
                          : 'text-gray-300 hover:text-yellow-300'
                      }`}
                      title={getRatingText(star)}
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''} - ${getRatingText(star)}`}
                    >
                      <FaStar />
                    </button>
                  ))}
                </div>
                {(formData.rating > 0 || hoveredRating > 0) && (
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-yellow-600">
                      {hoveredRating || formData.rating}
                    </span>
                    <span className="text-sm font-medium text-neutral-600">
                      {getRatingText(hoveredRating || formData.rating)}
                    </span>
                  </div>
                )}
              </div>
              {errors.rating && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">!</span>
                  {errors.rating}
                </p>
              )}
            </div>

            {/* Service */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Service Received
              </label>
              <select
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
              >
                <option value="">Select a service</option>
                {services.map((service) => (
                  <option key={service} value={service}>
                    {service}
                  </option>
                ))}
              </select>
            </div>

            {/* Enhanced Feedback */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                <FaComment className="inline mr-2" />
                Your Feedback *
              </label>
              <div className="relative">
                <textarea
                  name="feedback"
                  value={formData.feedback}
                  onChange={handleInputChange}
                  required
                  rows={5}
                  maxLength={500}
                  className={`w-full px-4 py-3 border-2 rounded-lg focus:ring-2 focus:ring-primary-500 transition-all resize-none ${
                    errors.feedback 
                      ? 'border-red-300 focus:border-red-500' 
                      : 'border-gray-300 focus:border-primary-500'
                  }`}
                  placeholder="Share your experience... (e.g., 'The staff was very professional and the treatment was painless. I felt comfortable throughout the procedure.')"
                />
                <div className="flex justify-between items-center mt-2">
                  <div className="text-xs text-neutral-500">
                    Minimum 10 characters required
                  </div>
                  <div className={`text-xs ${characterCount > 450 ? 'text-red-500' : 'text-neutral-500'}`}>
                    {characterCount}/500 characters
                  </div>
                </div>
              </div>
              {errors.feedback && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">!</span>
                  {errors.feedback}
                </p>
              )}
            </div>

            {/* Recommendation */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-3">
                Would you recommend us to others? *
              </label>
              <div className="flex flex-wrap gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recommend"
                    value="yes"
                    checked={formData.recommend === 'yes'}
                    onChange={handleInputChange}
                    className="mr-2 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-neutral-700">Yes, definitely</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recommend"
                    value="maybe"
                    checked={formData.recommend === 'maybe'}
                    onChange={handleInputChange}
                    className="mr-2 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-neutral-700">Maybe</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="recommend"
                    value="no"
                    checked={formData.recommend === 'no'}
                    onChange={handleInputChange}
                    className="mr-2 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-neutral-700">No</span>
                </label>
              </div>
              {errors.recommend && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">!</span>
                  {errors.recommend}
                </p>
              )}
            </div>

            {/* Photo Upload */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                <FaCamera className="inline mr-2" />
                Add Photo (Optional)
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-400 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  id="photo-upload"
                />
                <label htmlFor="photo-upload" className="cursor-pointer">
                  {photoPreview ? (
                    <div className="space-y-3">
                      <img 
                        src={photoPreview} 
                        alt="Preview" 
                        className="mx-auto h-32 w-32 object-cover rounded-lg"
                      />
                      <p className="text-sm text-green-600">Photo uploaded successfully</p>
                      <p className="text-xs text-neutral-500">Click to change</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <FaCamera className="mx-auto text-gray-400" size={32} />
                      <div>
                        <p className="text-sm font-medium text-neutral-700">Upload a photo</p>
                        <p className="text-xs text-neutral-500">PNG, JPG up to 5MB</p>
                      </div>
                    </div>
                  )}
                </label>
              </div>
              {errors.photo && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <span className="w-4 h-4 bg-red-100 rounded-full flex items-center justify-center mr-2">!</span>
                  {errors.photo}
                </p>
              )}
            </div>

            {/* Consent Checkbox */}
            <div>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  name="consent"
                  checked={formData.consent}
                  onChange={handleInputChange}
                  className="mt-1 text-primary-600 focus:ring-primary-500 rounded"
                />
                <span className="text-sm text-neutral-700 leading-relaxed">
                  I consent to the use of my feedback and photo (if provided) for marketing purposes. 
                  My personal information will be kept confidential and used only for improving services.
                </span>
              </label>
            </div>

            {/* Enhanced Submit Button */}
            <div className="text-center pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  px-10 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center space-x-3 mx-auto min-w-[200px] justify-center
                  ${isSubmitting
                    ? 'bg-primary-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 hover:shadow-xl transform hover:-translate-y-1 active:scale-95'
                  }
                  text-white shadow-lg
                `}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" size={18} />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <FaPaperPlane size={18} />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
              
              {/* Form validation summary */}
              <div className="mt-4 text-sm text-neutral-600">
                <p>All fields marked with * are required</p>
                {Object.keys(errors).length > 0 && (
                  <p className="text-red-600 mt-2">
                    Please fix the errors above before submitting
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </Section>
  );
};

export default FeedbackForm;

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaSave,
  FaTimes,
  FaUpload,
  FaUser,
  FaStethoscope,
  FaGraduationCap,
  FaPhone,
  FaEnvelope,
  FaTags,
  FaImage,
  FaTrash,
  FaEye
} from 'react-icons/fa';
import dataService from '../../services/DataService.js';

const DoctorForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    roleTitle: '',
    credentials: '',
    bio: '',
    phone: '',
    email: '',
    avatarUrl: null,
    active: true,
    displayOrder: 1,
    tags: []
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [tagInput, setTagInput] = useState('');

  const availableTags = [
    'featured', 'prosthodontics', 'orthodontics', 'endodontics', 
    'periodontics', 'surgery', 'pediatric', 'general', 'laser', 
    'implants', 'cosmetic'
  ];

  useEffect(() => {
    if (isEditing) {
      loadDoctor();
    } else {
      // Set next display order for new doctor
      const doctors = dataService.getDoctors();
      const maxOrder = Math.max(...doctors.map(d => d.displayOrder), 0);
      setFormData(prev => ({ ...prev, displayOrder: maxOrder + 1 }));
    }
  }, [id, isEditing]);

  const loadDoctor = async () => {
    setLoading(true);
    try {
      const doctor = dataService.getDoctor(id);
      if (doctor) {
        setFormData(doctor);
        setImagePreview(doctor.avatarUrl);
      } else {
        navigate('/admin/doctors');
      }
    } catch (error) {
      console.error('Failed to load doctor:', error);
      navigate('/admin/doctors');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrors(prev => ({ ...prev, avatar: 'Please select a valid image file' }));
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrors(prev => ({ ...prev, avatar: 'Image size must be less than 5MB' }));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target.result;
      setImagePreview(imageUrl);
      setFormData(prev => ({ ...prev, avatarUrl: imageUrl }));
      setErrors(prev => ({ ...prev, avatar: '' }));
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setFormData(prev => ({ ...prev, avatarUrl: null }));
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAddTag = (tag) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleCustomTagAdd = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !formData.tags.includes(tag)) {
      handleAddTag(tag);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.roleTitle.trim()) {
      newErrors.roleTitle = 'Role/Title is required';
    }

    if (!formData.credentials.trim()) {
      newErrors.credentials = 'Credentials are required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.phone && !/^[+]?[0-9\s-()]{10,15}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      if (isEditing) {
        await dataService.updateDoctor(id, formData);
      } else {
        await dataService.createDoctor(formData);
      }
      
      navigate('/admin/doctors');
    } catch (error) {
      console.error('Failed to save doctor:', error);
      setErrors({ submit: 'Failed to save doctor. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Doctor' : 'Add New Doctor'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update doctor information' : 'Add a new doctor to your team'}
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/doctors')}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <FaTimes className="mr-2" size={16} />
          Cancel
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaUser className="mr-2 text-primary-600" />
                Basic Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Dr. John Smith"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="displayOrder" className="block text-sm font-medium text-gray-700 mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    id="displayOrder"
                    name="displayOrder"
                    value={formData.displayOrder}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="roleTitle" className="block text-sm font-medium text-gray-700 mb-2">
                    Role/Title *
                  </label>
                  <input
                    type="text"
                    id="roleTitle"
                    name="roleTitle"
                    value={formData.roleTitle}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.roleTitle ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Consultant Prosthodontist"
                  />
                  {errors.roleTitle && <p className="mt-1 text-sm text-red-600">{errors.roleTitle}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="credentials" className="block text-sm font-medium text-gray-700 mb-2">
                    Credentials *
                  </label>
                  <input
                    type="text"
                    id="credentials"
                    name="credentials"
                    value={formData.credentials}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.credentials ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="BDS, MDS (Cal), PGDHHM"
                  />
                  {errors.credentials && <p className="mt-1 text-sm text-red-600">{errors.credentials}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                    Biography
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Brief professional biography..."
                  />
                </div>
              </div>
            </div>

            {/* Contact Info Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaPhone className="mr-2 text-primary-600" />
                Contact Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="+91 9876543210"
                  />
                  {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.email ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="doctor@dentalavenue.com"
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>
              </div>
            </div>

            {/* Tags Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaTags className="mr-2 text-primary-600" />
                Specialties & Tags
              </h3>
              
              {/* Current Tags */}
              {formData.tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="ml-2 text-primary-600 hover:text-primary-800"
                        >
                          <FaTimes size={12} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Available Tags */}
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Available specialties:</p>
                <div className="flex flex-wrap gap-2">
                  {availableTags
                    .filter(tag => !formData.tags.includes(tag))
                    .map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddTag(tag)}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        {tag}
                      </button>
                    ))}
                </div>
              </div>

              {/* Custom Tag Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleCustomTagAdd())}
                  placeholder="Add custom tag..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  type="button"
                  onClick={handleCustomTagAdd}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaImage className="mr-2 text-primary-600" />
                Profile Photo
              </h3>
              
              <div className="text-center">
                {imagePreview ? (
                  <div className="relative inline-block">
                    <img
                      src={imagePreview}
                      alt="Doctor avatar"
                      className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="w-32 h-32 mx-auto bg-gray-200 rounded-full flex items-center justify-center">
                    <FaUser className="text-gray-400" size={48} />
                  </div>
                )}
                
                <div className="mt-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <FaUpload className="mr-2" size={16} />
                    Upload Photo
                  </button>
                </div>
                
                {errors.avatar && (
                  <p className="mt-2 text-sm text-red-600">{errors.avatar}</p>
                )}
                
                <p className="mt-2 text-xs text-gray-500">
                  Recommended: Square image, max 5MB
                </p>
              </div>
            </div>

            {/* Status Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="active"
                  name="active"
                  checked={formData.active}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="active" className="ml-2 block text-sm text-gray-900">
                  Active (visible on website)
                </label>
              </div>
              
              <p className="mt-2 text-xs text-gray-500">
                Inactive doctors won't appear on the public website
              </p>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
          {errors.submit && (
            <p className="text-sm text-red-600 mr-auto">{errors.submit}</p>
          )}
          
          <button
            type="button"
            onClick={() => navigate('/admin/doctors')}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <FaSave className="mr-2" size={16} />
                {isEditing ? 'Update Doctor' : 'Add Doctor'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DoctorForm;

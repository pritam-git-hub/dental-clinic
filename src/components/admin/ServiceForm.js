import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FaSave,
  FaTimes,
  FaTooth,
  FaList,
  FaAlignLeft,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa';
import dataService from '../../services/DataService.js';

const ServiceForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    descriptionShort: '',
    descriptionFull: '',
    active: true,
    displayOrder: 1
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    'General & Preventive',
    'Restorative & Prosthodontics',
    'Cosmetic & Smile Design',
    'Specialty Care',
    'Surgery & Advanced'
  ];

  useEffect(() => {
    if (isEditing) {
      loadService();
    } else {
      // Set next display order for new service
      const services = dataService.getServices();
      const maxOrder = Math.max(...services.map(s => s.displayOrder), 0);
      setFormData(prev => ({ ...prev, displayOrder: maxOrder + 1 }));
    }
  }, [id, isEditing]);

  const loadService = async () => {
    setLoading(true);
    try {
      const service = dataService.getService(id);
      if (service) {
        setFormData(service);
      } else {
        navigate('/admin/services');
      }
    } catch (error) {
      console.error('Failed to load service:', error);
      navigate('/admin/services');
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Service name is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.descriptionShort.trim()) {
      newErrors.descriptionShort = 'Short description is required';
    }

    if (formData.descriptionShort.length > 200) {
      newErrors.descriptionShort = 'Short description must be less than 200 characters';
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
        await dataService.updateService(id, formData);
      } else {
        await dataService.createService(formData);
      }
      
      navigate('/admin/services');
    } catch (error) {
      console.error('Failed to save service:', error);
      setErrors({ submit: 'Failed to save service. Please try again.' });
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
            {isEditing ? 'Edit Service' : 'Add New Service'}
          </h1>
          <p className="text-gray-600">
            {isEditing ? 'Update service information' : 'Add a new service to your offerings'}
          </p>
        </div>
        <button
          onClick={() => navigate('/admin/services')}
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
                <FaTooth className="mr-2 text-primary-600" />
                Service Information
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Service Name *
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
                    placeholder="e.g., General Dentistry"
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.category ? 'border-red-300' : 'border-gray-300'
                    }`}
                  >
                    <option value="">Select a category</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
                </div>

                <div>
                  <label htmlFor="descriptionShort" className="block text-sm font-medium text-gray-700 mb-2">
                    Short Description * 
                    <span className="text-gray-500 text-xs ml-1">
                      ({formData.descriptionShort.length}/200 characters)
                    </span>
                  </label>
                  <textarea
                    id="descriptionShort"
                    name="descriptionShort"
                    value={formData.descriptionShort}
                    onChange={handleInputChange}
                    rows={2}
                    maxLength={200}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                      errors.descriptionShort ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Brief description for service cards..."
                  />
                  {errors.descriptionShort && <p className="mt-1 text-sm text-red-600">{errors.descriptionShort}</p>}
                  <p className="mt-1 text-xs text-gray-500">
                    This will appear on service cards and in listings.
                  </p>
                </div>

                <div>
                  <label htmlFor="descriptionFull" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Description
                  </label>
                  <textarea
                    id="descriptionFull"
                    name="descriptionFull"
                    value={formData.descriptionFull}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Detailed description of the service, benefits, procedures..."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Optional detailed description for service pages and detailed views.
                  </p>
                </div>
              </div>
            </div>

            {/* Preview Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview</h3>
              
              <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center">
                    <FaTooth size={16} className="text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {formData.name || 'Service Name'}
                    </h4>
                    <p className="text-primary-600 text-sm font-medium">
                      {formData.category || 'Category'}
                    </p>
                  </div>
                </div>
                <p className="text-gray-600 text-sm">
                  {formData.descriptionShort || 'Short description will appear here...'}
                </p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-xs text-green-600 font-semibold">Available Now</span>
                  </div>
                  <span className="text-xs text-primary-600 font-medium">Book Now</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Settings Card */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FaList className="mr-2 text-primary-600" />
                Settings
              </h3>
              
              <div className="space-y-4">
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
                  <p className="mt-1 text-xs text-gray-500">
                    Lower numbers appear first in listings.
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label htmlFor="active" className="block text-sm font-medium text-gray-900">
                      Status
                    </label>
                    <p className="text-xs text-gray-500">
                      {formData.active ? 'Visible on website' : 'Hidden from website'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, active: !prev.active }))}
                    className={`flex items-center ${
                      formData.active ? 'text-green-600' : 'text-gray-400'
                    }`}
                  >
                    {formData.active ? <FaToggleOn size={24} /> : <FaToggleOff size={24} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Category Info */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Category Guide</h3>
              
              <div className="space-y-3 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900">General & Preventive</h4>
                  <p className="text-gray-600">Routine care, cleanings, checkups</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Restorative & Prosthodontics</h4>
                  <p className="text-gray-600">Fillings, crowns, bridges, dentures</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Cosmetic & Smile Design</h4>
                  <p className="text-gray-600">Whitening, veneers, aesthetic treatments</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Specialty Care</h4>
                  <p className="text-gray-600">Orthodontics, pediatric, geriatric</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Surgery & Advanced</h4>
                  <p className="text-gray-600">Oral surgery, implants, complex procedures</p>
                </div>
              </div>
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
            onClick={() => navigate('/admin/services')}
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
                {isEditing ? 'Update Service' : 'Add Service'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ServiceForm;

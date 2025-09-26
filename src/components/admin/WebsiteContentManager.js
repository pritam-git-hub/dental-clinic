import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  FaEdit, 
  FaSave, 
  FaTimes, 
  FaPlus, 
  FaTrash,
  FaImage,
  FaGlobe,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaMapMarkerAlt
} from 'react-icons/fa';

const WebsiteContentManager = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [editingSection, setEditingSection] = useState(null);
  const [websiteData, setWebsiteData] = useState({});
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, setValue } = useForm();

  useEffect(() => {
    loadWebsiteData();
  }, []);

  const loadWebsiteData = () => {
    // Load current website data from localStorage or use defaults
    const savedData = localStorage.getItem('websiteContent');
    const defaultData = {
      hero: {
        title: "DR. GANDHI'S",
        subtitle: "DENTAL AVENUE",
        description: "One stop solution for all your dental needs",
        tagline: "From preventive care to implants and smile design, receive comprehensive, painless treatment from a multidisciplinary team."
      },
      contact: {
        phones: ["+91 9051864455", "+91 9830032088"],
        email: "dentalavenue14@gmail.com",
        address: "New Town, Kolkata",
        hours: "9 AM - 5 PM"
      },
      stats: {
        patients: "10000+",
        experience: "20+",
        specialists: "14+",
        services: "21+"
      },
      services: [],
      doctors: [],
      testimonials: []
    };

    setWebsiteData(savedData ? { ...defaultData, ...JSON.parse(savedData) } : defaultData);
  };

  const saveWebsiteData = (data) => {
    localStorage.setItem('websiteContent', JSON.stringify(data));
    setWebsiteData(data);
  };

  const handleSectionEdit = (section, data) => {
    setLoading(true);
    const updatedData = { ...websiteData, [section]: data };
    saveWebsiteData(updatedData);
    setEditingSection(null);
    setLoading(false);
    alert('Content updated successfully!');
  };

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: FaGlobe },
    { id: 'contact', label: 'Contact Info', icon: FaPhone },
    { id: 'stats', label: 'Statistics', icon: FaEdit },
    { id: 'services', label: 'Services', icon: FaPlus },
    { id: 'doctors', label: 'Doctors', icon: FaEdit },
    { id: 'testimonials', label: 'Testimonials', icon: FaEdit }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Website Content Manager</h1>
          <p className="text-neutral-600">Edit all website content from one place</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200">
        <div className="border-b border-neutral-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-neutral-500 hover:text-neutral-700'
                  }`}
                >
                  <IconComponent size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Hero Section Tab */}
          {activeTab === 'hero' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900">Hero Section Content</h3>
                <button
                  onClick={() => setEditingSection('hero')}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <FaEdit size={16} />
                  <span>Edit Hero</span>
                </button>
              </div>

              {editingSection === 'hero' ? (
                <form
                  onSubmit={handleSubmit((data) => handleSectionEdit('hero', data))}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Main Title</label>
                    <input
                      {...register('title')}
                      defaultValue={websiteData.hero?.title}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Subtitle</label>
                    <input
                      {...register('subtitle')}
                      defaultValue={websiteData.hero?.subtitle}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Description</label>
                    <input
                      {...register('description')}
                      defaultValue={websiteData.hero?.description}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Tagline</label>
                    <textarea
                      {...register('tagline')}
                      defaultValue={websiteData.hero?.tagline}
                      rows={3}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                      <FaSave size={16} />
                      <span>Save Changes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSection(null)}
                      className="bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-300"
                    >
                      <FaTimes size={16} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-neutral-600">Title:</span>
                      <p className="text-neutral-900">{websiteData.hero?.title}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-neutral-600">Subtitle:</span>
                      <p className="text-neutral-900">{websiteData.hero?.subtitle}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-neutral-600">Description:</span>
                      <p className="text-neutral-900">{websiteData.hero?.description}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-neutral-600">Tagline:</span>
                      <p className="text-neutral-900">{websiteData.hero?.tagline}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Contact Info Tab */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900">Contact Information</h3>
                <button
                  onClick={() => setEditingSection('contact')}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <FaEdit size={16} />
                  <span>Edit Contact</span>
                </button>
              </div>

              {editingSection === 'contact' ? (
                <form
                  onSubmit={handleSubmit((data) => handleSectionEdit('contact', {
                    phones: [data.phone1, data.phone2].filter(Boolean),
                    email: data.email,
                    address: data.address,
                    hours: data.hours
                  }))}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Phone 1</label>
                      <input
                        {...register('phone1')}
                        defaultValue={websiteData.contact?.phones?.[0]}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Phone 2</label>
                      <input
                        {...register('phone2')}
                        defaultValue={websiteData.contact?.phones?.[1]}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Email</label>
                    <input
                      {...register('email')}
                      type="email"
                      defaultValue={websiteData.contact?.email}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Address</label>
                    <input
                      {...register('address')}
                      defaultValue={websiteData.contact?.address}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-2">Hours</label>
                    <input
                      {...register('hours')}
                      defaultValue={websiteData.contact?.hours}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                      <FaSave size={16} />
                      <span>Save Changes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSection(null)}
                      className="bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-300"
                    >
                      <FaTimes size={16} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <FaPhone className="text-primary-600" />
                      <h4 className="font-medium text-neutral-900">Phone Numbers</h4>
                    </div>
                    {websiteData.contact?.phones?.map((phone, index) => (
                      <p key={index} className="text-neutral-700">{phone}</p>
                    ))}
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <FaEnvelope className="text-primary-600" />
                      <h4 className="font-medium text-neutral-900">Email</h4>
                    </div>
                    <p className="text-neutral-700">{websiteData.contact?.email}</p>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <FaMapMarkerAlt className="text-primary-600" />
                      <h4 className="font-medium text-neutral-900">Address</h4>
                    </div>
                    <p className="text-neutral-700">{websiteData.contact?.address}</p>
                  </div>
                  <div className="bg-neutral-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2 mb-3">
                      <FaClock className="text-primary-600" />
                      <h4 className="font-medium text-neutral-900">Hours</h4>
                    </div>
                    <p className="text-neutral-700">{websiteData.contact?.hours}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Statistics Tab */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900">Website Statistics</h3>
                <button
                  onClick={() => setEditingSection('stats')}
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                >
                  <FaEdit size={16} />
                  <span>Edit Stats</span>
                </button>
              </div>

              {editingSection === 'stats' ? (
                <form
                  onSubmit={handleSubmit((data) => handleSectionEdit('stats', data))}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Happy Patients</label>
                      <input
                        {...register('patients')}
                        defaultValue={websiteData.stats?.patients}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Years Experience</label>
                      <input
                        {...register('experience')}
                        defaultValue={websiteData.stats?.experience}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Expert Specialists</label>
                      <input
                        {...register('specialists')}
                        defaultValue={websiteData.stats?.specialists}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-700 mb-2">Services Offered</label>
                      <input
                        {...register('services')}
                        defaultValue={websiteData.stats?.services}
                        className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center space-x-2"
                    >
                      <FaSave size={16} />
                      <span>Save Changes</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSection(null)}
                      className="bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-300"
                    >
                      <FaTimes size={16} />
                      <span>Cancel</span>
                    </button>
                  </div>
                </form>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-primary-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-primary-600">{websiteData.stats?.patients}</div>
                    <div className="text-sm text-neutral-600">Happy Patients</div>
                  </div>
                  <div className="bg-secondary-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-secondary-600">{websiteData.stats?.experience}</div>
                    <div className="text-sm text-neutral-600">Years Experience</div>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-green-600">{websiteData.stats?.specialists}</div>
                    <div className="text-sm text-neutral-600">Expert Specialists</div>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg text-center">
                    <div className="text-2xl font-bold text-orange-600">{websiteData.stats?.services}</div>
                    <div className="text-sm text-neutral-600">Services Offered</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Other tabs can be implemented similarly */}
          {activeTab === 'services' && (
            <div className="text-center py-8">
              <FaPlus className="mx-auto text-neutral-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Services Management</h3>
              <p className="text-neutral-600">Use the Services section in the main menu to manage services.</p>
            </div>
          )}

          {activeTab === 'doctors' && (
            <div className="text-center py-8">
              <FaEdit className="mx-auto text-neutral-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Doctors Management</h3>
              <p className="text-neutral-600">Use the Doctors section in the main menu to manage doctor profiles.</p>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="text-center py-8">
              <FaEdit className="mx-auto text-neutral-400 mb-4" size={48} />
              <h3 className="text-lg font-medium text-neutral-900 mb-2">Testimonials Management</h3>
              <p className="text-neutral-600">Testimonials are managed through the patient feedback system.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebsiteContentManager;

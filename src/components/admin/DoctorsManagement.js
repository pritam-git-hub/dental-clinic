import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaSort,
  FaEye,
  FaEyeSlash,
  FaUserMd,
  FaImage,
  FaTags,
  FaPhone,
  FaEnvelope,
  FaToggleOn,
  FaToggleOff
} from 'react-icons/fa';
import dataService from '../../services/DataService.js';

const DoctorsManagement = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTag, setFilterTag] = useState('all');
  const [sortBy, setSortBy] = useState('displayOrder');
  const [showInactive, setShowInactive] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    loadDoctors();
  }, []);

  useEffect(() => {
    filterAndSortDoctors();
  }, [doctors, searchTerm, filterTag, sortBy, showInactive]);

  const loadDoctors = async () => {
    try {
      const doctorsData = dataService.getDoctors();
      setDoctors(doctorsData);
    } catch (error) {
      console.error('Failed to load doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortDoctors = () => {
    let filtered = [...doctors];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(doctor =>
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.credentials.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by tag
    if (filterTag !== 'all') {
      filtered = filtered.filter(doctor =>
        doctor.tags && doctor.tags.includes(filterTag)
      );
    }

    // Filter by active status
    if (!showInactive) {
      filtered = filtered.filter(doctor => doctor.active);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'roleTitle':
          return a.roleTitle.localeCompare(b.roleTitle);
        case 'displayOrder':
        default:
          return a.displayOrder - b.displayOrder;
      }
    });

    setFilteredDoctors(filtered);
  };

  const handleToggleActive = async (doctorId, currentStatus) => {
    try {
      await dataService.updateDoctor(doctorId, { active: !currentStatus });
      loadDoctors();
    } catch (error) {
      console.error('Failed to update doctor status:', error);
    }
  };

  const handleDeleteDoctor = async () => {
    if (!selectedDoctor) return;

    try {
      await dataService.deleteDoctor(selectedDoctor.id);
      setShowDeleteModal(false);
      setSelectedDoctor(null);
      loadDoctors();
    } catch (error) {
      console.error('Failed to delete doctor:', error);
    }
  };

  const getAllTags = () => {
    const tags = new Set();
    doctors.forEach(doctor => {
      if (doctor.tags) {
        doctor.tags.forEach(tag => tags.add(tag));
      }
    });
    return Array.from(tags);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctors Management</h1>
          <p className="text-gray-600">Manage your medical team</p>
        </div>
        <button
          onClick={() => navigate('/admin/doctors/new')}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FaPlus className="mr-2" size={16} />
          Add Doctor
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Filter by Tag */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Specialties</option>
              {getAllTags().map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="relative">
            <FaSort className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="displayOrder">Display Order</option>
              <option value="name">Name</option>
              <option value="roleTitle">Role</option>
            </select>
          </div>

          {/* Show Inactive Toggle */}
          <div className="flex items-center">
            <button
              onClick={() => setShowInactive(!showInactive)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
            >
              {showInactive ? <FaEye size={16} /> : <FaEyeSlash size={16} />}
              <span>{showInactive ? 'Hide' : 'Show'} Inactive</span>
            </button>
          </div>
        </div>
      </div>

      {/* Doctors List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredDoctors.length === 0 ? (
          <div className="p-12 text-center">
            <FaUserMd className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterTag !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first doctor'
              }
            </p>
            {!searchTerm && filterTag === 'all' && (
              <button
                onClick={() => navigate('/admin/doctors/new')}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FaPlus className="mr-2" size={16} />
                Add First Doctor
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredDoctors.map((doctor) => (
              <div key={doctor.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                      {doctor.avatarUrl ? (
                        <img
                          src={doctor.avatarUrl}
                          alt={doctor.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <FaUserMd className="text-gray-400" size={24} />
                      )}
                    </div>

                    {/* Doctor Info */}
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">{doctor.name}</h3>
                        <button
                          onClick={() => handleToggleActive(doctor.id, doctor.active)}
                          className={`flex items-center ${
                            doctor.active ? 'text-green-600' : 'text-gray-400'
                          }`}
                          title={doctor.active ? 'Active' : 'Inactive'}
                        >
                          {doctor.active ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                        </button>
                      </div>
                      
                      <p className="text-primary-600 font-medium">{doctor.roleTitle}</p>
                      <p className="text-sm text-gray-600">{doctor.credentials}</p>
                      
                      {/* Contact Info */}
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        {doctor.phone && (
                          <div className="flex items-center space-x-1">
                            <FaPhone size={12} />
                            <span>{doctor.phone}</span>
                          </div>
                        )}
                        {doctor.email && (
                          <div className="flex items-center space-x-1">
                            <FaEnvelope size={12} />
                            <span>{doctor.email}</span>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {doctor.tags && doctor.tags.length > 0 && (
                        <div className="flex items-center space-x-2 mt-2">
                          <FaTags className="text-gray-400" size={12} />
                          <div className="flex flex-wrap gap-1">
                            {doctor.tags.map((tag, index) => (
                              <span
                                key={index}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">#{doctor.displayOrder}</span>
                    <button
                      onClick={() => navigate(`/admin/doctors/${doctor.id}/edit`)}
                      className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                      title="Edit Doctor"
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedDoctor(doctor);
                        setShowDeleteModal(true);
                      }}
                      className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Doctor"
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Doctor</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedDoctor.name}</strong>? 
              This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedDoctor(null);
                }}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDoctor}
                className="flex-1 py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorsManagement;

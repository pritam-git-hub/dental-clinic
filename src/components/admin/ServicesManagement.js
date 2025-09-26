import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaSort,
  FaTooth,
  FaToggleOn,
  FaToggleOff,
  FaGripVertical,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import dataService from '../../services/DataService.js';

const ServicesManagement = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showInactive, setShowInactive] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const navigate = useNavigate();

  const categories = [
    'General & Preventive',
    'Restorative & Prosthodontics',
    'Cosmetic & Smile Design',
    'Specialty Care',
    'Surgery & Advanced'
  ];

  useEffect(() => {
    loadServices();
  }, []);

  useEffect(() => {
    filterServices();
  }, [services, searchTerm, filterCategory, showInactive]);

  const loadServices = async () => {
    try {
      const servicesData = dataService.getServices();
      setServices(servicesData);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterServices = () => {
    let filtered = [...services];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.descriptionShort && service.descriptionShort.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(service => service.category === filterCategory);
    }

    // Filter by active status
    if (!showInactive) {
      filtered = filtered.filter(service => service.active);
    }

    setFilteredServices(filtered);
  };

  const handleToggleActive = async (serviceId, currentStatus) => {
    try {
      await dataService.updateService(serviceId, { active: !currentStatus });
      loadServices();
    } catch (error) {
      console.error('Failed to update service status:', error);
    }
  };

  const handleDeleteService = async () => {
    if (!selectedService) return;

    try {
      await dataService.deleteService(selectedService.id);
      setShowDeleteModal(false);
      setSelectedService(null);
      loadServices();
    } catch (error) {
      console.error('Failed to delete service:', error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(filteredServices);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update display orders
    const updates = items.map((item, index) => ({
      id: item.id,
      displayOrder: index + 1
    }));

    try {
      for (const update of updates) {
        await dataService.updateService(update.id, { displayOrder: update.displayOrder });
      }
      loadServices();
    } catch (error) {
      console.error('Failed to reorder services:', error);
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Services Management</h1>
          <p className="text-gray-600">Manage your dental services and offerings</p>
        </div>
        <button
          onClick={() => navigate('/admin/services/new')}
          className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <FaPlus className="mr-2" size={16} />
          Add Service
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
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          {/* Filter by Category */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
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

          {/* Stats */}
          <div className="text-sm text-gray-600">
            <span className="font-medium">{filteredServices.length}</span> of{' '}
            <span className="font-medium">{services.length}</span> services
          </div>
        </div>
      </div>

      {/* Services List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredServices.length === 0 ? (
          <div className="p-12 text-center">
            <FaTooth className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterCategory !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by adding your first service'
              }
            </p>
            {!searchTerm && filterCategory === 'all' && (
              <button
                onClick={() => navigate('/admin/services/new')}
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FaPlus className="mr-2" size={16} />
                Add First Service
              </button>
            )}
          </div>
        ) : (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="services">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="divide-y divide-gray-200">
                  {filteredServices.map((service, index) => (
                    <Draggable key={service.id} draggableId={service.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`p-6 transition-colors ${
                            snapshot.isDragging ? 'bg-gray-50 shadow-lg' : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {/* Drag Handle */}
                              <div {...provided.dragHandleProps} className="cursor-move text-gray-400 hover:text-gray-600">
                                <FaGripVertical size={16} />
                              </div>

                              {/* Service Icon */}
                              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <FaTooth className="text-primary-600" size={20} />
                              </div>

                              {/* Service Info */}
                              <div className="flex-1">
                                <div className="flex items-center space-x-3">
                                  <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                                  <button
                                    onClick={() => handleToggleActive(service.id, service.active)}
                                    className={`flex items-center ${
                                      service.active ? 'text-green-600' : 'text-gray-400'
                                    }`}
                                    title={service.active ? 'Active' : 'Inactive'}
                                  >
                                    {service.active ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                                  </button>
                                </div>
                                
                                <p className="text-primary-600 font-medium text-sm">{service.category}</p>
                                <p className="text-gray-600 text-sm mt-1">{service.descriptionShort}</p>
                                
                                {service.descriptionFull && (
                                  <p className="text-gray-500 text-xs mt-2 line-clamp-2">{service.descriptionFull}</p>
                                )}
                              </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-500">#{service.displayOrder}</span>
                              <button
                                onClick={() => navigate(`/admin/services/${service.id}/edit`)}
                                className="p-2 text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                                title="Edit Service"
                              >
                                <FaEdit size={16} />
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedService(service);
                                  setShowDeleteModal(true);
                                }}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Delete Service"
                              >
                                <FaTrash size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Category Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {categories.map(category => {
          const categoryServices = services.filter(s => s.category === category);
          const activeCount = categoryServices.filter(s => s.active).length;
          
          return (
            <div key={category} className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 text-sm mb-2">{category}</h4>
              <div className="text-2xl font-bold text-primary-600">{activeCount}</div>
              <div className="text-xs text-gray-500">
                {categoryServices.length} total
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Delete Service</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete <strong>{selectedService.name}</strong>? 
              This action cannot be undone and will remove it from the public website.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedService(null);
                }}
                className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteService}
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

export default ServicesManagement;

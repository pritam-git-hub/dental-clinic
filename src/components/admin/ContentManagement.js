import React, { useState, useEffect } from 'react';
import {
  FaStar,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaClock,
  FaGlobe,
  FaPlus,
  FaEdit,
  FaTrash,
  FaSave,
  FaTimes,
  FaToggleOn,
  FaToggleOff,
  FaGripVertical
} from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import dataService from '../../services/DataService.js';

const ContentManagement = () => {
  const [activeTab, setActiveTab] = useState('highlights');
  const [highlights, setHighlights] = useState([]);
  const [branches, setBranches] = useState([]);
  const [contact, setContact] = useState({});
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState('');

  const tabs = [
    { id: 'highlights', label: 'Highlights', icon: FaStar },
    { id: 'branches', label: 'Branches', icon: FaMapMarkerAlt },
    { id: 'contact', label: 'Contact Info', icon: FaPhone }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = dataService.getData();
      setHighlights(data.highlights || []);
      setBranches(data.branches || []);
      setContact(data.contact || {});
    } catch (error) {
      console.error('Failed to load content data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (result, type) => {
    if (!result.destination) return;

    const items = type === 'highlights' ? [...highlights] : [...branches];
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update display orders
    const updatedItems = items.map((item, index) => ({
      ...item,
      displayOrder: index + 1
    }));

    if (type === 'highlights') {
      setHighlights(updatedItems);
      // Update in data service
      const data = dataService.getData();
      data.highlights = updatedItems;
      dataService.saveData(data);
    } else {
      setBranches(updatedItems);
      const data = dataService.getData();
      data.branches = updatedItems;
      dataService.saveData(data);
    }
  };

  const addHighlight = () => {
    if (!newItem.trim()) return;

    const newHighlight = {
      id: `h${Date.now()}`,
      text: newItem.trim(),
      active: true,
      displayOrder: highlights.length + 1
    };

    const updatedHighlights = [...highlights, newHighlight];
    setHighlights(updatedHighlights);
    
    const data = dataService.getData();
    data.highlights = updatedHighlights;
    dataService.saveData(data);
    dataService.logAction('create', 'highlight', newHighlight.id, newHighlight);
    
    setNewItem('');
  };

  const addBranch = () => {
    if (!newItem.trim()) return;

    const newBranch = {
      id: `b${Date.now()}`,
      name: newItem.trim(),
      city: 'City',
      address: newItem.trim(),
      active: true,
      displayOrder: branches.length + 1
    };

    const updatedBranches = [...branches, newBranch];
    setBranches(updatedBranches);
    
    const data = dataService.getData();
    data.branches = updatedBranches;
    dataService.saveData(data);
    dataService.logAction('create', 'branch', newBranch.id, newBranch);
    
    setNewItem('');
  };

  const updateItem = (type, id, updates) => {
    if (type === 'highlights') {
      const updated = highlights.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      setHighlights(updated);
      
      const data = dataService.getData();
      data.highlights = updated;
      dataService.saveData(data);
    } else if (type === 'branches') {
      const updated = branches.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      setBranches(updated);
      
      const data = dataService.getData();
      data.branches = updated;
      dataService.saveData(data);
    }
    
    setEditingItem(null);
  };

  const deleteItem = (type, id) => {
    if (type === 'highlights') {
      const updated = highlights.filter(item => item.id !== id);
      setHighlights(updated);
      
      const data = dataService.getData();
      data.highlights = updated;
      dataService.saveData(data);
    } else if (type === 'branches') {
      const updated = branches.filter(item => item.id !== id);
      setBranches(updated);
      
      const data = dataService.getData();
      data.branches = updated;
      dataService.saveData(data);
    }
  };

  const updateContact = (field, value) => {
    const updatedContact = { ...contact, [field]: value };
    setContact(updatedContact);
    
    const data = dataService.getData();
    data.contact = updatedContact;
    dataService.saveData(data);
    dataService.logAction('update', 'contact', field, { before: contact[field], after: value });
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
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
        <p className="text-gray-600">Manage highlights, branches, and contact information</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="mr-2" size={16} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Highlights Tab */}
      {activeTab === 'highlights' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Clinic Highlights</h3>
            
            {/* Add new highlight */}
            <div className="flex space-x-3 mb-6">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Add new highlight..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                onKeyPress={(e) => e.key === 'Enter' && addHighlight()}
              />
              <button
                onClick={addHighlight}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FaPlus size={16} />
              </button>
            </div>

            {/* Highlights list */}
            <DragDropContext onDragEnd={(result) => handleDragEnd(result, 'highlights')}>
              <Droppable droppableId="highlights">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {highlights.map((highlight, index) => (
                      <Draggable key={highlight.id} draggableId={highlight.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center space-x-4 p-4 border rounded-lg ${
                              snapshot.isDragging ? 'bg-gray-50 shadow-lg' : 'bg-gray-50'
                            }`}
                          >
                            <div {...provided.dragHandleProps} className="cursor-move text-gray-400">
                              <FaGripVertical size={16} />
                            </div>
                            
                            {editingItem === highlight.id ? (
                              <input
                                type="text"
                                defaultValue={highlight.text}
                                onBlur={(e) => updateItem('highlights', highlight.id, { text: e.target.value })}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    updateItem('highlights', highlight.id, { text: e.target.value });
                                  }
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                autoFocus
                              />
                            ) : (
                              <div className="flex-1 text-gray-900">{highlight.text}</div>
                            )}
                            
                            <button
                              onClick={() => updateItem('highlights', highlight.id, { active: !highlight.active })}
                              className={`${highlight.active ? 'text-green-600' : 'text-gray-400'}`}
                            >
                              {highlight.active ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                            </button>
                            
                            <button
                              onClick={() => setEditingItem(highlight.id)}
                              className="text-gray-600 hover:text-primary-600"
                            >
                              <FaEdit size={16} />
                            </button>
                            
                            <button
                              onClick={() => deleteItem('highlights', highlight.id)}
                              className="text-gray-600 hover:text-red-600"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      )}

      {/* Branches Tab */}
      {activeTab === 'branches' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Branch Locations</h3>
            
            {/* Add new branch */}
            <div className="flex space-x-3 mb-6">
              <input
                type="text"
                value={newItem}
                onChange={(e) => setNewItem(e.target.value)}
                placeholder="Add new branch location..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                onKeyPress={(e) => e.key === 'Enter' && addBranch()}
              />
              <button
                onClick={addBranch}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <FaPlus size={16} />
              </button>
            </div>

            {/* Branches list */}
            <DragDropContext onDragEnd={(result) => handleDragEnd(result, 'branches')}>
              <Droppable droppableId="branches">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {branches.map((branch, index) => (
                      <Draggable key={branch.id} draggableId={branch.id} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center space-x-4 p-4 border rounded-lg ${
                              snapshot.isDragging ? 'bg-gray-50 shadow-lg' : 'bg-gray-50'
                            }`}
                          >
                            <div {...provided.dragHandleProps} className="cursor-move text-gray-400">
                              <FaGripVertical size={16} />
                            </div>
                            
                            <FaMapMarkerAlt className="text-primary-600" size={16} />
                            
                            {editingItem === branch.id ? (
                              <input
                                type="text"
                                defaultValue={branch.name}
                                onBlur={(e) => updateItem('branches', branch.id, { name: e.target.value, address: e.target.value })}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    updateItem('branches', branch.id, { name: e.target.value, address: e.target.value });
                                  }
                                }}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                                autoFocus
                              />
                            ) : (
                              <div className="flex-1 text-gray-900">{branch.name}</div>
                            )}
                            
                            <button
                              onClick={() => updateItem('branches', branch.id, { active: !branch.active })}
                              className={`${branch.active ? 'text-green-600' : 'text-gray-400'}`}
                            >
                              {branch.active ? <FaToggleOn size={20} /> : <FaToggleOff size={20} />}
                            </button>
                            
                            <button
                              onClick={() => setEditingItem(branch.id)}
                              className="text-gray-600 hover:text-primary-600"
                            >
                              <FaEdit size={16} />
                            </button>
                            
                            <button
                              onClick={() => deleteItem('branches', branch.id)}
                              className="text-gray-600 hover:text-red-600"
                            >
                              <FaTrash size={16} />
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Phone Numbers */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaPhone className="inline mr-2" size={14} />
                  Phone Numbers
                </label>
                <div className="space-y-2">
                  {contact.phones?.map((phone, index) => (
                    <input
                      key={index}
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        const newPhones = [...(contact.phones || [])];
                        newPhones[index] = e.target.value;
                        updateContact('phones', newPhones);
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  ))}
                  <button
                    onClick={() => {
                      const newPhones = [...(contact.phones || []), ''];
                      updateContact('phones', newPhones);
                    }}
                    className="text-sm text-primary-600 hover:text-primary-700"
                  >
                    + Add Phone Number
                  </button>
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaEnvelope className="inline mr-2" size={14} />
                  Email Address
                </label>
                <input
                  type="email"
                  value={contact.email || ''}
                  onChange={(e) => updateContact('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Website */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaGlobe className="inline mr-2" size={14} />
                  Website
                </label>
                <input
                  type="url"
                  value={contact.website || ''}
                  onChange={(e) => updateContact('website', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaClock className="inline mr-2" size={14} />
                  Operating Hours
                </label>
                <input
                  type="text"
                  value={contact.hours || ''}
                  onChange={(e) => updateContact('hours', e.target.value)}
                  placeholder="e.g., 9 AM to 5 PM"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>

              {/* Address */}
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FaMapMarkerAlt className="inline mr-2" size={14} />
                  Full Address
                </label>
                <textarea
                  value={contact.address || ''}
                  onChange={(e) => updateContact('address', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;

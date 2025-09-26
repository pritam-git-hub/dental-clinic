import React, { useState, useEffect, useRef } from 'react';
import {
  FaUpload,
  FaImage,
  FaTrash,
  FaEdit,
  FaEye,
  FaDownload,
  FaSearch,
  FaFilter,
  FaTimes,
  FaSave,
  FaFileImage,
  FaExclamationTriangle
} from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';
import dataService from '../../services/DataService.js';

const MediaLibrary = () => {
  const [media, setMedia] = useState([]);
  const [filteredMedia, setFilteredMedia] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [editingMedia, setEditingMedia] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadMedia();
  }, []);

  useEffect(() => {
    filterMedia();
  }, [media, searchTerm, filterType]);

  const loadMedia = async () => {
    try {
      const data = dataService.getData();
      setMedia(data.media || []);
    } catch (error) {
      console.error('Failed to load media:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMedia = () => {
    let filtered = [...media];

    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.altText && item.altText.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    setFilteredMedia(filtered);
  };

  const onDrop = async (acceptedFiles) => {
    setUploading(true);
    
    try {
      for (const file of acceptedFiles) {
        await uploadFile(file);
      }
      loadMedia();
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const uploadFile = async (file) => {
    return new Promise((resolve, reject) => {
      // Validate file
      if (!file.type.startsWith('image/')) {
        reject(new Error('Only image files are allowed'));
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        reject(new Error('File size must be less than 5MB'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const mediaItem = {
            id: `media-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            fileName: file.name,
            url: e.target.result,
            type: 'image',
            altText: '',
            uploadedAt: new Date().toISOString(),
            size: file.size,
            usedBy: null
          };

          // Save to data service
          const data = dataService.getData();
          data.media = [...(data.media || []), mediaItem];
          dataService.saveData(data);
          dataService.logAction('create', 'media', mediaItem.id, mediaItem);

          resolve(mediaItem);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  const deleteMedia = async (mediaId) => {
    try {
      const data = dataService.getData();
      const mediaItem = data.media.find(m => m.id === mediaId);
      
      // Check if media is in use
      if (mediaItem?.usedBy) {
        alert(`This image is currently used by ${mediaItem.usedBy.entity}. Please remove it from there first.`);
        return;
      }

      data.media = data.media.filter(m => m.id !== mediaId);
      dataService.saveData(data);
      dataService.logAction('delete', 'media', mediaId, mediaItem);
      
      loadMedia();
    } catch (error) {
      console.error('Failed to delete media:', error);
    }
  };

  const updateMedia = async (mediaId, updates) => {
    try {
      const data = dataService.getData();
      const index = data.media.findIndex(m => m.id === mediaId);
      
      if (index !== -1) {
        const oldMedia = { ...data.media[index] };
        data.media[index] = { ...data.media[index], ...updates };
        dataService.saveData(data);
        dataService.logAction('update', 'media', mediaId, { before: oldMedia, after: data.media[index] });
        
        loadMedia();
        setEditingMedia(null);
      }
    } catch (error) {
      console.error('Failed to update media:', error);
    }
  };

  const downloadMedia = (mediaItem) => {
    const link = document.createElement('a');
    link.href = mediaItem.url;
    link.download = mediaItem.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp', '.svg']
    },
    multiple: true
  });

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
          <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
          <p className="text-gray-600">Manage images and media files</p>
        </div>
        <div className="text-sm text-gray-500">
          {filteredMedia.length} of {media.length} files
        </div>
      </div>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
      >
        <input {...getInputProps()} />
        <FaUpload className="mx-auto text-gray-400 mb-4" size={48} />
        <div className="text-lg font-medium text-gray-900 mb-2">
          {isDragActive ? 'Drop files here' : 'Upload Images'}
        </div>
        <p className="text-gray-600 mb-4">
          Drag and drop images here, or click to select files
        </p>
        <p className="text-sm text-gray-500">
          Supports: JPG, PNG, GIF, WebP, SVG • Max size: 5MB per file
        </p>
        {uploading && (
          <div className="mt-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600 mx-auto"></div>
            <p className="text-sm text-primary-600 mt-2">Uploading...</p>
          </div>
        )}
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search by filename or alt text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Types</option>
              <option value="image">Images</option>
            </select>
          </div>
        </div>
      </div>

      {/* Media Grid */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filteredMedia.length === 0 ? (
          <div className="p-12 text-center">
            <FaFileImage className="mx-auto text-gray-400 mb-4" size={48} />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No media files</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterType !== 'all' 
                ? 'No files match your search criteria'
                : 'Upload your first image to get started'
              }
            </p>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {filteredMedia.map((mediaItem) => (
                <div
                  key={mediaItem.id}
                  className="group relative bg-gray-50 rounded-lg overflow-hidden border border-gray-200 hover:border-gray-300 transition-colors"
                >
                  {/* Image Preview */}
                  <div className="aspect-square bg-gray-100 flex items-center justify-center">
                    <img
                      src={mediaItem.url}
                      alt={mediaItem.altText || mediaItem.fileName}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>

                  {/* Overlay Actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedMedia(mediaItem);
                          setShowPreview(true);
                        }}
                        className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                        title="Preview"
                      >
                        <FaEye size={14} />
                      </button>
                      <button
                        onClick={() => setEditingMedia(mediaItem)}
                        className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                        title="Edit"
                      >
                        <FaEdit size={14} />
                      </button>
                      <button
                        onClick={() => downloadMedia(mediaItem)}
                        className="p-2 bg-white text-gray-700 rounded-full hover:bg-gray-100 transition-colors"
                        title="Download"
                      >
                        <FaDownload size={14} />
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this image?')) {
                            deleteMedia(mediaItem.id);
                          }
                        }}
                        className="p-2 bg-white text-red-600 rounded-full hover:bg-red-50 transition-colors"
                        title="Delete"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>

                  {/* File Info */}
                  <div className="p-3">
                    <div className="text-xs font-medium text-gray-900 truncate" title={mediaItem.fileName}>
                      {mediaItem.fileName}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {formatFileSize(mediaItem.size)}
                    </div>
                    {mediaItem.usedBy && (
                      <div className="text-xs text-green-600 mt-1 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        In use
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && selectedMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl max-h-full overflow-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">{selectedMedia.fileName}</h3>
              <button
                onClick={() => {
                  setShowPreview(false);
                  setSelectedMedia(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <div className="p-4">
              <img
                src={selectedMedia.url}
                alt={selectedMedia.altText || selectedMedia.fileName}
                className="max-w-full max-h-96 mx-auto"
              />
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">File Size:</span>
                  <span className="ml-2 text-gray-600">{formatFileSize(selectedMedia.size)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Uploaded:</span>
                  <span className="ml-2 text-gray-600">
                    {new Date(selectedMedia.uploadedAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Alt Text:</span>
                  <span className="ml-2 text-gray-600">
                    {selectedMedia.altText || 'Not set'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editingMedia && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Media</h3>
              <button
                onClick={() => setEditingMedia(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes size={20} />
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                updateMedia(editingMedia.id, {
                  altText: formData.get('altText')
                });
              }}
              className="p-4 space-y-4"
            >
              <div>
                <img
                  src={editingMedia.url}
                  alt={editingMedia.fileName}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  File Name
                </label>
                <input
                  type="text"
                  value={editingMedia.fileName}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Alt Text *
                </label>
                <textarea
                  name="altText"
                  defaultValue={editingMedia.altText}
                  placeholder="Describe this image for accessibility..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Alt text helps screen readers and improves SEO
                </p>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setEditingMedia(null)}
                  className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                >
                  <FaSave className="inline mr-2" size={14} />
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibrary;

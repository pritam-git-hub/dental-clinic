import React from 'react';
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaPhone, 
  FaEnvelope, 
  FaDirections 
} from 'react-icons/fa';
import { siteConfig } from '../config/site';

const Location = () => {
  return (
    <section className="section-padding bg-white">
      <div className="section-container">
        <div className="text-center mb-16">
          <h2 className="heading-secondary">
            Visit Our Clinic
          </h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Conveniently located in New Town, Kolkata with easy access and 
            modern facilities designed for your comfort.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            {/* Main Address */}
            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
                  <FaMapMarkerAlt className="text-primary-600" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-neutral-900 mb-2">Our Location</h3>
                  <p className="text-neutral-600 leading-relaxed">
                    {siteConfig.address.full}
                  </p>
                  <button className="mt-3 text-primary-600 hover:text-primary-700 font-medium flex items-center space-x-2 transition-colors">
                    <FaDirections size={16} />
                    <span>Get Directions</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="card">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FaClock className="text-green-600" size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-neutral-900 mb-2">Opening Hours</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Monday - Saturday</span>
                      <span className="font-medium text-neutral-900">{siteConfig.hours}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Sunday</span>
                      <span className="font-medium text-red-600">Closed</span>
                    </div>
                  </div>
                  <div className="mt-3 inline-flex items-center space-x-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Open Today</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Methods */}
            <div className="grid md:grid-cols-2 gap-4">
              {/* Phone */}
              <div className="card">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                    <FaPhone className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-2">Call Us</h4>
                    <div className="space-y-1">
                      {siteConfig.phones.map((phone, index) => (
                        <a
                          key={index}
                          href={`tel:${phone}`}
                          className="block text-primary-600 hover:text-primary-700 font-medium transition-colors"
                        >
                          {phone}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="card">
                <div className="text-center space-y-3">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                    <FaEnvelope className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-neutral-900 mb-2">Email Us</h4>
                    <a
                      href={`mailto:${siteConfig.email}`}
                      className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
                    >
                      {siteConfig.email}
                    </a>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Map and Branches */}
          <div className="space-y-8">
            {/* Map Placeholder */}
            <div className="bg-neutral-100 rounded-xl overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <FaMapMarkerAlt className="text-primary-600 mx-auto" size={48} />
                  <div>
                    <h4 className="font-semibold text-neutral-900">Interactive Map</h4>
                    <p className="text-neutral-600">New Town, Kolkata Location</p>
                  </div>
                  <button className="btn-primary">
                    View on Google Maps
                  </button>
                </div>
              </div>
            </div>

            {/* Other Branches */}
            <div className="card">
              <h3 className="font-bold text-neutral-900 mb-4">Our Other Locations</h3>
              <div className="space-y-3">
                {siteConfig.branches.map((branch, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FaMapMarkerAlt className="text-primary-600" size={14} />
                    </div>
                    <span className="text-neutral-700">{branch}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-4 bg-primary-50 rounded-lg">
                <p className="text-sm text-primary-700">
                  <strong>Note:</strong> This website represents our New Town location. 
                  Please contact us for information about services at other branches.
                </p>
              </div>
            </div>

            {/* Emergency Contact */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 border border-red-100">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <FaPhone className="text-red-600" size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 mb-2">Dental Emergency?</h3>
                  <p className="text-neutral-600 mb-3">
                    For urgent dental care outside regular hours, please call our emergency line.
                  </p>
                  <a
                    href={`tel:${siteConfig.phones[0]}`}
                    className="inline-flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    <FaPhone size={16} />
                    <span>Emergency Call</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Location;

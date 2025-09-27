import React from 'react';
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaPhoneAlt, 
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

        {/* Main Office - New Town */}
        <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-4 sm:p-6 lg:p-8 mb-8 lg:mb-12 border-2 border-primary-200">
          <div className="grid lg:grid-cols-2 gap-6 lg:gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-primary-700 mb-4">
                🏥 Newtown Clinic
              </h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <FaMapMarkerAlt className="text-primary-600 mt-1" size={20} />
                  <div>
                    <p className="text-lg font-semibold text-neutral-900">
                      {siteConfig.address.full}
                    </p>
                    <button 
                      onClick={() => window.open('https://maps.google.com/?q=Dr.+Gandhi\'s+Dental+Avenue+New+Town+Kolkata', '_blank')}
                      className="mt-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center space-x-2"
                    >
                      <FaDirections size={16} />
                      <span>Get Location</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <a href="tel:+919051864455" className="text-lg font-medium text-primary-600 hover:text-primary-700">
                      +91 9051864455
                    </a>
                    <FaPhoneAlt className="text-green-600" size={18} />
                  </div>
                  <div className="flex items-center justify-between">
                    <a href="tel:+919830032088" className="text-lg font-medium text-primary-600 hover:text-primary-700">
                      +91 9830032088
                    </a>
                    <FaPhoneAlt className="text-green-600" size={18} />
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <FaEnvelope className="text-purple-600" size={18} />
                  <a href={`mailto:${siteConfig.email}`} className="text-lg font-medium text-primary-600 hover:text-primary-700">
                    {siteConfig.email}
                  </a>
                </div>
              </div>
            </div>
            
            {/* Small map for main office */}
            <div className="bg-white rounded-xl overflow-hidden shadow-lg">
              <div className="aspect-video relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.0123456789!2d88.4324567890123!3d22.5678901234567!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sNew%20Town%2C%20Kolkata!5e0!3m2!1sen!2sin!4v1234567890123!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Newtown Clinic"
                ></iframe>
              </div>
            </div>
          </div>
        </div>

        {/* Other Branches */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-neutral-900 mb-8 text-center">Our Other Locations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                name: "Lansdowne Paddapukur",
                address: "Lansdowne Paddapukur, Kolkata",
                url: "https://maps.google.com/?q=Lansdowne+Paddapukur+Kolkata"
              },
              {
                name: "Medica Superspeciality Hospital",
                address: "Medica Superspeciality Hospital, Kolkata", 
                url: "https://maps.google.com/?q=Medica+Superspeciality+Hospital+Kolkata"
              },
              {
                name: "Sunny Enclave, Mohali",
                address: "Sunny Enclave, Mohali, Punjab",
                url: "https://maps.google.com/?q=Sunny+Enclave+Mohali+Punjab"
              }
            ].map((branch, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-neutral-200 hover:shadow-xl transition-shadow">
                <div className="text-center">
                  <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaMapMarkerAlt className="text-primary-600" size={24} />
                  </div>
                  <h4 className="font-bold text-neutral-900 mb-2 text-lg">{branch.name}</h4>
                  <p className="text-neutral-600 mb-4 text-sm">{branch.address}</p>
                  <button
                    onClick={() => window.open(branch.url, '_blank')}
                    className="bg-secondary-600 text-white px-4 py-2 rounded-lg hover:bg-secondary-700 transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <FaDirections size={14} />
                    <span>Get Location</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Information Card */}
        <div className="max-w-2xl mx-auto">
          {/* Contact Us - Single Card */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-8 shadow-xl border-2 border-gradient-to-r from-blue-200 to-purple-200 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="text-center">
              <div className="flex justify-center space-x-4 mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FaPhoneAlt className="text-blue-600" size={20} />
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FaEnvelope className="text-purple-600" size={20} />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-neutral-900 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Contact Us</h3>
              
              {/* Phone Numbers */}
              <div className="space-y-3 mb-6">
                <h4 className="text-lg font-semibold text-neutral-800 mb-3">Call Us</h4>
                {siteConfig.phones.map((phone, index) => (
                  <a
                    key={index}
                    href={`tel:${phone}`}
                    className="flex items-center justify-center space-x-3 text-lg font-semibold text-blue-600 hover:text-blue-700 transition-colors py-3 px-4 rounded-lg hover:bg-white hover:bg-opacity-80 border border-blue-200 hover:border-blue-300"
                  >
                    <FaPhoneAlt className="text-blue-600" size={16} />
                    <span>{phone}</span>
                  </a>
                ))}
              </div>
              
              {/* Email */}
              <div>
                <h4 className="text-lg font-semibold text-neutral-800 mb-3">Email Us</h4>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex items-center space-x-3 text-lg font-semibold text-purple-600 hover:text-purple-700 transition-colors py-3 px-6 rounded-lg hover:bg-white hover:bg-opacity-80 border border-purple-200 hover:border-purple-300"
                >
                  <FaEnvelope size={16} />
                  <span>{siteConfig.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Location;

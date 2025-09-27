import React, { useState, useEffect } from 'react';
import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaTimes,
  FaSync,
  FaSms,
  FaEnvelope,
  FaShieldAlt,
  FaCog,
  FaChartLine,
  FaEye,
  FaEyeSlash
} from 'react-icons/fa';

const OTPServiceMonitor = () => {
  const [serviceStatus, setServiceStatus] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLogs, setShowLogs] = useState(false);
  const [logs, setLogs] = useState([]);
  const [showCredentials, setShowCredentials] = useState(false);

  useEffect(() => {
    loadServiceStatus();
    loadLogs();
  }, []);

  const loadServiceStatus = async () => {
    try {
      const { default: otpService } = await import('../../services/OTPService.js');
      const status = otpService.getServiceStatus();
      setServiceStatus(status);
    } catch (error) {
      console.error('Failed to load service status:', error);
    }
  };

  const loadLogs = async () => {
    try {
      const { default: otpService } = await import('../../services/OTPService.js');
      const verificationLogs = otpService.getVerificationLogs();
      setLogs(verificationLogs.slice(-20)); // Last 20 logs
    } catch (error) {
      console.error('Failed to load logs:', error);
    }
  };

  const testServices = async () => {
    setLoading(true);
    try {
      const { default: otpService } = await import('../../services/OTPService.js');
      const results = await otpService.testServices();
      setTestResults(results);
    } catch (error) {
      console.error('Service test failed:', error);
      setTestResults({
        sms: { success: false, error: error.message },
        email: { success: false, error: error.message }
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (configured, success = null) => {
    if (success === false) return <FaTimes className="text-red-500" />;
    if (success === true) return <FaCheckCircle className="text-green-500" />;
    if (configured) return <FaCheckCircle className="text-green-500" />;
    return <FaExclamationTriangle className="text-yellow-500" />;
  };

  const getStatusText = (configured, demoMode, success = null) => {
    if (success === false) return 'Failed';
    if (success === true) return 'Working';
    if (demoMode) return 'Demo Mode';
    if (configured) return 'Configured';
    return 'Not Configured';
  };

  const getStatusColor = (configured, demoMode, success = null) => {
    if (success === false) return 'text-red-600 bg-red-50 border-red-200';
    if (success === true) return 'text-green-600 bg-green-50 border-green-200';
    if (demoMode) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (configured) return 'text-green-600 bg-green-50 border-green-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  if (!serviceStatus) {
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
          <h1 className="text-2xl font-bold text-gray-900">OTP Service Monitor</h1>
          <p className="text-gray-600">Monitor and test OTP delivery services</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={loadServiceStatus}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <FaSync className="mr-2" size={16} />
            Refresh
          </button>
          <button
            onClick={testServices}
            disabled={loading}
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <FaShieldAlt className="mr-2" size={16} />
            )}
            Test Services
          </button>
        </div>
      </div>

      {/* Service Status Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* SMS Service */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FaSms className="text-blue-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">SMS Service</h3>
                <p className="text-sm text-gray-500">Twilio</p>
              </div>
            </div>
            {getStatusIcon(serviceStatus.sms.configured, testResults?.sms?.success)}
          </div>
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(serviceStatus.sms.configured, serviceStatus.sms.demoMode, testResults?.sms?.success)}`}>
            {getStatusText(serviceStatus.sms.configured, serviceStatus.sms.demoMode, testResults?.sms?.success)}
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Account SID:</span>
              <span className={serviceStatus.sms.hasAccountSid ? 'text-green-600' : 'text-red-600'}>
                {serviceStatus.sms.hasAccountSid ? '✓ Set' : '✗ Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Auth Token:</span>
              <span className={serviceStatus.sms.hasAuthToken ? 'text-green-600' : 'text-red-600'}>
                {serviceStatus.sms.hasAuthToken ? '✓ Set' : '✗ Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Phone Number:</span>
              <span className={serviceStatus.sms.hasFromNumber ? 'text-green-600' : 'text-red-600'}>
                {serviceStatus.sms.hasFromNumber ? '✓ Set' : '✗ Missing'}
              </span>
            </div>
          </div>

          {testResults?.sms?.error && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {testResults.sms.error}
            </div>
          )}
        </div>

        {/* Email Service */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FaEnvelope className="text-purple-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Email Service</h3>
                <p className="text-sm text-gray-500">EmailJS</p>
              </div>
            </div>
            {getStatusIcon(serviceStatus.email.configured, testResults?.email?.success)}
          </div>
          
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(serviceStatus.email.configured, serviceStatus.email.demoMode, testResults?.email?.success)}`}>
            {getStatusText(serviceStatus.email.configured, serviceStatus.email.demoMode, testResults?.email?.success)}
          </div>

          <div className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Service ID:</span>
              <span className={serviceStatus.email.hasServiceId ? 'text-green-600' : 'text-red-600'}>
                {serviceStatus.email.hasServiceId ? '✓ Set' : '✗ Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Template ID:</span>
              <span className={serviceStatus.email.hasTemplateId ? 'text-green-600' : 'text-red-600'}>
                {serviceStatus.email.hasTemplateId ? '✓ Set' : '✗ Missing'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Public Key:</span>
              <span className={serviceStatus.email.hasPublicKey ? 'text-green-600' : 'text-red-600'}>
                {serviceStatus.email.hasPublicKey ? '✓ Set' : '✗ Missing'}
              </span>
            </div>
          </div>

          {testResults?.email?.error && (
            <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
              {testResults.email.error}
            </div>
          )}
        </div>

        {/* OTP Configuration */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <FaCog className="text-green-600" size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">OTP Settings</h3>
                <p className="text-sm text-gray-500">Configuration</p>
              </div>
            </div>
            <FaCheckCircle className="text-green-500" />
          </div>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">OTP Length:</span>
              <span className="text-gray-900">{serviceStatus.otp.length} digits</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Expiry Time:</span>
              <span className="text-gray-900">{serviceStatus.otp.expiryMinutes} min</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Max Attempts:</span>
              <span className="text-gray-900">{serviceStatus.otp.maxAttempts}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Resend Cooldown:</span>
              <span className="text-gray-900">{serviceStatus.otp.resendCooldownSeconds}s</span>
            </div>
          </div>
        </div>
      </div>

      {/* Environment Variables */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Environment Configuration</h3>
          <button
            onClick={() => setShowCredentials(!showCredentials)}
            className="inline-flex items-center px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            {showCredentials ? <FaEyeSlash className="mr-1" /> : <FaEye className="mr-1" />}
            {showCredentials ? 'Hide' : 'Show'} Details
          </button>
        </div>

        {showCredentials && (
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Twilio Configuration</h4>
              <div className="space-y-2 text-sm font-mono">
                <div>REACT_APP_TWILIO_ACCOUNT_SID: {serviceStatus.sms.hasAccountSid ? '✓ Set' : '✗ Missing'}</div>
                <div>REACT_APP_TWILIO_AUTH_TOKEN: {serviceStatus.sms.hasAuthToken ? '✓ Set' : '✗ Missing'}</div>
                <div>REACT_APP_TWILIO_PHONE_NUMBER: {serviceStatus.sms.hasFromNumber ? '✓ Set' : '✗ Missing'}</div>
                <div>REACT_APP_TWILIO_VERIFY_SERVICE_SID: {serviceStatus.sms.hasServiceSid ? '✓ Set' : '✗ Missing'}</div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-3">EmailJS Configuration</h4>
              <div className="space-y-2 text-sm font-mono">
                <div>REACT_APP_EMAILJS_SERVICE_ID: {serviceStatus.email.hasServiceId ? '✓ Set' : '✗ Missing'}</div>
                <div>REACT_APP_EMAILJS_TEMPLATE_ID: {serviceStatus.email.hasTemplateId ? '✓ Set' : '✗ Missing'}</div>
                <div>REACT_APP_EMAILJS_PUBLIC_KEY: {serviceStatus.email.hasPublicKey ? '✓ Set' : '✗ Missing'}</div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Setup Instructions:</strong> Check the <code>OTP_SETUP_GUIDE.md</code> file for detailed configuration steps.
          </p>
        </div>
      </div>

      {/* Verification Logs */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Verification Attempts</h3>
          <button
            onClick={() => setShowLogs(!showLogs)}
            className="inline-flex items-center px-3 py-1 text-sm text-primary-600 hover:text-primary-700"
          >
            <FaChartLine className="mr-1" />
            {showLogs ? 'Hide' : 'Show'} Logs
          </button>
        </div>

        {showLogs && (
          <div className="space-y-3">
            {logs.length === 0 ? (
              <p className="text-gray-500 text-sm">No verification attempts recorded yet.</p>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {log.success ? (
                      <FaCheckCircle className="text-green-500" size={16} />
                    ) : (
                      <FaTimes className="text-red-500" size={16} />
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {log.phone} • {log.email}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(log.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    log.success ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {log.success ? 'Success' : 'Failed'}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OTPServiceMonitor;

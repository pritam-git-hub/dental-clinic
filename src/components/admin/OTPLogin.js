import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  FaEnvelope, 
  FaPhone, 
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaArrowLeft,
  FaShieldAlt
} from 'react-icons/fa';
import authService from '../../services/AuthService';

// OTP Login Component
const OTPLogin = () => {
  const [step, setStep] = useState('credentials'); // 'credentials', 'otp', 'success'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [userCredentials, setUserCredentials] = useState(null);
  const [otpTimer, setOtpTimer] = useState(0);
  
  const navigate = useNavigate();

  // Step 1: Credentials form
  const credentialsForm = useForm({
    resolver: zodResolver(
      z.object({
        emailOrId: z.string().min(1, 'Email or User ID is required'),
        phone: z.string().regex(/^[+]?[0-9\s-()]{10,15}$/, 'Please enter a valid phone number'),
        email: z.string().email('Please enter a valid email address')
      })
    )
  });

  // Step 2: OTP form
  const otpForm = useForm({
    resolver: zodResolver(
      z.object({
        mobileOTP: z.string().length(6, 'Mobile OTP must be 6 digits'),
        emailOTP: z.string().length(6, 'Email OTP must be 6 digits')
      })
    )
  });

  // Timer for OTP resend
  useEffect(() => {
    let interval;
    if (otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpTimer]);

  // Check if already authenticated
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  // Step 1: Submit credentials and send OTP
  const handleCredentialsSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      // Verify user exists (you'll need to implement this in AuthService)
      const userExists = await authService.verifyUserExists(data.emailOrId);
      
      if (!userExists.success) {
        setError(userExists.error || 'User not found');
        setLoading(false);
        return;
      }

      // Send OTP
      const otpResult = await authService.sendOTP(data.phone, data.email);
      
      if (otpResult.success) {
        setUserCredentials(data);
        setStep('otp');
        setOtpTimer(300); // 5 minutes
        setSuccess('OTP sent to your phone and email');
      } else {
        setError(otpResult.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and login
  const handleOTPSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      // Verify OTP
      const otpResult = await authService.verifyOTP(data.mobileOTP, data.emailOTP);
      
      if (otpResult.success) {
        // Login user after OTP verification
        const loginResult = await authService.loginWithOTP(userCredentials.emailOrId);
        
        if (loginResult.success) {
          setStep('success');
          setSuccess('Login successful! Redirecting...');
          setTimeout(() => {
            navigate('/admin/dashboard');
          }, 2000);
        } else {
          setError(loginResult.error || 'Login failed after OTP verification');
        }
      } else {
        setError(otpResult.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('OTP verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async () => {
    if (otpTimer > 0) return;
    
    setLoading(true);
    try {
      const result = await authService.sendOTP(userCredentials.phone, userCredentials.email);
      if (result.success) {
        setOtpTimer(300);
        setSuccess('OTP resent successfully');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(result.error || 'Failed to resend OTP');
      }
    } catch (err) {
      setError('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  // Go back to credentials step
  const handleGoBack = () => {
    setStep('credentials');
    setError('');
    setSuccess('');
    setUserCredentials(null);
    setOtpTimer(0);
    otpForm.reset();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg p-1 overflow-hidden">
              <img 
                src="/svg.svg" 
                alt="Dr. Gandhi's Dental Avenue" 
                className="w-10 h-10 object-cover rounded-full"
              />
            </div>
            <div className="text-white">
              <h1 className="text-2xl font-bold">Dental Avenue</h1>
              <p className="text-primary-200">Secure Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'credentials' ? 'bg-primary-600 text-white' : 
                step === 'otp' || step === 'success' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${
                step === 'otp' || step === 'success' ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'otp' ? 'bg-primary-600 text-white' : 
                step === 'success' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                2
              </div>
              <div className={`w-16 h-1 ${
                step === 'success' ? 'bg-green-500' : 'bg-gray-300'
              }`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step === 'success' ? 'bg-green-500 text-white' : 'bg-gray-300 text-gray-600'
              }`}>
                <FaShieldAlt size={12} />
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <FaExclamationTriangle className="text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-2">
              <FaCheckCircle className="text-green-500" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          {/* Step 1: Credentials Form */}
          {step === 'credentials' && (
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 text-center">Secure Login</h2>
                <p className="text-gray-600 text-center mt-2">Enter your credentials to receive OTP</p>
              </div>

              <form onSubmit={credentialsForm.handleSubmit(handleCredentialsSubmit)} className="space-y-6">
                {/* Email or User ID */}
                <div>
                  <label htmlFor="emailOrId" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address or User ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" size={16} />
                    </div>
                    <input
                      {...credentialsForm.register('emailOrId')}
                      id="emailOrId"
                      type="text"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="Enter your email or user ID"
                    />
                  </div>
                  {credentialsForm.formState.errors.emailOrId && (
                    <p className="mt-1 text-sm text-red-600">{credentialsForm.formState.errors.emailOrId.message}</p>
                  )}
                </div>

                {/* Phone Number */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400" size={16} />
                    </div>
                    <input
                      {...credentialsForm.register('phone')}
                      id="phone"
                      type="tel"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="+91 9876543210"
                    />
                  </div>
                  {credentialsForm.formState.errors.phone && (
                    <p className="mt-1 text-sm text-red-600">{credentialsForm.formState.errors.phone.message}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaEnvelope className="text-gray-400" size={16} />
                    </div>
                    <input
                      {...credentialsForm.register('email')}
                      id="email"
                      type="email"
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  {credentialsForm.formState.errors.email && (
                    <p className="mt-1 text-sm text-red-600">{credentialsForm.formState.errors.email.message}</p>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" size={16} />
                      Sending OTP...
                    </>
                  ) : (
                    'Send OTP'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <div>
              <div className="mb-6">
                <button
                  onClick={handleGoBack}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 mb-4"
                >
                  <FaArrowLeft size={14} />
                  <span>Back</span>
                </button>
                <h2 className="text-2xl font-bold text-gray-900 text-center">Enter OTP</h2>
                <p className="text-gray-600 text-center mt-2">
                  We've sent verification codes to your phone and email
                </p>
              </div>

              <form onSubmit={otpForm.handleSubmit(handleOTPSubmit)} className="space-y-6">
                {/* Mobile OTP */}
                <div>
                  <label htmlFor="mobileOTP" className="block text-sm font-medium text-gray-700 mb-2">
                    Mobile OTP
                  </label>
                  <input
                    {...otpForm.register('mobileOTP')}
                    id="mobileOTP"
                    type="text"
                    maxLength="6"
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-center text-lg font-mono"
                    placeholder="000000"
                  />
                  {otpForm.formState.errors.mobileOTP && (
                    <p className="mt-1 text-sm text-red-600">{otpForm.formState.errors.mobileOTP.message}</p>
                  )}
                </div>

                {/* Email OTP */}
                <div>
                  <label htmlFor="emailOTP" className="block text-sm font-medium text-gray-700 mb-2">
                    Email OTP
                  </label>
                  <input
                    {...otpForm.register('emailOTP')}
                    id="emailOTP"
                    type="text"
                    maxLength="6"
                    className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors text-center text-lg font-mono"
                    placeholder="000000"
                  />
                  {otpForm.formState.errors.emailOTP && (
                    <p className="mt-1 text-sm text-red-600">{otpForm.formState.errors.emailOTP.message}</p>
                  )}
                </div>

                {/* Timer and Resend */}
                <div className="text-center">
                  {otpTimer > 0 ? (
                    <p className="text-sm text-gray-600">
                      Resend OTP in {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={loading}
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" size={16} />
                      Verifying...
                    </>
                  ) : (
                    'Verify & Login'
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaCheckCircle className="text-green-500" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Successful!</h2>
              <p className="text-gray-600">Redirecting to admin dashboard...</p>
            </div>
          )}

          {/* Legacy Login Link */}
          {step === 'credentials' && (
            <div className="mt-6 text-center">
              <p className="text-xs text-gray-500 mb-2">Having trouble with OTP?</p>
              <a
                href="/admin/login-legacy"
                className="text-xs text-gray-400 hover:text-gray-600 underline"
              >
                Use Legacy Login
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPLogin;

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  FaEnvelope, 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaSpinner,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUserPlus
} from 'react-icons/fa';
import authService from '../../services/AuthService';
import SubAdminRegister from './SubAdminRegister';

const AdminLogin = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(
      z.object({
        emailOrId: z.string().min(1, 'Email or User ID is required'),
        password: z.string().min(8, 'Password must be at least 8 characters long')
      })
    )
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [forgotMessage, setForgotMessage] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if already authenticated
    if (authService.isAuthenticated()) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);


  const handleFormSubmit = async (data) => {
    setLoading(true);
    setError('');

    try {
      const result = await authService.login(data.emailOrId, data.password);
      
      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setForgotLoading(true);
    setForgotMessage('');

    try {
      const result = await authService.requestPasswordReset(forgotEmail);
      setForgotMessage(result.message);
      
      if (result.success) {
        setTimeout(() => {
          setShowForgotPassword(false);
          setForgotEmail('');
          setForgotMessage('');
        }, 3000);
      }
    } catch (err) {
    } finally {
      setForgotLoading(false);
    }
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
              <p className="text-primary-200">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 text-center">Sign In</h2>
            <p className="text-gray-600 text-center mt-2">Access your admin dashboard</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
              <FaExclamationTriangle className="text-red-500" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            {/* Email or User ID Field */}
            <div>
              <label htmlFor="emailOrId" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address or User ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400" size={16} />
                </div>
                <input
                  {...register('emailOrId')}
                  id="emailOrId"
                  type="text"
                  autoComplete="username"
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Enter your email or user ID"
                />
              </div>
              {errors.emailOrId && (
                <p className="mt-1 text-sm text-red-600">{errors.emailOrId.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400" size={16} />
                </div>
                <input
                  {...register('password')}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <FaEyeSlash className="text-gray-400 hover:text-gray-600" size={16} />
                  ) : (
                    <FaEye className="text-gray-400 hover:text-gray-600" size={16} />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
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
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Forgot Password Link */}
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowForgotPassword(true)}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              Forgot your password?
            </button>
          </div>

          {/* Registration Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Need sub admin access?
            </p>
            <button
              type="button"
              onClick={() => setShowRegister(true)}
              className="inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              <FaUserPlus size={16} />
              <span>Register as Sub Admin</span>
            </button>
          </div>

        </div>

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Reset Password</h3>
              
              {forgotMessage ? (
                <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-center space-x-2">
                  <FaCheckCircle className="text-blue-500" />
                  <span className="text-blue-700 text-sm">{forgotMessage}</span>
                </div>
              ) : (
                <>
                  <p className="text-gray-600 mb-4 text-sm">
                    Enter your email address and we'll send you instructions to reset your password.
                  </p>
                  
                  <form onSubmit={handleForgotPassword}>
                    <div className="mb-4">
                      <label htmlFor="forgotEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address
                      </label>
                      <input
                        id="forgotEmail"
                        type="email"
                        required
                        value={forgotEmail}
                        onChange={(e) => setForgotEmail(e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        placeholder="Enter your email"
                      />
                    </div>
                    
                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(false);
                          setForgotEmail('');
                          setForgotMessage('');
                        }}
                        className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={forgotLoading}
                        className="flex-1 py-2 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                      >
                        {forgotLoading ? 'Sending...' : 'Send Reset'}
                      </button>
                    </div>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Sub Admin Registration */}
      {showRegister && (
        <SubAdminRegister onBack={() => setShowRegister(false)} />
      )}
    </div>
  );
};

export default AdminLogin;

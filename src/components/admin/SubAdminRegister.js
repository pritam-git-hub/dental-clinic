import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaShieldAlt,
  FaCheck,
  FaTimes,
  FaSpinner
} from 'react-icons/fa';
import authService from '../../services/AuthService';

// Validation schema
const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  department: z.string().min(1, 'Please select a department'),
  permissions: z.array(z.string()).min(1, 'Please select at least one permission')
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const SubAdminRegister = ({ onBack }) => {
  const [step, setStep] = useState(1); // 1: Form, 2: OTP, 3: Success
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [formData, setFormData] = useState(null);
  const [otpData, setOtpData] = useState({
    mobileOTP: '',
    emailOTP: ''
  });

  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const departments = [
    'Reception & Patient Care',
    'Clinical Operations',
    'Marketing & Communications',
    'Finance & Administration',
    'Technical Support'
  ];

  const availablePermissions = [
    { id: 'appointments', label: 'Manage Appointments' },
    { id: 'patients', label: 'Manage Patients' },
    { id: 'services', label: 'Manage Services' },
    { id: 'doctors', label: 'Manage Doctors' },
    { id: 'content', label: 'Manage Website Content' },
    { id: 'analytics', label: 'View Analytics' },
    { id: 'feedback', label: 'Manage Feedback' }
  ];

  const password = watch('password');

  const getPasswordStrength = (password) => {
    if (!password) return null;
    return authService.validatePassword(password);
  };

  const passwordValidation = getPasswordStrength(password);

  const onSubmit = async (data) => {
    setLoading(true);
    setFormData(data);
    
    try {
      // Send OTP to phone and email
      const result = await authService.sendOTP(data.phone, data.email);
      
      if (result.success) {
        setOtpSent(true);
        setStep(2);
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerification = async () => {
    setLoading(true);
    
    try {
      const otpResult = await authService.verifyOTP(otpData.mobileOTP, otpData.emailOTP);
      
      if (otpResult.success) {
        // Register the sub admin
        const registerResult = await authService.registerSubAdmin(formData);
        
        if (registerResult.success) {
          setStep(3);
        } else {
          alert(registerResult.error);
        }
      } else {
        alert(otpResult.error);
      }
    } catch (error) {
      alert('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resendOTP = async () => {
    if (!formData) return;
    
    setLoading(true);
    try {
      const result = await authService.sendOTP(formData.phone, formData.email);
      if (result.success) {
        alert('OTP resent successfully');
      } else {
        alert(result.error);
      }
    } catch (error) {
      alert('Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  if (step === 3) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheck className="text-green-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-4">Registration Submitted!</h2>
            <p className="text-neutral-600 mb-6">
              Your sub admin registration has been submitted successfully. 
              You will receive an email notification once the super admin approves your account.
            </p>
            <button
              onClick={onBack}
              className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-2xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaShieldAlt className="text-primary-600" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Verify OTP</h2>
              <p className="text-neutral-600">
                Enter the OTP sent to your mobile and email
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Mobile OTP (sent to {formData?.phone})
                </label>
                <input
                  type="text"
                  maxLength="6"
                  value={otpData.mobileOTP}
                  onChange={(e) => setOtpData(prev => ({ ...prev, mobileOTP: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-lg font-mono"
                  placeholder="000000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email OTP (sent to {formData?.email})
                </label>
                <input
                  type="text"
                  maxLength="6"
                  value={otpData.emailOTP}
                  onChange={(e) => setOtpData(prev => ({ ...prev, emailOTP: e.target.value }))}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-center text-lg font-mono"
                  placeholder="000000"
                />
              </div>

              <button
                onClick={handleOTPVerification}
                disabled={loading || !otpData.mobileOTP || !otpData.emailOTP}
                className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify & Register</span>
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={resendOTP}
                  disabled={loading}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Resend OTP
                </button>
              </div>

              <button
                onClick={() => setStep(1)}
                className="w-full text-neutral-600 hover:text-neutral-800 py-2 text-sm"
              >
                Back to Form
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-500 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUser className="text-primary-600" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Sub Admin Registration</h2>
            <p className="text-neutral-600">
              Fill in your details to request sub admin access
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Full Name *
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                  <input
                    {...register('name')}
                    type="text"
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                  <input
                    {...register('phone')}
                    type="tel"
                    className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Department *
                </label>
                <select
                  {...register('department')}
                  className="w-full px-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
                {errors.department && (
                  <p className="mt-1 text-sm text-red-600">{errors.department.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-3">
                Permissions Requested *
              </label>
              <div className="grid md:grid-cols-2 gap-3">
                {availablePermissions.map(permission => (
                  <label key={permission.id} className="flex items-center space-x-3 p-3 border border-neutral-200 rounded-lg hover:bg-neutral-50 cursor-pointer">
                    <input
                      {...register('permissions')}
                      type="checkbox"
                      value={permission.id}
                      className="w-4 h-4 text-primary-600 border-neutral-300 rounded focus:ring-primary-500"
                    />
                    <span className="text-sm text-neutral-700">{permission.label}</span>
                  </label>
                ))}
              </div>
              {errors.permissions && (
                <p className="mt-1 text-sm text-red-600">{errors.permissions.message}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                  <input
                    {...register('password')}
                    type={showPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Create password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
                {passwordValidation && (
                  <div className="mt-2 space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${passwordValidation.strength === 'weak' ? 'bg-red-500' : passwordValidation.strength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'}`}></div>
                      <span className="text-xs text-neutral-600 capitalize">{passwordValidation.strength} password</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={16} />
                  <input
                    {...register('confirmPassword')}
                    type={showConfirmPassword ? 'text' : 'password'}
                    className="w-full pl-10 pr-12 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                  >
                    {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 bg-neutral-200 text-neutral-700 py-3 px-4 rounded-lg hover:bg-neutral-300 transition-colors font-medium"
              >
                Back to Login
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    <span>Sending OTP...</span>
                  </>
                ) : (
                  <span>Send OTP & Continue</span>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubAdminRegister;

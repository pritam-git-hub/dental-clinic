import smsService from './SMSService.js';
import emailService from './EmailService.js';

// Comprehensive OTP Service that handles both SMS and Email
class OTPService {
  constructor() {
    this.otpLength = 6;
    this.otpExpiry = parseInt(process.env.REACT_APP_OTP_EXPIRY_MINUTES || '5') * 60 * 1000; // 5 minutes
    this.maxAttempts = 3;
    this.resendCooldown = 60 * 1000; // 1 minute
  }

  // Generate OTP
  generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Send OTP to both phone and email
  async sendDualOTP(phone, email, userName = 'Admin') {
    try {
      const mobileOTP = this.generateOTP();
      const emailOTP = this.generateOTP();
      const timestamp = Date.now();

      // Store OTPs temporarily
      const otpData = {
        mobile: { 
          otp: mobileOTP, 
          phone, 
          timestamp,
          attempts: 0
        },
        email: { 
          otp: emailOTP, 
          email, 
          timestamp,
          attempts: 0
        },
        userName,
        sessionId: this.generateSessionId()
      };

      localStorage.setItem('tempOTP', JSON.stringify(otpData));

      // Send SMS and Email concurrently
      const [smsResult, emailResult] = await Promise.allSettled([
        smsService.sendCustomOTP(phone, mobileOTP),
        emailService.sendOTP(email, emailOTP, userName)
      ]);

      // Check results
      const smsSuccess = smsResult.status === 'fulfilled' && smsResult.value.success;
      const emailSuccess = emailResult.status === 'fulfilled' && emailResult.value.success;

      let message = '';
      let warnings = [];

      if (smsSuccess && emailSuccess) {
        message = 'OTP sent to both phone and email successfully';
      } else if (smsSuccess) {
        message = 'OTP sent to phone successfully';
        warnings.push('Email delivery failed: ' + (emailResult.value?.error || 'Unknown error'));
      } else if (emailSuccess) {
        message = 'OTP sent to email successfully';
        warnings.push('SMS delivery failed: ' + (smsResult.value?.error || 'Unknown error'));
      } else {
        throw new Error('Failed to send OTP to both phone and email');
      }

      return {
        success: true,
        message,
        warnings,
        services: {
          sms: smsSuccess,
          email: emailSuccess
        },
        sessionId: otpData.sessionId,
        expiresAt: new Date(timestamp + this.otpExpiry).toISOString()
      };

    } catch (error) {
      console.error('OTP Service Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send OTP'
      };
    }
  }

  // Verify dual OTP
  async verifyDualOTP(mobileOTP, emailOTP, sessionId = null) {
    try {
      const otpData = localStorage.getItem('tempOTP');
      if (!otpData) {
        return { success: false, error: 'OTP session expired or not found' };
      }

      const { mobile, email, sessionId: storedSessionId } = JSON.parse(otpData);
      const now = Date.now();

      // Verify session ID if provided
      if (sessionId && sessionId !== storedSessionId) {
        return { success: false, error: 'Invalid session' };
      }

      // Check if OTP is expired
      if (now - mobile.timestamp > this.otpExpiry || now - email.timestamp > this.otpExpiry) {
        localStorage.removeItem('tempOTP');
        return { success: false, error: 'OTP expired' };
      }

      // Check attempts
      if (mobile.attempts >= this.maxAttempts || email.attempts >= this.maxAttempts) {
        localStorage.removeItem('tempOTP');
        return { success: false, error: 'Maximum verification attempts exceeded' };
      }

      // Verify both OTPs
      const mobileValid = mobile.otp === mobileOTP;
      const emailValid = email.otp === emailOTP;

      if (mobileValid && emailValid) {
        localStorage.removeItem('tempOTP');
        
        // Log successful verification
        this.logVerification(mobile.phone, email.email, true);
        
        return {
          success: true,
          message: 'OTP verified successfully',
          verifiedServices: ['sms', 'email']
        };
      } else {
        // Increment attempts
        const updatedData = JSON.parse(otpData);
        if (!mobileValid) updatedData.mobile.attempts++;
        if (!emailValid) updatedData.email.attempts++;
        
        localStorage.setItem('tempOTP', JSON.stringify(updatedData));
        
        // Log failed verification
        this.logVerification(mobile.phone, email.email, false);

        let errorMessage = 'Invalid OTP';
        if (!mobileValid && !emailValid) {
          errorMessage = 'Both mobile and email OTPs are invalid';
        } else if (!mobileValid) {
          errorMessage = 'Mobile OTP is invalid';
        } else if (!emailValid) {
          errorMessage = 'Email OTP is invalid';
        }

        const attemptsLeft = Math.min(
          this.maxAttempts - updatedData.mobile.attempts,
          this.maxAttempts - updatedData.email.attempts
        );

        return {
          success: false,
          error: errorMessage,
          attemptsLeft,
          details: {
            mobileValid,
            emailValid,
            mobileAttempts: updatedData.mobile.attempts,
            emailAttempts: updatedData.email.attempts
          }
        };
      }
    } catch (error) {
      console.error('OTP Verification Error:', error);
      return {
        success: false,
        error: 'Verification failed. Please try again.'
      };
    }
  }

  // Resend OTP
  async resendOTP() {
    try {
      const otpData = localStorage.getItem('tempOTP');
      if (!otpData) {
        return { success: false, error: 'No active OTP session found' };
      }

      const { mobile, email, userName } = JSON.parse(otpData);
      const now = Date.now();

      // Check cooldown
      if (now - mobile.timestamp < this.resendCooldown) {
        const remainingTime = Math.ceil((this.resendCooldown - (now - mobile.timestamp)) / 1000);
        return {
          success: false,
          error: `Please wait ${remainingTime} seconds before requesting a new OTP`
        };
      }

      // Send new OTP
      return await this.sendDualOTP(mobile.phone, email.email, userName);
    } catch (error) {
      console.error('OTP Resend Error:', error);
      return {
        success: false,
        error: 'Failed to resend OTP'
      };
    }
  }

  // Get OTP status
  getOTPStatus() {
    try {
      const otpData = localStorage.getItem('tempOTP');
      if (!otpData) {
        return { active: false };
      }

      const { mobile, email, sessionId } = JSON.parse(otpData);
      const now = Date.now();
      const timeLeft = this.otpExpiry - (now - mobile.timestamp);

      if (timeLeft <= 0) {
        localStorage.removeItem('tempOTP');
        return { active: false, expired: true };
      }

      return {
        active: true,
        timeLeft: Math.ceil(timeLeft / 1000),
        timeLeftFormatted: this.formatTime(timeLeft),
        attempts: {
          mobile: mobile.attempts,
          email: email.attempts,
          maxAttempts: this.maxAttempts
        },
        sessionId,
        canResend: (now - mobile.timestamp) >= this.resendCooldown,
        resendCooldown: Math.max(0, this.resendCooldown - (now - mobile.timestamp))
      };
    } catch (error) {
      return { active: false, error: true };
    }
  }

  // Generate session ID
  generateSessionId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Format time remaining
  formatTime(milliseconds) {
    const minutes = Math.floor(milliseconds / 60000);
    const seconds = Math.floor((milliseconds % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  // Log verification attempts (for security monitoring)
  logVerification(phone, email, success) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      phone: phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2'), // Mask phone number
      email: email.replace(/(.{2}).*(@.*)/, '$1****$2'), // Mask email
      success,
      userAgent: navigator.userAgent,
      ip: 'client-side' // In production, get from server
    };

    // Store in localStorage for demo (in production, send to server)
    const logs = JSON.parse(localStorage.getItem('otpLogs') || '[]');
    logs.push(logEntry);
    
    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    
    localStorage.setItem('otpLogs', JSON.stringify(logs));
  }

  // Get verification logs (for admin monitoring)
  getVerificationLogs() {
    return JSON.parse(localStorage.getItem('otpLogs') || '[]');
  }

  // Clear OTP session
  clearOTPSession() {
    localStorage.removeItem('tempOTP');
  }

  // Get service status
  getServiceStatus() {
    return {
      sms: smsService.getStatus(),
      email: emailService.getStatus(),
      otp: {
        length: this.otpLength,
        expiryMinutes: this.otpExpiry / 60000,
        maxAttempts: this.maxAttempts,
        resendCooldownSeconds: this.resendCooldown / 1000
      }
    };
  }

  // Test all services
  async testServices() {
    const [smsTest, emailTest] = await Promise.allSettled([
      smsService.sendDemoSMS('+91 9876543210', '123456'),
      emailService.sendDemoEmail('test@example.com', '654321')
    ]);

    return {
      sms: {
        success: smsTest.status === 'fulfilled' && smsTest.value.success,
        error: smsTest.status === 'rejected' ? smsTest.reason.message : smsTest.value?.error
      },
      email: {
        success: emailTest.status === 'fulfilled' && emailTest.value.success,
        error: emailTest.status === 'rejected' ? emailTest.reason.message : emailTest.value?.error
      }
    };
  }
}

// Create singleton instance
const otpService = new OTPService();
export default otpService;

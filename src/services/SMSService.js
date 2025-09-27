// SMS Service using Twilio
class SMSService {
  constructor() {
    // Twilio configuration (will be set from environment variables)
    this.accountSid = process.env.REACT_APP_TWILIO_ACCOUNT_SID;
    this.authToken = process.env.REACT_APP_TWILIO_AUTH_TOKEN;
    this.fromNumber = process.env.REACT_APP_TWILIO_PHONE_NUMBER;
    this.serviceSid = process.env.REACT_APP_TWILIO_VERIFY_SERVICE_SID;
    
    // Fallback configuration for demo
    this.isDemoMode = !this.accountSid || !this.authToken;
  }

  // Send SMS using Twilio Verify API (recommended for OTP)
  async sendOTPVerify(phoneNumber, otp) {
    if (this.isDemoMode) {
      return this.sendDemoSMS(phoneNumber, otp);
    }

    try {
      // Using Twilio Verify Service (handles OTP generation and validation)
      const response = await fetch(`https://verify.twilio.com/v2/Services/${this.serviceSid}/Verifications`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.accountSid}:${this.authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: phoneNumber,
          Channel: 'sms'
        })
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: 'OTP sent successfully',
          sid: data.sid
        };
      } else {
        throw new Error(data.message || 'Failed to send SMS');
      }
    } catch (error) {
      console.error('SMS Service Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send SMS'
      };
    }
  }

  // Send SMS using Twilio Messages API (custom OTP)
  async sendCustomOTP(phoneNumber, otp) {
    if (this.isDemoMode) {
      return this.sendDemoSMS(phoneNumber, otp);
    }

    try {
      const message = `Your Dr. Gandhi's Dental Avenue admin login OTP is: ${otp}. Valid for 5 minutes. Do not share this code.`;
      
      const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.accountSid}:${this.authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          From: this.fromNumber,
          To: phoneNumber,
          Body: message
        })
      });

      const data = await response.json();

      if (response.ok) {
        return {
          success: true,
          message: 'OTP sent successfully',
          sid: data.sid
        };
      } else {
        throw new Error(data.message || 'Failed to send SMS');
      }
    } catch (error) {
      console.error('SMS Service Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send SMS'
      };
    }
  }

  // Verify OTP using Twilio Verify API
  async verifyOTP(phoneNumber, otp) {
    if (this.isDemoMode) {
      return this.verifyDemoOTP(phoneNumber, otp);
    }

    try {
      const response = await fetch(`https://verify.twilio.com/v2/Services/${this.serviceSid}/VerificationCheck`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${btoa(`${this.accountSid}:${this.authToken}`)}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          To: phoneNumber,
          Code: otp
        })
      });

      const data = await response.json();

      if (response.ok && data.status === 'approved') {
        return {
          success: true,
          message: 'OTP verified successfully'
        };
      } else {
        return {
          success: false,
          error: 'Invalid or expired OTP'
        };
      }
    } catch (error) {
      console.error('SMS Verification Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to verify OTP'
      };
    }
  }

  // Demo mode SMS (for development/testing)
  sendDemoSMS(phoneNumber, otp) {
    console.log(`📱 Demo SMS to ${phoneNumber}: Your OTP is ${otp}`);
    
    // Show in browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Demo SMS Sent', {
        body: `OTP ${otp} sent to ${phoneNumber}`,
        icon: '/svg.svg'
      });
    }
    
    return Promise.resolve({
      success: true,
      message: `Demo SMS sent to ${phoneNumber}`,
      demo: true
    });
  }

  // Demo mode OTP verification
  verifyDemoOTP(phoneNumber, otp) {
    // In demo mode, we'll use the localStorage OTP verification
    const otpData = localStorage.getItem('tempOTP');
    if (!otpData) {
      return Promise.resolve({
        success: false,
        error: 'OTP expired or not found'
      });
    }

    const { mobile } = JSON.parse(otpData);
    const now = Date.now();

    if (now - mobile.timestamp > 300000) {
      return Promise.resolve({
        success: false,
        error: 'OTP expired'
      });
    }

    if (mobile.otp === otp) {
      return Promise.resolve({
        success: true,
        message: 'Demo OTP verified successfully'
      });
    }

    return Promise.resolve({
      success: false,
      error: 'Invalid OTP'
    });
  }

  // Check if service is configured
  isConfigured() {
    return !this.isDemoMode;
  }

  // Get service status
  getStatus() {
    return {
      configured: this.isConfigured(),
      demoMode: this.isDemoMode,
      service: 'Twilio',
      hasAccountSid: !!this.accountSid,
      hasAuthToken: !!this.authToken,
      hasFromNumber: !!this.fromNumber,
      hasServiceSid: !!this.serviceSid
    };
  }
}

// Create singleton instance
const smsService = new SMSService();
export default smsService;

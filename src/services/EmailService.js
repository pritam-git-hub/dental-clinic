// Email Service using EmailJS
class EmailService {
  constructor() {
    // EmailJS configuration (will be set from environment variables)
    this.serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID;
    this.templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
    this.publicKey = process.env.REACT_APP_EMAILJS_PUBLIC_KEY;
    this.privateKey = process.env.REACT_APP_EMAILJS_PRIVATE_KEY;
    
    // Fallback configuration for demo
    this.isDemoMode = !this.serviceId || !this.templateId || !this.publicKey;
    
    // Initialize EmailJS if configured
    if (!this.isDemoMode) {
      this.initializeEmailJS();
    }
  }

  // Initialize EmailJS
  async initializeEmailJS() {
    try {
      // Dynamically import EmailJS
      const emailjs = await import('@emailjs/browser');
      this.emailjs = emailjs.default;
      
      // Initialize with public key
      this.emailjs.init(this.publicKey);
      
      console.log('EmailJS initialized successfully');
    } catch (error) {
      console.error('Failed to initialize EmailJS:', error);
      this.isDemoMode = true;
    }
  }

  // Send OTP email
  async sendOTP(email, otp, userName = 'Admin') {
    if (this.isDemoMode) {
      return this.sendDemoEmail(email, otp);
    }

    try {
      // Ensure EmailJS is loaded
      if (!this.emailjs) {
        await this.initializeEmailJS();
      }

      const templateParams = {
        to_email: email,
        to_name: userName,
        otp_code: otp,
        clinic_name: "Dr. Gandhi's Dental Avenue",
        validity_minutes: '5',
        current_time: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        support_email: 'admin@dentalavenue.com',
        support_phone: '+91 9051864455'
      };

      const response = await this.emailjs.send(
        this.serviceId,
        this.templateId,
        templateParams
      );

      if (response.status === 200) {
        return {
          success: true,
          message: 'OTP email sent successfully',
          messageId: response.text
        };
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Email Service Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email'
      };
    }
  }

  // Send custom email (for other purposes)
  async sendCustomEmail(to, subject, htmlContent, textContent) {
    if (this.isDemoMode) {
      return this.sendDemoCustomEmail(to, subject, htmlContent);
    }

    try {
      if (!this.emailjs) {
        await this.initializeEmailJS();
      }

      const templateParams = {
        to_email: to,
        subject: subject,
        html_content: htmlContent,
        text_content: textContent || htmlContent.replace(/<[^>]*>/g, ''),
        clinic_name: "Dr. Gandhi's Dental Avenue",
        current_time: new Date().toLocaleString('en-IN', {
          timeZone: 'Asia/Kolkata'
        })
      };

      const response = await this.emailjs.send(
        this.serviceId,
        'custom_template', // You'll need to create this template
        templateParams
      );

      if (response.status === 200) {
        return {
          success: true,
          message: 'Email sent successfully',
          messageId: response.text
        };
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Email Service Error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email'
      };
    }
  }

  // Send password reset email
  async sendPasswordReset(email, resetToken, userName = 'Admin') {
    const resetLink = `${window.location.origin}/admin/reset-password?token=${resetToken}`;
    
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">Dr. Gandhi's Dental Avenue</h1>
            <p style="color: #6b7280; margin: 5px 0 0 0;">Admin Portal</p>
          </div>
          
          <h2 style="color: #1f2937; margin-bottom: 20px;">Password Reset Request</h2>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            Hello ${userName},
          </p>
          
          <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
            We received a request to reset your password for your admin account. Click the button below to reset your password:
          </p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetLink}" 
               style="background-color: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
              Reset Password
            </a>
          </div>
          
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">
            If the button doesn't work, copy and paste this link into your browser:
          </p>
          <p style="color: #2563eb; font-size: 14px; word-break: break-all; margin-bottom: 20px;">
            ${resetLink}
          </p>
          
          <p style="color: #ef4444; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
            <strong>Security Notice:</strong> This link will expire in 1 hour. If you didn't request this reset, please ignore this email.
          </p>
          
          <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
            <p style="color: #6b7280; font-size: 12px; margin: 0;">
              If you need help, contact us at admin@dentalavenue.com or +91 9051864455
            </p>
          </div>
        </div>
      </div>
    `;

    return this.sendCustomEmail(email, 'Password Reset - Dr. Gandhi\'s Dental Avenue', htmlContent);
  }

  // Demo mode email (for development/testing)
  sendDemoEmail(email, otp) {
    console.log(`📧 Demo Email to ${email}: Your OTP is ${otp}`);
    
    // Show in browser notification if supported
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Demo Email Sent', {
        body: `OTP ${otp} sent to ${email}`,
        icon: '/svg.svg'
      });
    }
    
    // Create a mock email preview
    const emailPreview = `
      📧 Email Preview:
      To: ${email}
      Subject: Your Admin Login OTP - Dr. Gandhi's Dental Avenue
      
      Hello Admin,
      
      Your OTP for admin login is: ${otp}
      
      This code is valid for 5 minutes.
      
      Best regards,
      Dr. Gandhi's Dental Avenue Team
    `;
    
    console.log(emailPreview);
    
    return Promise.resolve({
      success: true,
      message: `Demo email sent to ${email}`,
      demo: true,
      preview: emailPreview
    });
  }

  // Demo mode custom email
  sendDemoCustomEmail(to, subject, content) {
    console.log(`📧 Demo Custom Email to ${to}: ${subject}`);
    
    return Promise.resolve({
      success: true,
      message: `Demo custom email sent to ${to}`,
      demo: true
    });
  }

  // Request notification permission
  async requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return Notification.permission === 'granted';
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
      service: 'EmailJS',
      hasServiceId: !!this.serviceId,
      hasTemplateId: !!this.templateId,
      hasPublicKey: !!this.publicKey,
      notificationPermission: 'Notification' in window ? Notification.permission : 'not-supported'
    };
  }

  // Test email configuration
  async testConfiguration() {
    if (this.isDemoMode) {
      return {
        success: true,
        message: 'Demo mode - configuration test passed',
        demo: true
      };
    }

    try {
      // Send a test email to verify configuration
      const testResult = await this.sendOTP('test@example.com', '123456', 'Test User');
      return {
        success: testResult.success,
        message: testResult.success ? 'Email configuration test passed' : testResult.error,
        configured: true
      };
    } catch (error) {
      return {
        success: false,
        message: 'Email configuration test failed: ' + error.message,
        configured: false
      };
    }
  }
}

// Create singleton instance
const emailService = new EmailService();
export default emailService;

# OTP Authentication Setup Guide
## Dr. Gandhi's Dental Avenue - Complete Implementation

This guide will help you set up the complete OTP authentication system with real SMS and Email delivery.

## 🚀 Quick Start (Demo Mode)

The system is already configured to work in demo mode. You can test it immediately:

1. **Start the application:**
   ```bash
   npm start
   ```

2. **Navigate to:** `http://localhost:3000/admin/login`

3. **Test with demo credentials:**
   - Email/ID: `pg13000122017` or `admin@dentalavenue.com`
   - Phone: Any valid format (e.g., `+91 9876543210`)
   - Email: Any valid email address

4. **Demo OTPs will be shown in:**
   - Browser alert popup
   - Browser console
   - Browser notifications (if permitted)

## 📧 EmailJS Setup (Email OTP)

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Create Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions
5. **Copy the Service ID** (e.g., `service_abc123`)

### Step 3: Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template content:

**Subject:** `Your Admin Login OTP - {{clinic_name}}`

**HTML Content:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
  <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
    <div style="text-align: center; margin-bottom: 30px;">
      <h1 style="color: #2563eb; margin: 0;">{{clinic_name}}</h1>
      <p style="color: #6b7280; margin: 5px 0 0 0;">Admin Portal</p>
    </div>
    
    <h2 style="color: #1f2937; margin-bottom: 20px;">Your Login OTP</h2>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
      Hello {{to_name}},
    </p>
    
    <p style="color: #4b5563; line-height: 1.6; margin-bottom: 20px;">
      Your OTP for admin login is:
    </p>
    
    <div style="text-align: center; margin: 30px 0;">
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; display: inline-block;">
        <span style="font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 5px;">{{otp_code}}</span>
      </div>
    </div>
    
    <p style="color: #ef4444; font-size: 14px; line-height: 1.6; margin-bottom: 20px;">
      <strong>Important:</strong> This code is valid for {{validity_minutes}} minutes only. Do not share this code with anyone.
    </p>
    
    <p style="color: #6b7280; font-size: 14px; line-height: 1.6; margin-bottom: 10px;">
      Request Time: {{current_time}}
    </p>
    
    <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
      <p style="color: #6b7280; font-size: 12px; margin: 0;">
        If you need help, contact us at {{support_email}} or {{support_phone}}
      </p>
    </div>
  </div>
</div>
```

4. **Copy the Template ID** (e.g., `template_xyz789`)

### Step 4: Get API Keys
1. Go to **Account** → **General**
2. **Copy the Public Key** (e.g., `user_abc123xyz`)
3. **Copy the Private Key** (e.g., `private_key_123`)

## 📱 Twilio Setup (SMS OTP)

### Step 1: Create Twilio Account
1. Go to [Twilio.com](https://www.twilio.com/)
2. Sign up for a free account
3. Verify your phone number

### Step 2: Get Account Credentials
1. In Twilio Console Dashboard
2. **Copy Account SID** (e.g., `ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)
3. **Copy Auth Token** (e.g., `your_auth_token_here`)

### Step 3: Get Phone Number
1. Go to **Phone Numbers** → **Manage** → **Buy a number**
2. Choose a number with SMS capability
3. **Copy the Phone Number** (e.g., `+1234567890`)

### Step 4: Create Verify Service (Recommended)
1. Go to **Verify** → **Services**
2. Click **Create new Verify Service**
3. Enter service name: "Dr Gandhi's Dental Avenue OTP"
4. **Copy the Service SID** (e.g., `VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`)

## ⚙️ Environment Configuration

### Step 1: Create Environment File
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

### Step 2: Fill in Your Credentials
Edit the `.env` file with your actual credentials:

```env
# Twilio SMS Configuration
REACT_APP_TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
REACT_APP_TWILIO_AUTH_TOKEN=your_auth_token_here
REACT_APP_TWILIO_PHONE_NUMBER=+1234567890
REACT_APP_TWILIO_VERIFY_SERVICE_SID=VAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# EmailJS Configuration  
REACT_APP_EMAILJS_SERVICE_ID=service_abc123
REACT_APP_EMAILJS_TEMPLATE_ID=template_xyz789
REACT_APP_EMAILJS_PUBLIC_KEY=user_abc123xyz
REACT_APP_EMAILJS_PRIVATE_KEY=private_key_123

# Application Configuration
REACT_APP_CLINIC_NAME="Dr. Gandhi's Dental Avenue"
REACT_APP_SUPPORT_EMAIL=admin@dentalavenue.com
REACT_APP_SUPPORT_PHONE=+919051864455

# Set to false for production
REACT_APP_DEMO_MODE=false
```

## 📦 Install Dependencies

```bash
npm install @emailjs/browser
```

## 🧪 Testing the Setup

### Step 1: Test Demo Mode
```bash
npm start
```
Navigate to `/admin/login` and test with demo credentials.

### Step 2: Test Production Mode
1. Set `REACT_APP_DEMO_MODE=false` in `.env`
2. Restart the application
3. Test with real phone number and email

### Step 3: Service Status Check
Add this to your admin dashboard to check service status:

```javascript
import otpService from '../services/OTPService';

// Check service status
const status = otpService.getServiceStatus();
console.log('OTP Service Status:', status);

// Test services
const testResults = await otpService.testServices();
console.log('Service Test Results:', testResults);
```

## 🔧 Troubleshooting

### Common Issues:

1. **SMS not sending:**
   - Check Twilio account balance
   - Verify phone number format (+country_code)
   - Check Twilio console for error logs

2. **Email not sending:**
   - Verify EmailJS service configuration
   - Check email template variables
   - Ensure email service is active

3. **Environment variables not loading:**
   - Restart the development server
   - Check `.env` file location (root directory)
   - Ensure variables start with `REACT_APP_`

4. **CORS errors:**
   - EmailJS: Check allowed domains in EmailJS dashboard
   - Twilio: Requests are made server-side, no CORS issues

### Debug Mode:
Set `REACT_APP_DEBUG_MODE=true` in `.env` for detailed logging.

## 🚀 Production Deployment

### Security Considerations:
1. **Never expose private keys** in client-side code
2. **Use environment variables** for all sensitive data
3. **Implement rate limiting** for OTP requests
4. **Monitor failed attempts** for security

### Recommended Production Setup:
1. **Move Twilio calls to backend** for better security
2. **Implement IP-based rate limiting**
3. **Add CAPTCHA** for additional security
4. **Set up monitoring** for failed OTP attempts

## 📊 Monitoring & Analytics

### Built-in Logging:
- OTP verification attempts are logged locally
- Access logs via: `otpService.getVerificationLogs()`

### Production Monitoring:
- Set up alerts for high failure rates
- Monitor OTP delivery success rates
- Track authentication patterns

## 🆘 Support

### Demo Credentials for Testing:
- **Super Admin ID:** `pg13000122017`
- **Legacy Admin Email:** `admin@dentalavenue.com`
- **Test Phone:** Any valid format
- **Test Email:** Any valid email address

### Service Limits:
- **Twilio Free Tier:** $15 credit (~500 SMS)
- **EmailJS Free Tier:** 200 emails/month
- **OTP Expiry:** 5 minutes (configurable)
- **Max Attempts:** 3 per OTP session

### Need Help?
1. Check browser console for errors
2. Verify all environment variables are set
3. Test in demo mode first
4. Check service provider dashboards for delivery status

---

## 🎉 You're All Set!

Your OTP authentication system is now ready for production use with real SMS and Email delivery!

**Next Steps:**
1. Test thoroughly in demo mode
2. Configure your service providers
3. Update environment variables
4. Deploy to production
5. Monitor and optimize

**Security Note:** Always keep your API keys secure and never commit them to version control!

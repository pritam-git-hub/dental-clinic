// AuthService - Handle authentication and session management
// Currently uses localStorage, can be replaced with backend API later

class AuthService {
  constructor() {
    this.sessionTimeout = 30 * 60 * 1000; // 30 minutes
    // Remove automatic session checking to prevent unwanted redirects
  }

  // Admin credentials (in production, this would be in backend)
  adminCredentials = {
    superAdmin: {
      id: 'pg13000122017',
      password: 'pg13000122017',
      name: 'Super Admin',
      role: 'super_admin',
      email: 'superadmin@dentalavenue.com'
    },
    // Legacy admin for backward compatibility
    admin: {
      email: 'admin@dentalavenue.com',
      password: 'Admin@123456',
      name: 'Admin User',
      role: 'admin',
      id: 'admin-1'
    }
  };

  // Password validation
  validatePassword(password) {
    const rules = {
      minLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    const score = Object.values(rules).filter(Boolean).length;
    const strength = score <= 2 ? 'weak' : score <= 4 ? 'medium' : 'strong';

    return {
      isValid: Object.values(rules).every(Boolean),
      rules,
      strength,
      score
    };
  }

  // Login - supports both super admin and sub admin
  async login(emailOrId, password) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      let user = null;

      // Check super admin credentials (both ID and email)
      if ((emailOrId === this.adminCredentials.superAdmin.id || emailOrId === this.adminCredentials.superAdmin.email) && 
          password === this.adminCredentials.superAdmin.password) {
        user = {
          id: this.adminCredentials.superAdmin.id,
          email: this.adminCredentials.superAdmin.email,
          name: this.adminCredentials.superAdmin.name,
          role: this.adminCredentials.superAdmin.role,
          avatar: null
        };

        const token = this.generateToken(user);
        const session = {
          user,
          token,
          loginTime: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        };

        localStorage.setItem('adminSession', JSON.stringify(session));
        this.startSessionTimer();

        return { success: true, user, token };
      }

      // Check legacy admin credentials (both email and ID)
      if ((emailOrId === this.adminCredentials.admin.email || emailOrId === this.adminCredentials.admin.id) && 
          password === this.adminCredentials.admin.password) {
        user = {
          id: this.adminCredentials.admin.id,
          email: this.adminCredentials.admin.email,
          name: this.adminCredentials.admin.name,
          role: this.adminCredentials.admin.role,
          avatar: null
        };

        const token = this.generateToken(user);
        const session = {
          user,
          token,
          loginTime: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        };

        localStorage.setItem('adminSession', JSON.stringify(session));
        this.startSessionTimer();

        return { success: true, user, token };
      }

      // Check additional super admins
      const additionalSuperAdmins = localStorage.getItem('superAdmins');
      if (additionalSuperAdmins) {
        const superAdmins = JSON.parse(additionalSuperAdmins);
        const superAdmin = superAdmins.find(admin => 
          (admin.email === emailOrId || admin.id === emailOrId) && 
          admin.password === password
        );
        
        if (superAdmin) {
          user = {
            id: superAdmin.id,
            email: superAdmin.email,
            name: superAdmin.name,
            role: 'super_admin',
            avatar: superAdmin.avatar || null
          };

          const token = this.generateToken(user);
          const session = {
            user,
            token,
            loginTime: new Date().toISOString(),
            lastActivity: new Date().toISOString()
          };

          localStorage.setItem('adminSession', JSON.stringify(session));
          this.startSessionTimer();

          return { success: true, user, token };
        }
      }

      // Check sub admin accounts
      const subAdmins = this.getSubAdmins();
      const subAdmin = subAdmins.find(admin => 
        (admin.email === emailOrId || admin.id === emailOrId) && 
        admin.password === password && 
        admin.status === 'approved'
      );

      if (subAdmin) {
        user = {
          id: subAdmin.id,
          email: subAdmin.email,
          name: subAdmin.name,
          role: 'sub_admin',
          avatar: subAdmin.avatar || null,
          permissions: subAdmin.permissions || []
        };

        const token = this.generateToken(user);
        const session = {
          user,
          token,
          loginTime: new Date().toISOString(),
          lastActivity: new Date().toISOString()
        };

        localStorage.setItem('adminSession', JSON.stringify(session));
        this.startSessionTimer();

        return { success: true, user, token };
      }

      return { success: false, error: 'Invalid credentials or account not approved' };
    } catch (error) {
      return { success: false, error: 'Login failed. Please try again.' };
    }
  }

  // Generate JWT-like token (simplified for frontend-only)
  generateToken(user) {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor((Date.now() + this.sessionTimeout) / 1000)
    }));
    const signature = btoa('mock-signature'); // In production, this would be properly signed

    return `${header}.${payload}.${signature}`;
  }

  // Logout
  logout() {
    localStorage.removeItem('adminSession');
    this.stopSessionTimer();
    
    // Only redirect to admin login if we're in admin area
    if (window.location.pathname.startsWith('/admin')) {
      window.location.href = '/admin/login';
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    const session = this.getSession();
    if (!session) return false;

    // Check if session is expired
    const now = new Date();
    const lastActivity = new Date(session.lastActivity);
    const timeDiff = now - lastActivity;

    if (timeDiff > this.sessionTimeout) {
      // Only auto-logout if we're in admin area
      if (window.location.pathname.startsWith('/admin')) {
        this.logout();
      } else {
        // Just remove the session without redirecting
        localStorage.removeItem('adminSession');
      }
      return false;
    }

    return true;
  }

  // Get current session
  getSession() {
    const sessionData = localStorage.getItem('adminSession');
    return sessionData ? JSON.parse(sessionData) : null;
  }

  // Get current user
  getCurrentUser() {
    const session = this.getSession();
    return session?.user || null;
  }

  // Update last activity
  updateActivity() {
    const session = this.getSession();
    if (session) {
      session.lastActivity = new Date().toISOString();
      localStorage.setItem('adminSession', JSON.stringify(session));
    }
  }

  // Start session timer - only for admin area
  startSessionTimer() {
    this.stopSessionTimer(); // Clear any existing timer
    
    // Only start timer if we're in admin area
    if (window.location.pathname.startsWith('/admin') && window.location.pathname !== '/admin/login') {
      this.sessionTimer = setInterval(() => {
        if (!this.isAuthenticated()) {
          this.logout();
        }
      }, 60000); // Check every minute

      // Update activity on user interaction
      this.activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
      this.activityHandler = () => this.updateActivity();
      
      this.activityEvents.forEach(event => {
        document.addEventListener(event, this.activityHandler, true);
      });
    }
  }

  // Stop session timer
  stopSessionTimer() {
    if (this.sessionTimer) {
      clearInterval(this.sessionTimer);
      this.sessionTimer = null;
    }

    if (this.activityHandler) {
      this.activityEvents.forEach(event => {
        document.removeEventListener(event, this.activityHandler, true);
      });
      this.activityHandler = null;
    }
  }

  // Check session on service initialization
  checkSession() {
    if (!this.isAuthenticated()) {
      localStorage.removeItem('adminSession');
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      // Verify current password
      const session = this.getSession();
      if (!session) {
        return { success: false, error: 'Not authenticated' };
      }

      // In production, this would verify against backend
      if (currentPassword !== this.defaultCredentials.password) {
        return { success: false, error: 'Current password is incorrect' };
      }

      // Validate new password
      const validation = this.validatePassword(newPassword);
      if (!validation.isValid) {
        return { success: false, error: 'New password does not meet requirements' };
      }

      // Update password (in production, this would be API call)
      this.defaultCredentials.password = newPassword;
      
      return { success: true, message: 'Password changed successfully' };
    } catch (error) {
      return { success: false, error: 'Failed to change password' };
    }
  }

  // Sub Admin Management Methods
  getSubAdmins() {
    const subAdmins = localStorage.getItem('subAdmins');
    return subAdmins ? JSON.parse(subAdmins) : [];
  }

  saveSubAdmins(subAdmins) {
    localStorage.setItem('subAdmins', JSON.stringify(subAdmins));
  }

  // Register new sub admin (with pending status)
  async registerSubAdmin(adminData) {
    try {
      const subAdmins = this.getSubAdmins();
      
      // Check if email already exists
      if (subAdmins.find(admin => admin.email === adminData.email)) {
        return { success: false, error: 'Email already registered' };
      }

      const newSubAdmin = {
        id: `sub_admin_${Date.now()}`,
        ...adminData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        permissions: adminData.permissions || []
      };

      subAdmins.push(newSubAdmin);
      this.saveSubAdmins(subAdmins);

      // Add to pending approvals for super admin
      this.addPendingApproval(newSubAdmin);

      return { success: true, message: 'Registration submitted for approval' };
    } catch (error) {
      return { success: false, error: 'Registration failed' };
    }
  }

  // Approve sub admin account
  approveSubAdmin(adminId) {
    const subAdmins = this.getSubAdmins();
    const adminIndex = subAdmins.findIndex(admin => admin.id === adminId);
    
    if (adminIndex !== -1) {
      subAdmins[adminIndex].status = 'approved';
      subAdmins[adminIndex].approvedAt = new Date().toISOString();
      this.saveSubAdmins(subAdmins);
      
      // Remove from pending approvals
      this.removePendingApproval(adminId);
      
      return { success: true, message: 'Sub admin approved successfully' };
    }
    
    return { success: false, error: 'Sub admin not found' };
  }

  // Reject sub admin account
  rejectSubAdmin(adminId) {
    const subAdmins = this.getSubAdmins();
    const updatedSubAdmins = subAdmins.filter(admin => admin.id !== adminId);
    this.saveSubAdmins(updatedSubAdmins);
    
    // Remove from pending approvals
    this.removePendingApproval(adminId);
    
    return { success: true, message: 'Sub admin registration rejected' };
  }

  // Pending approvals management
  getPendingApprovals() {
    const pending = localStorage.getItem('pendingApprovals');
    return pending ? JSON.parse(pending) : [];
  }

  addPendingApproval(adminData) {
    const pending = this.getPendingApprovals();
    pending.push({
      ...adminData,
      submittedAt: new Date().toISOString()
    });
    localStorage.setItem('pendingApprovals', JSON.stringify(pending));
  }

  removePendingApproval(adminId) {
    const pending = this.getPendingApprovals();
    const updated = pending.filter(admin => admin.id !== adminId);
    localStorage.setItem('pendingApprovals', JSON.stringify(updated));
  }

  // Super Admin Management (only primary super admin can create new super admins)
  getSuperAdmins() {
    const superAdmins = localStorage.getItem('superAdmins');
    const defaultSuperAdmins = [this.adminCredentials.superAdmin];
    return superAdmins ? [...defaultSuperAdmins, ...JSON.parse(superAdmins)] : defaultSuperAdmins;
  }

  createSuperAdmin(adminData, createdBy) {
    // Only primary super admin can create new super admins
    if (createdBy !== 'pg13000122017') {
      return { success: false, error: 'Only primary super admin can create super admins' };
    }

    const superAdmins = localStorage.getItem('superAdmins');
    const existingSuperAdmins = superAdmins ? JSON.parse(superAdmins) : [];
    
    // Check if ID already exists
    if (existingSuperAdmins.find(admin => admin.id === adminData.id)) {
      return { success: false, error: 'Super admin ID already exists' };
    }

    const newSuperAdmin = {
      ...adminData,
      role: 'super_admin',
      createdAt: new Date().toISOString(),
      createdBy: createdBy
    };

    existingSuperAdmins.push(newSuperAdmin);
    localStorage.setItem('superAdmins', JSON.stringify(existingSuperAdmins));

    return { success: true, message: 'Super admin created successfully' };
  }

  // OTP Simulation (in production, this would be real OTP service)
  async sendOTP(phone, email) {
    // Simulate OTP generation
    const mobileOTP = Math.floor(100000 + Math.random() * 900000).toString();
    const emailOTP = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Store OTPs temporarily (in production, this would be server-side)
    const otpData = {
      mobile: { otp: mobileOTP, phone, timestamp: Date.now() },
      email: { otp: emailOTP, email, timestamp: Date.now() }
    };
    
    localStorage.setItem('tempOTP', JSON.stringify(otpData));
    
    // Simulate sending (in production, integrate with SMS and email services)
    console.log(`Mobile OTP for ${phone}: ${mobileOTP}`);
    console.log(`Email OTP for ${email}: ${emailOTP}`);
    
    return { success: true, message: 'OTP sent successfully' };
  }

  verifyOTP(mobileOTP, emailOTP) {
    const otpData = localStorage.getItem('tempOTP');
    if (!otpData) {
      return { success: false, error: 'OTP expired or not found' };
    }
    
    const { mobile, email } = JSON.parse(otpData);
    const now = Date.now();
    
    // Check if OTP is expired (5 minutes)
    if (now - mobile.timestamp > 300000 || now - email.timestamp > 300000) {
      localStorage.removeItem('tempOTP');
      return { success: false, error: 'OTP expired' };
    }
    
    // Verify both OTPs
    if (mobile.otp === mobileOTP && email.otp === emailOTP) {
      localStorage.removeItem('tempOTP');
      return { success: true, message: 'OTP verified successfully' };
    }
    
    return { success: false, error: 'Invalid OTP' };
  }

  // Request password reset (placeholder for future backend integration)
  async requestPasswordReset(email) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In production, this would send reset email
      return { 
        success: true, 
        message: 'Password reset instructions have been sent to your email' 
      };
    } catch (error) {
      return { success: false, error: 'Failed to send reset email' };
    }
  }

  // Verify 2FA code (placeholder for future implementation)
  async verify2FA(code) {
    try {
      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In production, this would verify with backend
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Invalid verification code' };
    }
  }

  // Get session info for debugging
  getSessionInfo() {
    const session = this.getSession();
    if (!session) return null;

    const now = new Date();
    const loginTime = new Date(session.loginTime);
    const lastActivity = new Date(session.lastActivity);
    const timeLeft = this.sessionTimeout - (now - lastActivity);

    return {
      user: session.user,
      loginTime: loginTime.toLocaleString(),
      lastActivity: lastActivity.toLocaleString(),
      timeLeft: Math.max(0, Math.floor(timeLeft / 1000 / 60)), // minutes
      isActive: timeLeft > 0
    };
  }
}

// Create singleton instance
const authService = new AuthService();
export default authService;

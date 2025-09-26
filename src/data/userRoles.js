// User roles and permissions system
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  SUB_ADMIN: 'sub_admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
};

export const PERMISSIONS = {
  // User Management
  CREATE_USERS: 'create_users',
  EDIT_USERS: 'edit_users',
  DELETE_USERS: 'delete_users',
  VIEW_USERS: 'view_users',
  ASSIGN_ROLES: 'assign_roles',
  
  // Content Management
  CREATE_CONTENT: 'create_content',
  EDIT_CONTENT: 'edit_content',
  DELETE_CONTENT: 'delete_content',
  PUBLISH_CONTENT: 'publish_content',
  
  // Doctor Management
  CREATE_DOCTORS: 'create_doctors',
  EDIT_DOCTORS: 'edit_doctors',
  DELETE_DOCTORS: 'delete_doctors',
  
  // Service Management
  CREATE_SERVICES: 'create_services',
  EDIT_SERVICES: 'edit_services',
  DELETE_SERVICES: 'delete_services',
  
  // Appointment Management
  VIEW_APPOINTMENTS: 'view_appointments',
  EDIT_APPOINTMENTS: 'edit_appointments',
  DELETE_APPOINTMENTS: 'delete_appointments',
  
  // Analytics & Reports
  VIEW_ANALYTICS: 'view_analytics',
  EXPORT_DATA: 'export_data',
  
  // System Settings
  MANAGE_SETTINGS: 'manage_settings',
  BACKUP_RESTORE: 'backup_restore',
  
  // Media Management
  UPLOAD_MEDIA: 'upload_media',
  DELETE_MEDIA: 'delete_media'
};

export const ROLE_PERMISSIONS = {
  [USER_ROLES.SUPER_ADMIN]: [
    // All permissions
    ...Object.values(PERMISSIONS)
  ],
  
  [USER_ROLES.ADMIN]: [
    PERMISSIONS.CREATE_USERS,
    PERMISSIONS.EDIT_USERS,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.DELETE_CONTENT,
    PERMISSIONS.PUBLISH_CONTENT,
    PERMISSIONS.CREATE_DOCTORS,
    PERMISSIONS.EDIT_DOCTORS,
    PERMISSIONS.DELETE_DOCTORS,
    PERMISSIONS.CREATE_SERVICES,
    PERMISSIONS.EDIT_SERVICES,
    PERMISSIONS.DELETE_SERVICES,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.EDIT_APPOINTMENTS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.UPLOAD_MEDIA,
    PERMISSIONS.DELETE_MEDIA
  ],
  
  [USER_ROLES.SUB_ADMIN]: [
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.EDIT_DOCTORS,
    PERMISSIONS.EDIT_SERVICES,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.EDIT_APPOINTMENTS,
    PERMISSIONS.UPLOAD_MEDIA
  ],
  
  [USER_ROLES.EDITOR]: [
    PERMISSIONS.CREATE_CONTENT,
    PERMISSIONS.EDIT_CONTENT,
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.UPLOAD_MEDIA
  ],
  
  [USER_ROLES.VIEWER]: [
    PERMISSIONS.VIEW_APPOINTMENTS
  ]
};

// Default super admin user
export const DEFAULT_SUPER_ADMIN = {
  id: 'super_admin_001',
  username: 'superadmin',
  email: 'admin@drgandhis.in',
  password: 'SuperAdmin@2024', // In production, this should be hashed
  role: USER_ROLES.SUPER_ADMIN,
  name: 'Super Administrator',
  createdAt: new Date().toISOString(),
  isActive: true,
  lastLogin: null
};

// Helper functions
export const hasPermission = (userRole, permission) => {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false;
};

export const getUserPermissions = (userRole) => {
  return ROLE_PERMISSIONS[userRole] || [];
};

export const canManageRole = (currentUserRole, targetRole) => {
  const roleHierarchy = {
    [USER_ROLES.SUPER_ADMIN]: 5,
    [USER_ROLES.ADMIN]: 4,
    [USER_ROLES.SUB_ADMIN]: 3,
    [USER_ROLES.EDITOR]: 2,
    [USER_ROLES.VIEWER]: 1
  };
  
  return roleHierarchy[currentUserRole] > roleHierarchy[targetRole];
};

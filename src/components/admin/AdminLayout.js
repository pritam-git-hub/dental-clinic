import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUsers,
  FaUserMd,
  FaTooth,
  FaCalendarAlt,
  FaFileAlt,
  FaImages,
  FaCog,
  FaChartLine,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaUserShield,
  FaClipboardList,
  FaGlobe,
  FaCalendarCheck,
  FaChevronRight,
  FaBell
} from 'react-icons/fa';
import authService from '../../services/AuthService.js';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
  }, []);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: FaTachometerAlt, current: false },
    { name: 'Analytics', href: '/admin/analytics', icon: FaChartLine, current: false },
    { name: 'Users', href: '/admin/users', icon: FaUsers, current: false },
    { name: 'Super Admin', href: '/admin/super-admin', icon: FaUserShield, current: false, superAdminOnly: true },
    { name: 'Work Tracker', href: '/admin/work-tracker', icon: FaClipboardList, current: false, superAdminOnly: true },
    { name: 'Calendar', href: '/admin/calendar', icon: FaCalendarAlt, current: false },
    { name: 'Website Content', href: '/admin/website-content', icon: FaGlobe, current: false },
    { name: 'Doctors', href: '/admin/doctors', icon: FaUserMd, current: false },
    { name: 'Services', href: '/admin/services', icon: FaTooth, current: false },
    { name: 'Appointments', href: '/admin/appointments', icon: FaCalendarCheck, current: false },
    { name: 'Content', href: '/admin/content', icon: FaFileAlt, current: false },
    { name: 'Media', href: '/admin/media', icon: FaImages, current: false },
    { name: 'Settings', href: '/admin/settings', icon: FaCog, current: false },
  ];

  // Filter navigation based on user role and update current item
  const filteredNavigation = navigation.filter(item => {
    if (item.superAdminOnly && user?.role !== 'super_admin') {
      return false;
    }
    return true;
  });

  const updatedNavigation = filteredNavigation.map(item => ({
    ...item,
    current: location.pathname.startsWith(item.href)
  }));

  const handleLogout = () => {
    authService.logout();
  };

  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [];
    
    pathSegments.forEach((segment, index) => {
      if (index === 0) return; // Skip 'admin'
      
      const path = '/' + pathSegments.slice(0, index + 1).join('/');
      const name = segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ name, path });
    });

    return breadcrumbs;
  };

  const getPageTitle = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    if (pathSegments.length <= 1) return 'Dashboard';
    
    const lastSegment = pathSegments[pathSegments.length - 1];
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex lg:flex-col`}>
        
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-6 bg-primary-600">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center p-1 overflow-hidden">
              <img 
                src="/svg.svg" 
                alt="Dr. Gandhi's Dental Avenue" 
                className="w-6 h-6 object-cover rounded-full"
              />
            </div>
            <div className="text-white">
              <div className="font-semibold text-sm">Dental Avenue</div>
              <div className="text-xs text-primary-200">Admin Panel</div>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-primary-200"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3 flex-1 overflow-y-auto">
          <div className="space-y-1 pb-4">
            {updatedNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.name}
                  onClick={() => {
                    navigate(item.href);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    item.current
                      ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                  aria-current={item.current ? 'page' : undefined}
                >
                  <Icon className={`mr-3 h-5 w-5 ${item.current ? 'text-primary-600' : 'text-gray-400'}`} />
                  {item.name}
                </button>
              );
            })}
          </div>
        </nav>

        {/* User info at bottom */}
        <div className="mt-auto p-4 border-t border-gray-200 bg-white">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <FaUser className="text-gray-600" size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900 truncate">
                {user?.name || 'Admin User'}
              </div>
              <div className="text-xs text-gray-500 truncate">
                {user?.email || 'admin@dentalavenue.com'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64 flex flex-col min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <div className="flex items-center space-x-4">
              {/* Mobile menu button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <FaBars size={20} />
              </button>

              {/* Breadcrumbs */}
              <nav className="flex" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-2">
                  <li>
                    <button
                      onClick={() => navigate('/admin/dashboard')}
                      className="text-gray-500 hover:text-gray-700 text-sm"
                    >
                      Admin
                    </button>
                  </li>
                  {getBreadcrumbs().map((crumb, index) => (
                    <li key={crumb.path} className="flex items-center">
                      <FaChevronRight className="text-gray-400 mx-2" size={12} />
                      <button
                        onClick={() => navigate(crumb.path)}
                        className={`text-sm ${
                          index === getBreadcrumbs().length - 1
                            ? 'text-gray-900 font-medium'
                            : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {crumb.name}
                      </button>
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full relative">
                <FaBell size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                  title="Logout"
                >
                  <FaSignOutAlt size={16} />
                  <span className="hidden sm:block text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {/* Page header */}
          <div className="mb-6">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
          </div>

          {/* Page content */}
          <div className="max-w-full overflow-x-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;

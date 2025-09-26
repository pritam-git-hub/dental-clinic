# Dental Clinic Admin CMS

A comprehensive admin content management system for Dr. Gandhi's Dental Avenue website built with React (CRA), Tailwind CSS, and Bootstrap.

## Features

### 🔐 Authentication & Security
- Secure email/password login with session management
- Password strength validation (8+ chars, mixed case, number, special char)
- Auto-logout after 30 minutes of inactivity
- Protected routes with authentication guards
- Session persistence with localStorage (backend-ready)

### 👨‍⚕️ Doctors Management
- Complete CRUD operations for doctor profiles
- Image upload with preview and compression
- Specialty tags and categorization
- Active/inactive status toggle
- Display order management
- Search, filter, and sort functionality
- Bulk operations support

### 🦷 Services Management
- Service categories and descriptions
- Active/inactive toggles
- Display order management
- Integration with public website

### 📅 Appointment System
- Hospital-grade scheduling system
- Doctor availability management
- Bulk slot generation
- Calendar views (month/week/day)
- Appointment booking and management
- Status tracking (booked/completed/cancelled)

### 📊 Dashboard & Analytics
- Real-time KPI cards
- Today's agenda view
- System alerts and notifications
- Quick action buttons
- Performance metrics

### 🎨 Content Management
- Highlights management
- Branch locations
- Contact information
- Clinic hours
- SEO metadata

### 📁 Media Library
- Image upload and management
- File compression and optimization
- Usage tracking
- Alt text management

## Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
# Install dependencies
npm install

# Start development server
npm start
```

### Default Admin Credentials
```
Email: admin@dentalavenue.com
Password: Admin@123456
```

## Admin Routes

### Authentication
- `/admin/login` - Admin login page
- `/admin` - Redirects to dashboard

### Main Admin Routes
- `/admin/dashboard` - Main dashboard with KPIs
- `/admin/doctors` - Doctors management
- `/admin/doctors/new` - Add new doctor
- `/admin/doctors/:id/edit` - Edit existing doctor
- `/admin/services` - Services management
- `/admin/appointments` - Appointment scheduling
- `/admin/content` - Content management
- `/admin/media` - Media library
- `/admin/settings` - Admin settings

## Data Structure

### Doctor Model
```javascript
{
  id: string,
  name: string,
  roleTitle: string,
  credentials: string,
  bio?: string,
  phone?: string,
  email?: string,
  avatarUrl?: string,
  active: boolean,
  displayOrder: number,
  tags: string[]
}
```

### Service Model
```javascript
{
  id: string,
  name: string,
  category: string,
  descriptionShort: string,
  descriptionFull?: string,
  active: boolean,
  displayOrder: number
}
```

### Appointment Slot Model
```javascript
{
  id: string,
  doctorId: string,
  date: string,
  startTime: string,
  endTime: string,
  capacity: number,
  booked: number,
  location?: string,
  notes?: string,
  status: 'open' | 'closed' | 'archived'
}
```

### Appointment Model
```javascript
{
  id: string,
  slotId: string,
  patientName: string,
  phone: string,
  email?: string,
  notes?: string,
  status: 'booked' | 'cancelled' | 'completed',
  createdAt: string
}
```

## Data Storage

### Current Implementation
- **Frontend-only**: Uses localStorage for data persistence
- **Schema versioning**: Built-in data migration support
- **Audit logging**: All CRUD operations are logged
- **Export/Import**: JSON backup and restore functionality

### Backend Integration Ready
The data service layer (`src/services/DataService.js`) is designed to be easily replaced with backend API calls:

```javascript
// Current localStorage implementation
const doctors = dataService.getDoctors();

// Future backend implementation
const doctors = await fetch('/api/doctors').then(r => r.json());
```

## Security Features

### Session Management
- 30-minute auto-logout
- Activity-based session renewal
- Secure token storage
- Session info debugging

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number
- At least one special character
- Real-time strength indicator

### Data Protection
- Input validation on all forms
- XSS prevention
- CSRF protection ready
- Audit trail for all changes

## Accessibility (WCAG 2.2 AA)

### Keyboard Navigation
- Full keyboard support
- Visible focus indicators
- Logical tab order
- Skip links

### Screen Reader Support
- Semantic HTML structure
- ARIA labels and descriptions
- Proper heading hierarchy
- Form labels and validation

### Visual Accessibility
- High contrast colors
- Scalable fonts
- Clear error messages
- Loading states

## Performance Optimizations

### Code Splitting
- Lazy loading of admin routes
- Component-level splitting
- Dynamic imports

### Data Management
- Debounced search
- Memoized selectors
- Optimistic UI updates
- Error rollback

### Image Optimization
- Client-side compression
- Preview generation
- File size validation
- Format conversion

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables
Create `.env` file for production:
```
REACT_APP_API_URL=https://your-api.com
REACT_APP_ADMIN_EMAIL=admin@yourdomain.com
```

### Static Hosting
The admin system works with any static hosting provider:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

## Backend Integration

### API Endpoints Needed
```
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/me

GET    /api/doctors
POST   /api/doctors
GET    /api/doctors/:id
PUT    /api/doctors/:id
DELETE /api/doctors/:id

GET    /api/services
POST   /api/services
PUT    /api/services/:id
DELETE /api/services/:id

GET    /api/appointments/slots
POST   /api/appointments/slots
POST   /api/appointments/slots/bulk
GET    /api/appointments
POST   /api/appointments

POST   /api/media/upload
GET    /api/media
DELETE /api/media/:id
```

### Database Schema
Recommended tables:
- `users` (admin accounts)
- `doctors`
- `services`
- `appointment_slots`
- `appointments`
- `media_files`
- `audit_logs`

## Customization

### Branding
Update colors in `tailwind.config.js`:
```javascript
colors: {
  primary: {
    DEFAULT: '#3B4F9A', // Your brand blue
    // ... other shades
  },
  secondary: {
    DEFAULT: '#F5A623', // Your brand orange
    // ... other shades
  }
}
```

### Features
- Add new admin routes in `App.js`
- Create new management components
- Extend data models in `DataService.js`
- Add new form validations

## Troubleshooting

### Common Issues

1. **Login not working**
   - Check default credentials
   - Clear localStorage
   - Check browser console for errors

2. **Images not uploading**
   - Check file size (max 5MB)
   - Verify file format (PNG, JPG, SVG)
   - Check browser permissions

3. **Data not persisting**
   - Check localStorage quota
   - Verify browser supports localStorage
   - Check for private browsing mode

### Debug Mode
Enable debug logging:
```javascript
localStorage.setItem('debug', 'true');
```

## Support

For technical support or questions:
- Check browser console for errors
- Review audit logs in settings
- Export data before making major changes
- Contact development team

## License

This admin system is part of the Dr. Gandhi's Dental Avenue website project and is proprietary software.

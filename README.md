# Dr. Gandhi's Dental Avenue Website

A modern, responsive dental clinic website built with React, Tailwind CSS, and Bootstrap. This single-page application showcases comprehensive dental services with a focus on accessibility, SEO optimization, and user experience.

## 🚀 Features

- **Modern Tech Stack**: React 18, Vite, Tailwind CSS, Bootstrap
- **Responsive Design**: Mobile-first approach with seamless desktop experience
- **Accessibility**: WCAG 2.2 AA compliant with proper ARIA attributes
- **SEO Optimized**: JSON-LD schema, Open Graph, and semantic HTML
- **Form Validation**: React Hook Form with Zod validation and spam protection
- **Performance**: Optimized for Core Web Vitals and fast loading

## 🛠️ Tech Stack

- **Frontend**: React 18 with functional components and hooks
- **Styling**: Tailwind CSS for utilities, Bootstrap for components
- **Build Tool**: Vite for fast development and optimized builds
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: React Icons library
- **Code Quality**: ESLint, Prettier

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dental-clinic
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm start
   ```
   The application will open at `http://localhost:3000`

## 🏗️ Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.jsx      # Navigation header
│   ├── Hero.jsx        # Hero section
│   ├── Highlights.jsx  # Feature highlights
│   ├── Services.jsx    # Services showcase
│   ├── Doctors.jsx     # Team information
│   ├── WhyUs.jsx       # Differentiators
│   ├── FAQ.jsx         # Frequently asked questions
│   ├── Location.jsx    # Contact and location
│   ├── AppointmentForm.jsx # Booking form
│   └── Footer.jsx      # Site footer
├── data/               # Static data
│   ├── services.js     # Service information
│   └── doctors.js      # Doctor profiles
├── config/             # Configuration
│   └── site.js         # Site settings
├── styles/             # Stylesheets
│   └── index.css       # Main CSS with Tailwind
├── App.jsx             # Main app component
└── main.jsx            # React entry point
```

## 🎨 Design System

### Colors
- **Primary**: Teal shades (#0d9488, #14b8a6)
- **Secondary**: Blue shades (#2563eb, #3b82f6)
- **Neutral**: Warm grays for text and backgrounds

### Typography
- **Font Stack**: System UI fonts for optimal performance
- **Hierarchy**: Clear heading structure (h1-h3)

### Components
- **Buttons**: Primary, secondary, and link variants
- **Cards**: Service cards, highlight cards with hover effects
- **Forms**: Accessible form controls with validation states

## ♿ Accessibility Features

- **Semantic HTML**: Proper landmark elements and heading hierarchy
- **Keyboard Navigation**: Full keyboard support with focus management
- **ARIA Attributes**: Screen reader support with proper labeling
- **Color Contrast**: WCAG AA compliant contrast ratios
- **Skip Links**: Quick navigation for screen reader users

## 🔍 SEO Optimization

- **Meta Tags**: Comprehensive Open Graph and Twitter Card support
- **JSON-LD Schema**: Structured data for search engines
- **Semantic HTML**: Proper document structure
- **Performance**: Optimized images and code splitting

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Breakpoints**: Tailored for tablet and desktop experiences
- **Touch Friendly**: Appropriate touch targets and spacing

## 🚀 Performance

- **Vite**: Fast development and optimized production builds
- **Code Splitting**: Lazy loading for optimal bundle sizes
- **Image Optimization**: Responsive images with lazy loading
- **CSS Optimization**: Purged unused styles in production

## 📋 Business Information

- **Clinic**: Dr. Gandhi's Dental Avenue
- **Location**: New Town, Kolkata
- **Services**: 25+ comprehensive dental services
- **Team**: 12+ specialist doctors
- **Hours**: 9 AM - 5 PM (Monday - Saturday)

## 🔧 Configuration

### Environment Setup
The application uses static configuration in `src/config/site.js`. Update this file to modify:
- Contact information
- Business hours
- Branch locations
- SEO metadata

### Form Handling
The appointment form includes:
- Client-side validation with Zod
- Spam protection with honeypot field
- Rate limiting
- Fallback to mailto for offline scenarios

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Static Hosting
The built files in the `dist` folder can be deployed to any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

### Server Requirements
- No server-side requirements
- Works with any static file hosting
- CDN recommended for optimal performance

## 🧪 Testing Checklist

### Functionality
- [ ] Navigation works across all sections
- [ ] Form validation and submission
- [ ] Responsive design on all devices
- [ ] Accessibility with keyboard navigation
- [ ] Performance metrics (Lighthouse scores)

### Browser Support
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

## 📞 Support

For technical support or customization requests, please contact the development team.

## 📄 License

This project is proprietary software developed for Dr. Gandhi's Dental Avenue.

---

**Built with ❤️ for better dental care accessibility**

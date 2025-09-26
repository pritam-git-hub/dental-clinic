import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import './ClinicCarousel.css';

const ClinicCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  const [isLoaded, setIsLoaded] = useState({});
  const intervalRef = useRef(null);

  // Clinic photos data - Organized for smooth carousel flow and optimal user experience
  const clinicPhotos = [
    // Exterior & Building
    {
      id: 1,
      src: '/clinic-photos/dental-avenue-exterior-building-night-01.jpg.jpg',
      alt: 'Dr. Gandhi\'s Dental Avenue - Modern clinic building exterior at night',
      caption: 'Our Modern Clinic Building',
      roomType: 'exterior'
    },
    // Entrance & Welcome
    {
      id: 2,
      src: '/clinic-photos/dental-avenue-entrance-clinic-sign-03.jpg.jpg',
      alt: 'Dr. Gandhi\'s Dental Avenue - Professional clinic signage and entrance',
      caption: 'Welcome to Dental Avenue',
      roomType: 'entrance'
    },
    {
      id: 3,
      src: '/clinic-photos/dental-avenue-entrance-doorway-04.jpg.jpg',
      alt: 'Dr. Gandhi\'s Dental Avenue - Clean and welcoming entrance doorway',
      caption: 'Professional Entrance',
      roomType: 'entrance'
    },
    {
      id: 4,
      src: '/clinic-photos/dental-avenue-entrance-hallway-view-14.jpg.jpg',
      alt: 'Dr. Gandhi\'s Dental Avenue - Bright and spacious entrance hallway',
      caption: 'Spacious Entrance Hallway',
      roomType: 'entrance'
    },
    // Waiting & Lobby Areas
    {
      id: 5,
      src: '/clinic-photos/dental-avenue-lobby-waiting-area-02.jpg.jpg',
      alt: 'Dr. Gandhi\'s Dental Avenue - Comfortable patient waiting area with modern seating',
      caption: 'Comfortable Waiting Area',
      roomType: 'waiting'
    },
    {
      id: 6,
      src: '/clinic-photos/dental-avenue-lobby-seating-area-16.jpg.jpg',
      alt: 'Dr. Gandhi\'s Dental Avenue - Additional seating area for patient comfort',
      caption: 'Extended Seating Area',
      roomType: 'waiting'
    },
    // Treatment Rooms & Equipment
    {
      id: 7,
      src: '/clinic-photos/dental-avenue-clinic-treatment-room-wide-05.jpg.jpg',
      alt: 'Dr. Gandhi\'s Dental Avenue - Spacious treatment room with modern dental equipment',
      caption: 'Advanced Treatment Room',
      roomType: 'treatment'
    },
    {
      id: 8,
      src: '/clinic-photos/dental-avenue-clinic-dental-chair-close-up-06.jpg.jpg',
      alt: 'Dr. Gandhi\'s Dental Avenue - State-of-the-art dental chair and equipment setup',
      caption: 'Modern Dental Equipment',
      roomType: 'treatment'
    },
    {
      id: 9,
      src: '/clinic-photos/dental-avenue-clinic-treatment-room-alternate-view-07.jpg.jpg',
      alt: 'Dr. Gandhi\'s Dental Avenue - Alternative view of well-equipped treatment room',
      caption: 'Comprehensive Treatment Setup',
      roomType: 'treatment'
    },
    {
      id: 10,
      src: '/clinic-photos/dental-avenue-clinic-operator-station-08.jpg.jpg',
      alt: 'Dr. Gandhi\'s Dental Avenue - Professional operator station with advanced controls',
      caption: 'Professional Operator Station',
      roomType: 'treatment'
    },
    // Technology & Diagnostics
    {
      id: 11,
      src: '/clinic-photos/dental-avenue-technology-panoramic-xray-10.jpg.jpg',
      alt: 'Dr. Gandhi\'s Dental Avenue - Advanced panoramic X-ray technology',
      caption: 'Panoramic X-Ray Technology',
      roomType: 'diagnostic'
    },
    {
      id: 12,
      src: '/clinic-photos/dental-avenue-technology-xray-room-11.jpg.jpg',
      alt: 'Dr. Gandhi\'s Dental Avenue - Dedicated X-ray room with modern equipment',
      caption: 'Digital X-Ray Room',
      roomType: 'diagnostic'
    },
    // Support & Safety
    {
      id: 13,
      src: '/clinic-photos/dental-avenue-safety-sterilization-area-12.jpg.jpg',
      alt: 'Dr. Gandhi\'s Dental Avenue - Professional sterilization area ensuring safety',
      caption: 'Sterilization & Safety',
      roomType: 'support'
    },
    {
      id: 14,
      src: '/clinic-photos/dental-avenue-clinic-window-view-09.jpg.jpg',
      alt: 'Dr. Gandhi\'s Dental Avenue - Natural lighting and pleasant clinic environment',
      caption: 'Natural Light & Comfort',
      roomType: 'facility'
    },
    // Additional Entrance Views
    {
      id: 15,
      src: '/clinic-photos/dental-avenue-entrance-banner-and-door-15.jpg.jpg',
      alt: 'Dr. Gandhi\'s Dental Avenue - Professional entrance with clinic banner',
      caption: 'Professional Clinic Entrance',
      roomType: 'entrance'
    },
    {
      id: 16,
      src: '/clinic-photos/dental-avenue-exterior-building-detail-13.jpg.jpg',
      alt: 'Dr. Gandhi\'s Dental Avenue - Detailed view of modern clinic building',
      caption: 'Modern Healthcare Facility',
      roomType: 'exterior'
    }
  ];

  // Auto-advance slides every 5 seconds
  const startAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (!isHovered) {
        setCurrentSlide(prev => (prev + 1) % clinicPhotos.length);
      }
    }, 5000);
  }, [isHovered, clinicPhotos.length]);

  const stopAutoplay = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Initialize autoplay
  useEffect(() => {
    startAutoplay();
    return () => stopAutoplay();
  }, [startAutoplay, stopAutoplay]);

  // Handle hover events
  const handleMouseEnter = () => {
    setIsHovered(true);
    stopAutoplay();
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    startAutoplay();
  };

  // Navigation functions
  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % clinicPhotos.length);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + clinicPhotos.length) % clinicPhotos.length);
  };

  // Touch handlers for swipe support
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };

  // Handle image load
  const handleImageLoad = (index) => {
    setIsLoaded(prev => ({ ...prev, [index]: true }));
  };

  return (
    <div 
      className="clinic-carousel group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      role="region"
      aria-label="Clinic facility photos carousel"
    >
      {/* Image Container */}
      <div className="relative w-full h-full">
        {clinicPhotos.map((photo, index) => (
          <div
            key={photo.id}
            className={`carousel-slide ${index === currentSlide ? 'active' : 'inactive'}`}
            aria-hidden={index !== currentSlide}
          >
            {/* Loading placeholder */}
            {!isLoaded[index] && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin"></div>
              </div>
            )}
            
            <img
              src={photo.src}
              alt={photo.alt}
              className={`carousel-image ${isLoaded[index] ? 'loaded' : 'loading'}`}
              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
              loading={index <= 2 ? 'eager' : 'lazy'} // Eager load first 3 images
              onLoad={() => handleImageLoad(index)}
              onError={(e) => {
                // Fallback to a placeholder or default image
                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzlDQTNBRiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNsaW5pYyBQaG90bzwvdGV4dD48L3N2Zz4=';
                handleImageLoad(index);
              }}
            />
            
            {/* Overlay gradient */}
            <div className="carousel-overlay"></div>
            
            {/* Caption */}
            <div className="carousel-caption">
              <h3>{photo.caption}</h3>
              <div className="carousel-caption-line"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="carousel-nav-button prev"
        aria-label="Previous image"
      >
        <FaChevronLeft className="text-white" size={16} />
      </button>

      <button
        onClick={nextSlide}
        className="carousel-nav-button next"
        aria-label="Next image"
      >
        <FaChevronRight className="text-white" size={16} />
      </button>

      {/* Pagination Dots */}
      <div className="carousel-pagination">
        {clinicPhotos.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`carousel-dot ${index === currentSlide ? 'active' : ''}`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Pause indicator */}
      {isHovered && (
        <div className="carousel-pause-indicator">
          Paused
        </div>
      )}

      {/* Progress indicator */}
      <div className="carousel-progress">
        <div 
          className="carousel-progress-bar"
          style={{ 
            width: `${((currentSlide + 1) / clinicPhotos.length) * 100}%` 
          }}
        />
      </div>
    </div>
  );
};

export default ClinicCarousel;

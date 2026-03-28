import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useCar } from '../hooks/useCars';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAppContext } from '../context/AppContext';
import SEO from '../components/SEO';
import { generateCarSchema } from '../utils/schema';
import DateRangePicker from '../components/DateRangePicker';

interface CarDetailsPageProps {
  slug: string;
}

interface BookingFormData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  city: string;
  startDate: string;
  endDate: string;
}

const CarDetailsPage: React.FC<CarDetailsPageProps> = ({ slug }) => {
  const { car, loading, error } = useCar(slug);
  const { t, language } = useAppContext();
  const isRTL = language === 'ar';
  const [mainImage, setMainImage] = useState<string | undefined>(undefined);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const swiperInstanceRef = useRef<any>(null);
  const [bookingData, setBookingData] = useState<BookingFormData>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    city: '',
    startDate: '',
    endDate: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<BookingFormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allImages = car ? [car.featured_media_url, ...(car.gallery_urls || [])].filter(Boolean) as string[] : [];
  const currentImage = mainImage || allImages[0];

  const navigateImage = useCallback((direction: 'prev' | 'next') => {
    if (allImages.length === 0) return;
    if (direction === 'prev') {
      setCurrentImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    } else {
      setCurrentImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1));
    }
  }, [allImages.length]);

  useEffect(() => {
    if (isImageViewerOpen) {
      document.body.style.overflow = 'hidden';
      
      const handleKeyPress = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          navigateImage('prev');
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          navigateImage('next');
        }
        if (e.key === 'Escape') {
          setIsImageViewerOpen(false);
        }
      };

      window.addEventListener('keydown', handleKeyPress);
      return () => {
        document.body.style.overflow = 'unset';
        window.removeEventListener('keydown', handleKeyPress);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isImageViewerOpen, navigateImage]);

  useEffect(() => {
    if (allImages.length > 1 && typeof window !== 'undefined' && (window as any).Swiper) {
      if (swiperInstanceRef.current) {
        swiperInstanceRef.current.destroy();
        swiperInstanceRef.current = null;
      }
      
      const timer = setTimeout(() => {
        const swiperEl = document.querySelector('.gallery-carousel');
        if (swiperEl) {
          swiperInstanceRef.current = new (window as any).Swiper('.gallery-carousel', {
            slidesPerView: 3,
            spaceBetween: 16,
            navigation: {
              nextEl: '.gallery-next',
              prevEl: '.gallery-prev',
            },
            breakpoints: {
              640: {
                slidesPerView: 4,
                spaceBetween: 16,
              },
              768: {
                slidesPerView: 5,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 6,
                spaceBetween: 20,
              },
            },
          });
        }
      }, 100);

      return () => {
        clearTimeout(timer);
        if (swiperInstanceRef.current) {
          swiperInstanceRef.current.destroy();
          swiperInstanceRef.current = null;
        }
      };
    }
  }, [allImages.length]);

  if (loading) return <div className="min-h-screen"><LoadingSpinner /></div>;
  if (error) return <p className="text-center text-red-500 py-20">{error}</p>;
  if (!car) return <p className="text-center py-20">Car not found.</p>;

  // Function to get the correct description based on language with fallback
  const getLocalizedDescription = (): string => {
    // RULE: If language is 'fr', try to use car_description_fr, otherwise use car_description_en
    // If the fr version is empty/null, fall back to English version
    if (language === 'fr') {
      // Use French description if available and not empty
      if (car.car_description_fr && car.car_description_fr.trim() !== '') {
        return car.car_description_fr;
      }
      // Fall back to English if French is not available
      if (car.car_description_en && car.car_description_en.trim() !== '') {
        return car.car_description_en;
      }
    }
    // Default to English for 'en' or any other language
    if (car.car_description_en && car.car_description_en.trim() !== '') {
      return car.car_description_en;
    }
    // If language-specific fields don't exist, fall back to the standard content field
    return car.content.rendered;
  };

  // Function to convert multiple consecutive br tags to proper paragraph spacing
  const formatDescriptionHTML = (html: string): string => {
    // First, clean up multiple br tags
    let formatted = html.replace(/<br\s*\/?>\s*<br\s*\/?>/g, '|PARAGRAPH_BREAK|');
    formatted = formatted.replace(/<br\s*\/?>/g, ' ');
    
    // Special handling for French content: add paragraph breaks after sentences if no paragraphs exist
    if (language === 'fr') {
      // If no paragraph breaks were found, try to split by sentences
      if (!formatted.includes('|PARAGRAPH_BREAK|')) {
        // Split by sentence endings (. ? !) followed by space or end
        formatted = formatted.replace(/([.!?])\s+/g, '$1|PARAGRAPH_BREAK|');
      }
    }
    
    // Split by paragraph breaks and wrap each in <p> tags
    const paragraphs = formatted.split('|PARAGRAPH_BREAK|')
      .map(para => para.trim())
      .filter(para => para.length > 0)
      .map(para => `<p>${para}</p>`)
      .join('');
    
    return paragraphs || html;
  };

  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };
  
  // Generate SEO description based on language-specific content
  const seoDescription = stripHtml(getLocalizedDescription()).substring(0, 160) || 
    `Location de ${car.title.rendered} à Marrakech. Prix: ${car.car_price}€/jour. Transmission: ${car.car_transmission}, ${car.car_seats} places, ${car.car_fuel}.`;
  
  const carUrl = typeof window !== 'undefined' ? window.location.href : `https://locamarrakech.com/${car.slug}`;
  const carImage = car.featured_media_url || '/logo.png';
  const carSchema = generateCarSchema(car);

  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setIsImageViewerOpen(true);
  };

  const SpecCard: React.FC<{ icon: React.ReactNode; label: string; value: string | undefined }> = ({ icon, label, value }) => (
    <div className="border border-gray-200 dark:border-gray-700 p-6 transition-colors hover:border-gray-900 dark:hover:border-gray-300 capitalize">
      <div className="flex items-center gap-3 mb-4">
        <div className="text-gray-900 dark:text-gray-100">
          {icon}
        </div>
        <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">{label}</h3>
      </div>
      <p className="text-lg font-light text-gray-900 dark:text-gray-100">{value || 'N/A'}</p>
    </div>
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
    if (formErrors[name as keyof BookingFormData]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<BookingFormData> = {};
    
    if (!bookingData.firstName.trim()) errors.firstName = t('firstNameRequired');
    if (!bookingData.lastName.trim()) errors.lastName = t('lastNameRequired');
    if (!bookingData.email.trim()) errors.email = t('emailRequired');
    else if (!/\S+@\S+\.\S+/.test(bookingData.email)) errors.email = t('emailInvalid');
    if (!bookingData.phoneNumber.trim()) errors.phoneNumber = t('phoneRequired');
    if (!bookingData.city.trim()) errors.city = t('cityRequired');
    if (!bookingData.startDate) errors.startDate = t('startDateRequired');
    if (!bookingData.endDate) errors.endDate = t('endDateRequired');
    
    // Validate that end date is after start date
    if (bookingData.startDate && bookingData.endDate) {
      const start = new Date(bookingData.startDate);
      const end = new Date(bookingData.endDate);
      if (end < start) {
        errors.endDate = 'End date must be after start date';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: `${bookingData.firstName} ${bookingData.lastName}`.trim(),
          email: bookingData.email,
          phoneNumber: bookingData.phoneNumber,
          city: bookingData.city,
          startDate: bookingData.startDate,
          endDate: bookingData.endDate,
          carName: car.title.rendered,
          featuredImage: car.featured_media_url,
          carPrice: car.car_price,
          carModel: car.car_model,
          carTransmission: car.car_transmission,
          carSeats: car.car_seats,
          carFuel: car.car_fuel,
          carSpeed: car.car_speed_km,
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server returned ${response.status}: ${response.statusText}. The API endpoint may not be configured correctly.`);
      }

      const result = await response.json();

      if (result.success) {
        alert('Congratulations! Your booking request has been sent successfully!');
        setIsBookingModalOpen(false);
        setBookingData({
          firstName: '',
          lastName: '',
          email: '',
          phoneNumber: '',
          city: '',
          startDate: '',
          endDate: '',
        });
        setFormErrors({});
      } else {
        alert(`Error: ${result.message || 'Failed to send booking request. Please try again.'}`);
      }
    } catch (error: any) {
      console.error('Error submitting form:', error);
      alert(`Error: ${error.message || 'An error occurred. Please try again later.'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO
        title={`${car.title.rendered} - Location à ${car.car_price}€/jour | LocaMarrakech`}
        description={seoDescription}
        image={carImage}
        url={carUrl}
        type="product"
        schema={carSchema}
        keywords={`location ${car.title.rendered} marrakech, ${car.title.rendered} rental, voiture ${car.car_transmission} marrakech, location voiture ${car.car_model}`}
      />
      <div className="bg-white dark:bg-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="border-b border-gray-200 dark:border-gray-700">
        {currentImage && (
          <>
            <div className="relative h-[75vh]">
              <img 
                src={currentImage} 
                alt={car.title.rendered} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
              <div className="max-w-7xl mx-auto">
                <div className="inline-block border border-white/30 px-4 py-2 mb-6">
                  <span className="text-white text-xs font-medium uppercase tracking-widest">Premium Selection</span>
                </div>

                <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white mb-6 leading-tight tracking-tight">
                  {car.title.rendered}
                </h1>
                
                <div className={`flex flex-wrap items-center ${isRTL ? 'justify-end' : 'justify-start'} gap-6`}>
                  <div className="flex items-baseline border border-white/20 px-6 py-3 bg-black text-white">
                    <span className="text-white text-5xl font-bold">{car.car_price}</span>
                    <span className={`text-gray-200 text-sm font-medium ${isRTL ? 'mr-2 ml-0' : 'ml-2 mr-0'}`}>/ {t('day')}</span>
                  </div>
                  
                  {car.car_model && (
                    <div className="flex items-center text-white/90 text-lg">
                      <span className="font-light">{car.car_model}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-8 md:px-16 py-16 md:py-20">
        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-16">
          <SpecCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            label={t('transmission')}
            value={car.car_transmission}
          />
          <SpecCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            }
            label={t('seats')}
            value={car.car_seats}
          />
          <SpecCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z" />
              </svg>
            }
            label={t('fuel')}
            value={car.car_fuel}
          />
          <SpecCard
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            label={t('maxSpeed')}
            value={car.car_speed_km ? `${car.car_speed_km} km/h` : undefined}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-10">
            {/* Featured Image */}
            <div className="border border-gray-200 dark:border-gray-700">
              <div 
                className="cursor-pointer aspect-[16/10]" 
                onClick={() => openImageViewer(0)}
              >
                <img 
                  src={currentImage} 
                  alt={car.title.rendered} 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>
            
            {/* Gallery Carousel */}
            {allImages.length > 1 && (
              <div className="relative">
                <div className="swiper gallery-carousel overflow-hidden">
                  <div className="swiper-wrapper">
                    {allImages.map((img, index) => (
                      <div 
                        key={index} 
                        className="swiper-slide cursor-pointer"
                        onClick={() => {
                          setMainImage(img);
                          openImageViewer(index);
                        }}
                      >
                        <div className={`border transition-all duration-300 ${
                          currentImage === img 
                            ? 'border-gray-900 dark:border-gray-300' 
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
                        }`}>
                          <img 
                            src={img} 
                            alt={`${car.title.rendered} - ${index + 1}`} 
                            className="w-full h-full object-cover aspect-square"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                {allImages.length > 3 && (
                  <>
                    <div className="swiper-button-next gallery-next"></div>
                    <div className="swiper-button-prev gallery-prev"></div>
                  </>
                )}
              </div>
            )}

            {/* Description Card */}
            <div className="border border-gray-200 dark:border-gray-700 p-8 md:p-10">
              <div className="mb-6">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">{t('description')}</span>
                <div className="w-12 h-px bg-gray-900 dark:bg-gray-100 mt-3" />
              </div>
              <div 
                className="prose dark:prose-invert prose-lg max-w-none text-gray-600 dark:text-gray-300 leading-relaxed font-light [&>p]:mb-6 [&>p]:mt-0 [&>h1]:mt-8 [&>h1]:mb-6 [&>h2]:mt-6 [&>h2]:mb-4 [&>h3]:mt-5 [&>h3]:mb-4 [&>h4]:mt-4 [&>h4]:mb-3 [&>h5]:mt-4 [&>h5]:mb-3 [&>h6]:mt-4 [&>h6]:mb-3 [&>ul]:my-4 [&>ol]:my-4 [&>li]:my-1"
                dangerouslySetInnerHTML={{ __html: formatDescriptionHTML(getLocalizedDescription()) }}
              />
            </div>

            {/* Features Grid */}
            {car.acf?.car_features && car.acf.car_features.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-700 p-8 md:p-10">
                <div className="mb-8">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">Caractéristiques</span>
                  <div className="w-12 h-px bg-gray-900 dark:bg-gray-100 mt-3" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {car.acf.car_features.map((feature, index) => (
                    <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <div className="flex-shrink-0 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-900 dark:text-gray-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <span className="font-light text-gray-900 dark:text-gray-100 block mb-1">{feature.label}</span>
                        <span className="text-gray-600 dark:text-gray-400 text-sm">{feature.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="border border-gray-200 dark:border-gray-700 p-6">
                <div className="text-center mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="mb-2">
                    <span className="text-5xl font-light text-gray-900 dark:text-gray-100">{car.car_price}</span>
                    <span className={`text-gray-500 dark:text-gray-400 ${isRTL ? 'mr-2 ml-0' : 'ml-2 mr-0'}`}>€</span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest">{t('perDay')}</p>
                </div>

                <div className="flex gap-3 mb-4">
                  <button 
                    onClick={() => setIsBookingModalOpen(true)}
                    className="flex-1 bg-black border-2 border-black text-white font-medium py-3 px-4 text-sm transition-all hover:bg-slate-800 flex items-center justify-center"
                  >
                    <span>{t('bookNow')}</span>
                  </button>
                  <a
                    href={`https://wa.me/212627573069?text=${encodeURIComponent(`${t('whatsappAvailabilityCheck')}\n\n${car.title.rendered}\n${window.location.origin}/${car.slug}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-white border-2 border-green-400 text-green-600 font-medium py-3 px-4 text-sm transition-all hover:bg-green-50 flex items-center justify-center gap-2"
                  >
                    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.6 6.31999C16.8669 5.58141 15.9943 4.99596 15.033 4.59767C14.0716 4.19938 13.0406 3.99622 12 3.99999C10.6089 4.00135 9.24248 4.36819 8.03771 5.06377C6.83294 5.75935 5.83208 6.75926 5.13534 7.96335C4.4386 9.16745 4.07046 10.5335 4.06776 11.9246C4.06507 13.3158 4.42793 14.6832 5.12 15.89L4 20L8.2 18.9C9.35975 19.5452 10.6629 19.8891 11.99 19.9C14.0997 19.9001 16.124 19.0668 17.6222 17.5816C19.1205 16.0965 19.9715 14.0796 19.99 11.97C19.983 10.9173 19.7682 9.87634 19.3581 8.9068C18.948 7.93725 18.3505 7.05819 17.6 6.31999ZM12 18.53C10.8177 18.5308 9.65701 18.213 8.64 17.61L8.4 17.46L5.91 18.12L6.57 15.69L6.41 15.44C5.55925 14.0667 5.24174 12.429 5.51762 10.8372C5.7935 9.24545 6.64361 7.81015 7.9069 6.80322C9.1702 5.79628 10.7589 5.28765 12.3721 5.37368C13.9853 5.4597 15.511 6.13441 16.66 7.26999C17.916 8.49818 18.635 10.1735 18.66 11.93C18.6442 13.6859 17.9355 15.3645 16.6882 16.6006C15.441 17.8366 13.756 18.5301 12 18.53ZM15.61 13.59C15.41 13.49 14.44 13.01 14.26 12.95C14.08 12.89 13.94 12.85 13.81 13.05C13.6144 13.3181 13.404 13.5751 13.18 13.82C13.07 13.96 12.95 13.97 12.75 13.82C11.6097 13.3694 10.6597 12.5394 10.06 11.47C9.85 11.12 10.26 11.14 10.64 10.39C10.6681 10.3359 10.6827 10.2759 10.6827 10.215C10.6827 10.1541 10.6681 10.0941 10.64 10.04C10.64 9.93999 10.19 8.95999 10.03 8.56999C9.87 8.17999 9.71 8.23999 9.58 8.22999H9.19C9.08895 8.23154 8.9894 8.25465 8.898 8.29776C8.8066 8.34087 8.72546 8.403 8.66 8.47999C8.43562 8.69817 8.26061 8.96191 8.14676 9.25343C8.03291 9.54495 7.98287 9.85749 8 10.17C8.0627 10.9181 8.34443 11.6311 8.81 12.22C9.6622 13.4958 10.8301 14.5293 12.2 15.22C12.9185 15.6394 13.7535 15.8148 14.58 15.72C14.8552 15.6654 15.1159 15.5535 15.345 15.3915C15.5742 15.2296 15.7667 15.0212 15.91 14.78C16.0428 14.4856 16.0846 14.1583 16.03 13.84C15.94 13.74 15.81 13.69 15.61 13.59Z" fill="currentColor"/>
                    </svg>
                    <span>WhatsApp</span>
                  </a>
                </div>

                <div className="flex items-center justify-center text-xs text-gray-500 dark:text-gray-400 mb-4 py-2 border-y border-gray-200 dark:border-gray-700">
                  <span className="uppercase tracking-wider">{t('available247')}</span>
                </div>

                {/* Specifications List */}
                <div className="space-y-3">
                  <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
                    {t('specifications')}
                  </h3>
                  
                  {[
                    { label: t('modelYear'), value: car.car_model },
                    { label: t('transmission'), value: car.car_transmission },
                    { label: t('seats'), value: car.car_seats },
                    { label: t('fuel'), value: car.car_fuel },
                    ...(car.car_speed_km ? [{ label: t('maxSpeed'), value: `${car.car_speed_km} km/h` }] : [])
                  ].map((spec, index) => (
                    <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0">
                      <span className="text-gray-600 dark:text-gray-400 text-xs uppercase tracking-wider">{spec.label}</span>
                      <span className="font-light text-gray-900 dark:text-gray-100 text-sm">{spec.value}</span>
                    </div>
                  ))}
                </div>

                {/* Trust Badges */}
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                  {[
                    { icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    ), text: t('fullInsuranceLabel') },
                    { icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ), text: t('bestPriceGuaranteed') },
                    { icon: (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    ), text: t('support247Badge') }
                  ].map((badge, index) => (
                    <div key={index} className="flex items-center gap-2 text-xs">
                      <div className="text-gray-900 dark:text-gray-100">
                        {badge.icon}
                      </div>
                      <span className="text-gray-600 dark:text-gray-400 uppercase tracking-wider">{badge.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {isImageViewerOpen && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-white dark:bg-gray-900"
          onClick={() => setIsImageViewerOpen(false)}
        >
          <button
            onClick={() => setIsImageViewerOpen(false)}
            className="absolute top-4 right-4 z-10 text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-400 transition-colors p-3"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div 
            className="relative max-w-7xl w-full h-full flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={allImages[currentImageIndex]} 
              alt={`${car.title.rendered} - ${currentImageIndex + 1}`}
              className="max-w-full max-h-[90vh] object-contain"
            />

            {allImages.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('prev');
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-400 transition-colors p-4"
                  aria-label="Previous image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateImage('next');
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 text-gray-900 dark:text-gray-100 hover:text-gray-600 dark:hover:text-gray-400 transition-colors p-4"
                  aria-label="Next image"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700 px-6 py-3 bg-white dark:bg-gray-900 font-light">
              {currentImageIndex + 1} / {allImages.length}
            </div>
          </div>
        </div>
      )}

      {/* Booking Modal */}
      {isBookingModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
          onClick={() => setIsBookingModalOpen(false)}
        >
          <div 
            className="bg-white dark:bg-gray-900 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-8 py-6 flex items-center justify-between z-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-light text-gray-900 dark:text-gray-100 mb-1 tracking-tight">
                  Réservation
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">Complétez vos informations</p>
              </div>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors p-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="p-8">
              <div className="mb-8 border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Véhicule</p>
                    <p className="text-2xl font-light text-gray-900 dark:text-gray-100">{car.title.rendered}</p>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-2">Prix / Jour</p>
                    <p className="text-4xl font-light text-gray-900 dark:text-gray-100">{car.car_price}€</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={bookingData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                    placeholder="Jean"
                  />
                  {formErrors.firstName && <p className="text-red-500 text-sm mt-1">{formErrors.firstName}</p>}
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={bookingData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                    placeholder="Dupont"
                  />
                  {formErrors.lastName && <p className="text-red-500 text-sm mt-1">{formErrors.lastName}</p>}
                </div>

                <div className="md:col-span-2">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={bookingData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                    placeholder="jean.dupont@example.com"
                  />
                  {formErrors.email && <p className="text-red-500 text-sm mt-1">{formErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                    {t('phone')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={bookingData.phoneNumber}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                    placeholder="+33 6 XX XX XX XX"
                  />
                  {formErrors.phoneNumber && <p className="text-red-500 text-sm mt-1">{formErrors.phoneNumber}</p>}
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                    Ville <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={bookingData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border border-gray-200 dark:border-gray-700 focus:outline-none focus:border-gray-900 dark:focus:border-gray-300 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-all duration-200"
                    placeholder="Paris"
                  />
                  {formErrors.city && <p className="text-red-500 text-sm mt-1">{formErrors.city}</p>}
                </div>

                <DateRangePicker
                  startDate={bookingData.startDate}
                  endDate={bookingData.endDate}
                  onStartDateChange={(date) => handleInputChange({ target: { name: 'startDate', value: date } } as React.ChangeEvent<HTMLInputElement>)}
                  onEndDateChange={(date) => handleInputChange({ target: { name: 'endDate', value: date } } as React.ChangeEvent<HTMLInputElement>)}
                  minDate={new Date().toISOString().split('T')[0]}
                  errors={formErrors}
                  isRTL={isRTL}
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                <button
                  type="button"
                  onClick={() => setIsBookingModalOpen(false)}
                  className="flex-1 px-8 py-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium transition-all duration-200 uppercase tracking-wide hover:border-gray-900 dark:hover:border-gray-300"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 px-8 py-4 border-2 border-gray-900 dark:border-gray-100 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 font-medium transition-all duration-300 uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white hover:text-gray-900 dark:hover:bg-gray-900 dark:hover:text-gray-100"
                >
                  {isSubmitting ? 'Envoi en cours...' : 'Confirmer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    </>
  );
};

export default CarDetailsPage;
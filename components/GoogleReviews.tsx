import React, { useEffect, useRef } from 'react';

const WIDGET_ID = 'e55bb1368d2c160f96365076a6b';

const GoogleReviews: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const PLACE_ID = 'ChIJOc1Qknjvrw0RTqSZ3I-Uib4';
  const GOOGLE_MAPS_EMBED_URL = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3396.909944937671!2d-8.013607400000001!3d31.636315999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdafef789250cd39%3A0xbe89948fdc99a44e!2sLocaMarrakech%20%7C%20Location%20Voiture%20Marrakech!5e0!3m2!1sfr!2sma!4v1774699683324!5m2!1sfr!2sma`;

  useEffect(() => {
    if (!containerRef.current) return;
    if (containerRef.current.querySelector('script')) return;

    // Inject CSS to fix Trustindex widget count
    const style = document.createElement('style');
    style.innerHTML = `
      .ti-header-rating-reviews, 
      .ti-widget .ti-header-rating-reviews,
      .ti-mobile .ti-header-rating-reviews {
          display: none !important;
      }
      .ti-header-rating::after,
      .ti-widget .ti-header-rating::after {
          content: " | 107 reviews" !important;
          display: inline-block !important;
          margin-left: 4px !important;
      }
      /* Ensure it looks good in mobile versions too */
      .ti-mobile .ti-header-rating::after {
          content: " | 107 reviews" !important;
      }
    `;
    document.head.appendChild(style);

    const script = document.createElement('script');
    script.src = `https://cdn.trustindex.io/loader.js?e55bb1368d2c160f96365076a6b`;
    script.defer = true;
    script.async = true;
    containerRef.current.appendChild(script);
  }, []);

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="h-px w-12 bg-primary"></div>
            <span className="text-sm font-semibold tracking-widest text-primary uppercase">Avis clients</span>
            <div className="h-px w-12 bg-primary"></div>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-2">
            Ce que disent nos clients
          </h2>
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-500 text-base">Avis réels vérifiés par Google</p>
            <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-green-100 shadow-sm animate-pulse">
              <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
              107 Avis Live • Note 5.0/5.0
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Trustindex Widget */}
          <div className="order-2 lg:order-1">
            <div ref={containerRef} className="min-h-[400px]" />
            <p className="text-center text-xs text-gray-400 mt-4 italic">
              *Le widget peut mettre quelques jours à synchroniser les nouveaux avis.
            </p>
          </div>

          {/* Google Maps Embed - Live Verification */}
          <div className="order-1 lg:order-2 bg-white p-2 rounded-xl shadow-xl overflow-hidden border border-gray-100 transform hover:scale-[1.02] transition-transform duration-500">
            <div className="bg-gray-900 text-white px-4 py-2 flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                <svg className="w-3 h-3 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                Statut Google Maps en Direct
              </span>
              <a 
                href={`https://www.google.com/maps/place/?q=place_id:${PLACE_ID}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] bg-primary text-black px-2 py-0.5 rounded font-bold hover:bg-white transition-colors"
              >
                VOIR TOUT
              </a>
            </div>
            <iframe 
              src={GOOGLE_MAPS_EMBED_URL} 
              width="100%" 
              height="350" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews;

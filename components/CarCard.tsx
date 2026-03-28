import React from 'react';
import type { Car } from '../types';
import { useAppContext } from '../context/AppContext';

interface CarCardProps {
  car: Car;
}

const CarCard: React.FC<CarCardProps> = ({ car }) => {
  const { t } = useAppContext();

  const FeatureIcon: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
    <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
      <span dangerouslySetInnerHTML={{ __html: icon }} className="w-4 h-4"></span>
      <span className="uppercase tracking-wider">{label}</span>
    </div>
  );

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all duration-300 hover:border-gray-900 dark:hover:border-gray-300 group">
      <a 
        href={`/${car.slug}`} 
        onClick={(e) => { 
          e.preventDefault(); 
          window.history.pushState({}, '', `/${car.slug}`); 
          window.dispatchEvent(new PopStateEvent('popstate')); 
        }} 
        className="block"
      >
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden border-b border-gray-200 dark:border-gray-800">
          {car.featured_media_url ? (
            <img 
              src={car.featured_media_url} 
              alt={car.title.rendered} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
            />
          ) : (
            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-gray-400 text-sm uppercase tracking-wider">No Image</span>
            </div>
          )}
          
          {/* Price Badge */}
          <div className="absolute top-4 right-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 px-4 py-2">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-light text-gray-900 dark:text-gray-100">{car.car_price}</span>
              <span className="text-xs text-gray-500 dark:text-gray-400">€/{t('day')}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-light text-gray-900 dark:text-gray-100 mb-6 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors">
            {car.title.rendered}
          </h3>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-gray-200 dark:border-gray-800">
            <FeatureIcon 
              icon='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>' 
              label={car.car_transmission} 
            />
            <FeatureIcon 
              icon='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>' 
              label={`${car.car_seats} ${t('seats')}`} 
            />
            <FeatureIcon 
              icon='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 003.375-3.375h1.5a1.125 1.125 0 011.125 1.125v-1.5a3.375 3.375 0 00-3.375-3.375H9.75" /></svg>' 
              label={car.car_model} 
            />
            <FeatureIcon 
              icon='<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1A3.75 3.75 0 0012 18z" /></svg>' 
              label={car.car_fuel} 
            />
          </div>

          {/* CTA Button */}
          <button className="w-full border-2 border-gray-900 dark:border-gray-100 text-gray-900 dark:text-gray-100 py-3 text-sm font-medium uppercase tracking-widest transition-colors hover:bg-gray-900 hover:text-white dark:hover:bg-gray-100 dark:hover:text-gray-900">
            {t('bookNow')}
          </button>
        </div>
      </a>
    </div>
  );
};

export default CarCard;
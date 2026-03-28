import React from 'react';
import { useCars } from '../hooks/useCars';
import CarCard from '../components/CarCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAppContext } from '../context/AppContext';

const CarsPage: React.FC = () => {
  const { cars, loading, error } = useCars();
  const { t } = useAppContext();

  return (
    <div className="bg-background-light dark:bg-background-dark py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">{t('ourFleet')}</h1>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
            {t('carsPageDescription')}
          </p>
        </div>
        
        {loading && <LoadingSpinner />}
        {error && <p className="text-center text-red-500">{error}</p>}
        
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cars.map(car => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CarsPage;
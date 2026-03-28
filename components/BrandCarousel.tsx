
import React from 'react';
import { brandLogos } from '../constants';

const BrandCarousel: React.FC = () => {
  return (
    <div className="bg-background-light dark:bg-secondary py-12">
      <p className="md:text-xl font-serif font-bold text-center mb-12">
        La principale agence de location de voitures au Maroc
      </p>
      <div className="w-full inline-flex flex-nowrap overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll">
          {brandLogos.map((brand) => (
            <li key={brand.name} className="flex-shrink-0">
              <img src={brand.src} alt={brand.name} className="h-10 md:h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
            </li>
          ))}
        </ul>
        <ul className="flex items-center justify-center md:justify-start [&_li]:mx-8 [&_img]:max-w-none animate-infinite-scroll" aria-hidden="true">
          {brandLogos.map((brand) => (
            <li key={brand.name} className="flex-shrink-0">
              <img src={brand.src} alt={brand.name} className="h-10 md:h-12 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300" />
            </li>
          ))}
        </ul>
      </div>
       <style>{`
          @keyframes infinite-scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-100%); }
          }
          .animate-infinite-scroll {
            animation: infinite-scroll 40s linear infinite;
          }
        `}</style>
    </div>
  );
};

export default BrandCarousel;

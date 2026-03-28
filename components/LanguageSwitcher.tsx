import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import type { Language } from '../types';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'EN', flag: 'https://upload.wikimedia.org/wikipedia/commons/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg' },
  { code: 'fr', name: 'FR', flag: 'https://flagpedia.net/data/flags/w1160/fr.webp' },
];

const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedLanguage = languages.find(lang => lang.code === language);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-center w-10 h-10"
        aria-label="Change language"
      >
        {selectedLanguage && (
          <img 
            src={selectedLanguage.flag} 
            alt={selectedLanguage.name}
            className="w-6 h-4 object-cover rounded-sm"
          />
        )}
        <svg className="w-3 h-3 text-gray-400 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute end-0 mt-2 w-20 bg-white dark:bg-gray-800 rounded-lg shadow-xl py-2 z-50 border border-gray-200 dark:border-gray-700">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                setLanguage(lang.code);
                setIsOpen(false);
              }}
              className={`w-full flex items-center justify-center py-2 px-3 transition-colors ${
                language === lang.code
                  ? 'bg-primary/20'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-label={`Switch to ${lang.name}`}
            >
              <img 
                src={lang.flag} 
                alt={lang.name}
                className="w-8 h-5 object-cover rounded-sm"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
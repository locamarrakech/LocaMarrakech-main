
import React, { useState, useEffect, useCallback } from 'react';
import { AppContextProvider, useAppContext } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CarsPage from './pages/CarsPage';
import CarDetailsPage from './pages/CarDetailsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import DynamicPage from './pages/DynamicPage';

const AppContent: React.FC = () => {
  const { language } = useAppContext();
  const [currentPath, setCurrentPath] = useState(window.location.pathname || '/');

  const handlePopState = useCallback(() => {
    setCurrentPath(window.location.pathname || '/');
  }, []);

  useEffect(() => {
    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [handlePopState]);

  const CurrentPage = () => {
    // Handle known routes first
    switch (currentPath) {
      case '/':
        return <HomePage />;
      case '/cars':
        return <CarsPage />;
      case '/about':
        return <AboutPage />;
      case '/contact':
        return <ContactPage />;
      case '/blog':
        return <BlogPage />;
      default:
        // For any other path, check the structure
        const pathSegments = currentPath.split('/').filter(Boolean);
        if (pathSegments.length === 1) {
          // Dynamic page: could be car, blog post, or WordPress page
          return <DynamicPage slug={pathSegments[0]} />;
        }
        if (pathSegments.length === 2 && pathSegments[0] === 'blog') {
          // /blog/:slug route
          return <DynamicPage slug={pathSegments[1]} />;
        }
        // If multiple segments, show home page
        return <HomePage />;
    }
  };

  const isRTL = language === 'ar';

  return (
    <div className={`bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-screen flex flex-col transition-colors duration-300 ${isRTL ? 'font-arabic' : 'font-sans'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Header />
      <main className="flex-grow">
        <CurrentPage />
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AppContextProvider>
      <AppContent />
    </AppContextProvider>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { fetchCarBySlug } from '../services/wordpressService';
import { fetchPostBySlug } from '../services/wordpressService';
import { fetchPageBySlug } from '../services/wordpressService';
import CarDetailsPage from './CarDetailsPage';
import BlogPostPage from './BlogPostPage';
import PageDetailPage from './PageDetailPage';
import LoadingSpinner from '../components/LoadingSpinner';

interface DynamicPageProps {
  slug: string;
}

const DynamicPage: React.FC<DynamicPageProps> = ({ slug }) => {
  const [contentType, setContentType] = useState<'car' | 'post' | 'page' | 'loading' | 'notfound'>('loading');
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    const detectContentType = async () => {
      try {
        // Check in order: Car first (most common), then Post, then Page
        // Try car first
        const car = await fetchCarBySlug(slug);
        if (car) {
          setContentType('car');
          setContent(car);
          return;
        }

        // Try blog post
        const post = await fetchPostBySlug(slug);
        if (post) {
          setContentType('post');
          setContent(post);
          return;
        }

        // Try WordPress page
        const page = await fetchPageBySlug(slug);
        if (page) {
          setContentType('page');
          setContent(page);
          return;
        }

        // Nothing found
        setContentType('notfound');
      } catch (error) {
        console.error('Error detecting content type:', error);
        setContentType('notfound');
      }
    };

    detectContentType();
  }, [slug]);

  // Show loading while checking
  if (contentType === 'loading') {
    return (
      <div className="min-h-screen py-20">
        <LoadingSpinner />
      </div>
    );
  }

  // Route to appropriate component
  switch (contentType) {
    case 'car':
      return <CarDetailsPage slug={slug} />;
    case 'post':
      return <BlogPostPage slug={slug} />;
    case 'page':
      return <PageDetailPage slug={slug} />;
    case 'notfound':
    default:
      return (
        <div className="min-h-screen py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-serif font-bold text-gray-900 dark:text-white mb-4">
              Contenu non trouvé
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              La page demandée n'existe pas.
            </p>
          </div>
        </div>
      );
  }
};

export default DynamicPage;


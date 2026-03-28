import React, { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  schema?: object | object[];
  keywords?: string;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'LocaMarrakech - Location de Voitures de Luxe à Marrakech',
  description = 'LocaMarrakech est une entreprise de location de voitures de luxe à Marrakech. Voitures neuves et bien entretenues, prix compétitifs, service 24/7.',
  image = '/logo.png',
  url = typeof window !== 'undefined' ? window.location.href : 'https://locamarrakech.com',
  type = 'website',
  schema,
  keywords = 'location voiture marrakech, voiture de luxe marrakech, location voiture maroc, rental car marrakech',
  author = 'LocaMarrakech',
  publishedTime,
  modifiedTime,
}) => {
  useEffect(() => {
    // Get base URL for absolute image URLs
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://locamarrakech.com';
    const absoluteImage = image.startsWith('http') ? image : `${baseUrl}${image}`;

    // Update document title
    document.title = title;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, attribute: string = 'name') => {
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    // Basic meta tags
    updateMetaTag('description', description);
    updateMetaTag('keywords', keywords);
    updateMetaTag('author', author);

    // OpenGraph tags
    updateMetaTag('og:title', title, 'property');
    updateMetaTag('og:description', description, 'property');
    updateMetaTag('og:image', absoluteImage, 'property');
    updateMetaTag('og:url', url, 'property');
    updateMetaTag('og:type', type, 'property');
    updateMetaTag('og:site_name', 'LocaMarrakech', 'property');
    updateMetaTag('og:locale', 'fr_FR', 'property');

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    updateMetaTag('twitter:image', absoluteImage);

    // Article specific tags
    if (type === 'article' && publishedTime) {
      updateMetaTag('article:published_time', publishedTime, 'property');
    }
    if (type === 'article' && modifiedTime) {
      updateMetaTag('article:modified_time', modifiedTime, 'property');
    }
    if (type === 'article' && author) {
      updateMetaTag('article:author', author, 'property');
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);

    // Remove existing schema scripts
    const existingSchemas = document.querySelectorAll('script[type="application/ld+json"]');
    existingSchemas.forEach((script) => script.remove());

    // Add schema if provided
    if (schema) {
      // Handle array of schemas
      const schemas = Array.isArray(schema) ? schema : [schema];
      schemas.forEach((schemaItem) => {
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schemaItem);
        document.head.appendChild(script);
      });
    }
  }, [title, description, image, url, type, schema, keywords, author, publishedTime, modifiedTime]);

  return null;
};

export default SEO;


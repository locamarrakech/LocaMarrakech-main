import type { Car } from '../types';
import type { BlogPost } from '../types';

const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://locamarrakech.com';

export const generateCarSchema = (car: Car): object => {
  const carUrl = `${SITE_URL}/${car.slug}`;
  const carImage = car.featured_media_url || '/logo.png';
  
  // Strip HTML from content for description
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };
  
  const description = stripHtml(car.content.rendered).substring(0, 160) || 
    `Location de ${car.title.rendered} à Marrakech. Prix: ${car.car_price}€/jour.`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: car.title.rendered,
    description: description,
    image: carImage,
    url: carUrl,
    brand: {
      '@type': 'Brand',
      name: 'LocaMarrakech',
    },
    offers: {
      '@type': 'Offer',
      price: car.car_price,
      priceCurrency: 'EUR',
      availability: 'https://schema.org/InStock',
      url: carUrl,
      priceValidUntil: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5.0',
      reviewCount: '107',
      bestRating: '5',
      worstRating: '1',
    },
    additionalProperty: [
      {
        '@type': 'PropertyValue',
        name: 'Transmission',
        value: car.car_transmission || 'N/A',
      },
      {
        '@type': 'PropertyValue',
        name: 'Seats',
        value: car.car_seats || 'N/A',
      },
      {
        '@type': 'PropertyValue',
        name: 'Fuel Type',
        value: car.car_fuel || 'N/A',
      },
      {
        '@type': 'PropertyValue',
        name: 'Model Year',
        value: car.car_model || 'N/A',
      },
      ...(car.car_speed_km ? [{
        '@type': 'PropertyValue',
        name: 'Max Speed',
        value: `${car.car_speed_km} km/h`,
      }] : []),
    ],
  };
};

export const generateBlogPostSchema = (post: BlogPost): object => {
  const postUrl = `${SITE_URL}/${post.slug}`;
  const postImage = post.featured_media_url || '/logo.png';
  
  // Strip HTML from content for description
  const stripHtml = (html: string): string => {
    if (typeof document === 'undefined') {
      // Server-side: simple regex-based stripping
      return html.replace(/<[^>]*>/g, '').replace(/&nbsp;/g, ' ').trim();
    }
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };
  
  const description = post.excerpt?.rendered 
    ? stripHtml(post.excerpt.rendered)
    : stripHtml(post.content.rendered).substring(0, 160);

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title.rendered,
    description: description,
    image: postImage,
    url: postUrl,
    datePublished: post.date,
    dateModified: post.modified,
    author: {
      '@type': 'Organization',
      name: 'LocaMarrakech',
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: 'LocaMarrakech',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': postUrl,
    },
  };
};

export const generateOrganizationSchema = (): object => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LocaMarrakech',
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Location de voitures de luxe à Marrakech. Voitures neuves et bien entretenues, prix compétitifs, service 24/7.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Rue des Vieux Marrakechis',
      addressLocality: 'Marrakech',
      postalCode: '40000',
      addressCountry: 'MA',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+212-6-27-57-30-69',
      contactType: 'Customer Service',
      areaServed: 'MA',
      availableLanguage: ['fr', 'en', 'ar'],
    },
    sameAs: [
      'https://www.facebook.com/locamarrakech/',
      'https://www.instagram.com/locamarrakech/',
    ],
  };
};

export const generateWebsiteSchema = (): object => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'LocaMarrakech',
    url: SITE_URL,
    description: 'Location de voitures de luxe à Marrakech',
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/cars?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
};


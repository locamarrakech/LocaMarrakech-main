
import type { Car, Media, BlogPost, WordPressPage } from '../types';

const API_BASE_URL = 'https://lm.pediamower.top/wp-json/wp/v2';

const mediaCache = new Map<number, Media>();

export const fetchMediaById = async (id: number): Promise<Media | null> => {
  if (mediaCache.has(id)) {
    return mediaCache.get(id) || null;
  }
  try {
    const response = await fetch(`${API_BASE_URL}/media/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch media with id ${id}`);
    }
    const data: Media = await response.json();
    mediaCache.set(id, data);
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchCars = async (): Promise<Car[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cars?_embed&per_page=100`);
    if (!response.ok) {
      throw new Error('Failed to fetch cars');
    }
    const cars: Car[] = await response.json();

    // Enrich cars with featured media URL
    const enrichedCars = await Promise.all(
      cars.map(async (car) => {
        if (car.featured_media) {
          const media = await fetchMediaById(car.featured_media);
          car.featured_media_url = media?.source_url;
        }
        return car;
      })
    );

    return enrichedCars;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchLuxuryCars = async (): Promise<Car[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/cars?_embed&per_page=100`);
    if (!response.ok) {
      throw new Error('Failed to fetch luxury cars');
    }
    const cars: Car[] = await response.json();

    // Filter only luxury cars (cars with car_luxury field set to true)
    const luxuryCars = cars.filter(car => car.car_luxury === true);

    // Enrich cars with featured media URL
    const enrichedLuxuryCars = await Promise.all(
      luxuryCars.map(async (car) => {
        if (car.featured_media) {
          const media = await fetchMediaById(car.featured_media);
          car.featured_media_url = media?.source_url;
        }
        return car;
      })
    );

    return enrichedLuxuryCars;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchCarById = async (id: string): Promise<Car | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/cars/${id}?_embed`);
        if (!response.ok) {
            throw new Error(`Failed to fetch car with id ${id}`);
        }
        let car: Car = await response.json();
        return car;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const fetchCarBySlug = async (slug: string): Promise<Car | null> => {
    try {
        const response = await fetch(`${API_BASE_URL}/cars?slug=${slug}&_embed`);
        if (!response.ok) {
            throw new Error(`Failed to fetch car with slug ${slug}`);
        }
        const cars: Car[] = await response.json();
        if (cars.length === 0) {
            return null;
        }
        let car: Car = cars[0];

        // Enrich with featured media URL
        if (car.featured_media) {
            const media = await fetchMediaById(car.featured_media);
            car.featured_media_url = media?.source_url;
        }

        // Enrich with gallery URLs
        if (car.car_gallery && car.car_gallery.length > 0) {
            const galleryMedia = await Promise.all(
                car.car_gallery.map(mediaId => fetchMediaById(mediaId))
            );
            car.gallery_urls = galleryMedia
                .filter((media): media is Media => media !== null)
                .map(media => media.source_url);
        }
        
        return car;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const fetchPosts = async (perPage: number = 10): Promise<BlogPost[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts?_embed&per_page=${perPage}&orderby=date&order=desc`);
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    const posts: BlogPost[] = await response.json();

    // Enrich posts with featured media URL
    const enrichedPosts = await Promise.all(
      posts.map(async (post) => {
        if (post.featured_media) {
          const media = await fetchMediaById(post.featured_media);
          post.featured_media_url = media?.source_url;
        } else if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
          post.featured_media_url = post._embedded['wp:featuredmedia'][0].source_url;
        }
        return post;
      })
    );

    return enrichedPosts;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchPostBySlug = async (slug: string): Promise<BlogPost | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/posts?slug=${slug}&_embed`);
    if (!response.ok) {
      throw new Error(`Failed to fetch post with slug ${slug}`);
    }
    const posts: BlogPost[] = await response.json();
    if (posts.length === 0) {
      return null;
    }
    let post: BlogPost = posts[0];

    // Enrich with featured media URL
    if (post.featured_media) {
      const media = await fetchMediaById(post.featured_media);
      post.featured_media_url = media?.source_url;
    } else if (post._embedded?.['wp:featuredmedia']?.[0]?.source_url) {
      post.featured_media_url = post._embedded['wp:featuredmedia'][0].source_url;
    }
    
    return post;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const fetchPages = async (): Promise<WordPressPage[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pages?per_page=100&orderby=menu_order&order=asc`);
    if (!response.ok) {
      throw new Error('Failed to fetch pages');
    }
    const pages: WordPressPage[] = await response.json();
    return pages;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchPageBySlug = async (slug: string): Promise<WordPressPage | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/pages?slug=${slug}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch page with slug ${slug}`);
    }
    const pages: WordPressPage[] = await response.json();
    if (pages.length === 0) {
      return null;
    }
    return pages[0];
  } catch (error) {
    console.error(error);
    return null;
  }
};

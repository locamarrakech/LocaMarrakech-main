
export interface Car {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  featured_media: number;
  featured_media_url?: string;
  car_price: string;
  car_transmission: string;
  car_seats: string;
  car_fuel: string;
  car_model: string;
  car_speed_km: string;
  car_gallery: number[];
  gallery_urls?: string[];
  car_description_en?: string;  // English description (HTML)
  car_description_fr?: string;  // French description (HTML)
  car_luxury?: boolean;  // Luxury car checkbox field
  acf: {
    car_features?: {
      label: string;
      value: string;
    }[];
  }
}

export interface Media {
  id: number;
  source_url: string;
  alt_text: string;
}

export interface BlogPost {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  excerpt: {
    rendered: string;
  };
  featured_media: number;
  featured_media_url?: string;
  date: string;
  modified: string;
  author: number;
  _embedded?: {
    author?: Array<{
      name: string;
    }>;
    'wp:featuredmedia'?: Array<{
      source_url: string;
    }>;
  };
}

export interface WordPressPage {
  id: number;
  slug: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
  };
  date: string;
  modified: string;
}

export type Language = 'fr' | 'en';
export type Theme = 'light' | 'dark';

export interface AppContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  translations: Record<string, Record<Language, string>>;
  t: (key: string) => string;
}

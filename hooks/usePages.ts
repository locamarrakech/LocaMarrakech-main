import { useState, useEffect, useCallback } from 'react';
import type { WordPressPage } from '../types';
import { fetchPages, fetchPageBySlug } from '../services/wordpressService';

export const usePages = () => {
  const [pages, setPages] = useState<WordPressPage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadPages = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPages();
      setPages(data);
    } catch (err) {
      setError('Failed to load pages.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadPages();
  }, [loadPages]);

  return { pages, loading, error, refresh: loadPages };
};

export const usePage = (slug: string) => {
  const [page, setPage] = useState<WordPressPage | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadPage = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPageBySlug(slug);
      setPage(data);
    } catch (err) {
      setError('Failed to load page.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadPage();
  }, [loadPage]);

  return { page, loading, error };
};


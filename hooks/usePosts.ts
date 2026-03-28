import { useState, useEffect, useCallback } from 'react';
import type { BlogPost } from '../types';
import { fetchPosts, fetchPostBySlug } from '../services/wordpressService';

export const usePosts = (perPage: number = 10) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPosts(perPage);
      setPosts(data);
    } catch (err) {
      setError('Failed to load posts.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [perPage]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  return { posts, loading, error, refresh: loadPosts };
};

export const usePost = (slug: string) => {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadPost = useCallback(async () => {
    if (!slug) return;
    try {
      setLoading(true);
      setError(null);
      const data = await fetchPostBySlug(slug);
      setPost(data);
    } catch (err) {
      setError('Failed to load post.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadPost();
  }, [loadPost]);

  return { post, loading, error };
};


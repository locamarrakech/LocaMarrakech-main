
import { useState, useEffect, useCallback } from 'react';
import type { Car } from '../types';
import { fetchCars, fetchLuxuryCars, fetchCarBySlug } from '../services/wordpressService';

export const useCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadCars = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchCars();
      setCars(data);
    } catch (err) {
      setError('Failed to load cars.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCars();
  }, [loadCars]);

  return { cars, loading, error, refresh: loadCars };
};

export const useLuxuryCars = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadLuxuryCars = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchLuxuryCars();
      setCars(data);
    } catch (err) {
      setError('Failed to load luxury cars.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadLuxuryCars();
  }, [loadLuxuryCars]);

  return { cars, loading, error, refresh: loadLuxuryCars };
};

export const useCar = (slug: string) => {
    const [car, setCar] = useState<Car | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const loadCar = useCallback(async () => {
        if (!slug) return;
        try {
            setLoading(true);
            setError(null);
            const data = await fetchCarBySlug(slug);
            setCar(data);
        } catch (err) {
            setError('Failed to load car details.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [slug]);

    useEffect(() => {
        loadCar();
    }, [loadCar]);

    return { car, loading, error };
};

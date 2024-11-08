import { useState, useEffect } from 'react';
import axios from 'axios';

const cache = new Map();

export function useApi(url, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cacheDuration = 5 * 60 * 1000 } = options; // 5 minutes default

  useEffect(() => {
    const fetchData = async () => {
      // Check cache first
      const cachedData = cache.get(url);
      if (cachedData && Date.now() - cachedData.timestamp < cacheDuration) {
        setData(cachedData.data);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await axios.get(url);
        setData(response.data);
        // Cache the response
        cache.set(url, {
          data: response.data,
          timestamp: Date.now()
        });
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, cacheDuration]);

  return { data, loading, error };
} 
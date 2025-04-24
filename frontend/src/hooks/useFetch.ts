import { useState, useEffect } from 'react';
import axios, { AxiosRequestConfig, AxiosError } from 'axios';

type UseFetchResult<T> = {
  data: T | null;
  loading: boolean;
  error: AxiosError | null;
};

const useFetch = <T = unknown>(
  url: string,
  options: AxiosRequestConfig = {}
): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    if (!url) return;

    const controller = new AbortController();

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios<T>({
          url,
          signal: controller.signal,
          ...options,
        });
        setData(response.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError(err as AxiosError);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => controller.abort();
  }, [url, JSON.stringify(options)]);

  return { data, loading, error };
};

export default useFetch;

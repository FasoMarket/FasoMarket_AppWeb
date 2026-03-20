import { useState, useEffect, useCallback } from 'react';

export const useApi = (apiFn, deps = [], runOnMount = true) => {
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(runOnMount);
  const [error,   setError]   = useState(null);

  const execute = useCallback(async (...args) => {
    try {
      setLoading(true);
      setError(null);
      const res = await apiFn(...args);
      setData(res.data);
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Une erreur est survenue';
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, deps);

  useEffect(() => { if (runOnMount) execute(); }, []);

  return { data, loading, error, execute, setData };
};

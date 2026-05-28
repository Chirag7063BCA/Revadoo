import { useEffect, useState } from 'react';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const getToken = () => localStorage.getItem('token') || localStorage.getItem('authToken') || '';

const request = async (path, options = {}) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
};

export const useLotteries = () => {
  const [lotteries, setLotteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchLotteries = async () => {
      try {
        setLoading(true);
        const response = await request('/api/lotteries/published');
        const liveLotteries = Array.isArray(response.data)
          ? response.data.filter((lottery) => lottery.status === 'published')
          : [];

        if (mounted) {
          setLotteries(liveLotteries);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setError(err.message || 'Failed to fetch lotteries');
          setLotteries([]);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchLotteries();
    const timer = window.setInterval(fetchLotteries, 15000);

    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  return { lotteries, loading, error };
};

export const useUserTickets = (deps = []) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchTickets = async () => {
      if (!getToken()) {
        if (mounted) {
          setTickets([]);
          setLoading(false);
          setError(null);
        }
        return;
      }

      try {
        setLoading(true);
        const response = await request('/api/lotteries/user/my-tickets');
        if (mounted) {
          setTickets(response.data || []);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          if (err.message?.toLowerCase().includes('not authorized')) {
            setTickets([]);
            setError(null);
          } else {
            setError(err.message || 'Failed to fetch tickets');
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchTickets();
    return () => {
      mounted = false;
    };
  }, deps);

  return { tickets, loading, error };
};

export const useLotteryResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;

    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await request('/api/lotteries/results');
        if (mounted) {
          setResults(response.data || []);
          setError(null);
        }
      } catch (err) {
        if (mounted) {
          setResults([]);
          setError(err.message || 'Failed to fetch results');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchResults();
    const timer = window.setInterval(fetchResults, 15000);

    return () => {
      mounted = false;
      window.clearInterval(timer);
    };
  }, []);

  return { results, loading, error };
};

export const buyLotteryTicket = async (lotteryId) => {
  const token = getToken();
  if (!token) {
    throw new Error('Please login first to buy a ticket');
  }

  const response = await request(`/api/lotteries/${lotteryId}/buy`, {
    method: 'POST',
  });

  const newBalance = response?.data?.newCreds;
  window.dispatchEvent(
    new CustomEvent('balanceUpdated', {
      detail: { newBalance },
    })
  );

  return response;
};
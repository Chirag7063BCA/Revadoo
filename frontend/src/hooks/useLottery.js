import { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE_URL || '';

const getToken = () =>
  localStorage.getItem('token') ||
  localStorage.getItem('authToken') ||
  localStorage.getItem('jwt') ||
  localStorage.getItem('accessToken') ||
  localStorage.getItem('userToken') ||
  sessionStorage.getItem('token') ||
  sessionStorage.getItem('authToken') ||
  '';

const api = axios.create({
  baseURL: API_BASE,
});

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Custom hook to fetch published lotteries
 */
export const useLotteries = () => {
  const [lotteries, setLotteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchLotteries = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/lotteries/published');
        if (response.data.success) {
          setLotteries(response.data.data);
          setError(null);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch lotteries');
        setLotteries([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLotteries();

    const pollId = window.setInterval(fetchLotteries, 15000);
    return () => window.clearInterval(pollId);
  }, []);

  return { lotteries, loading, error };
};

/**
 * Custom hook to fetch user's tickets
 */
export const useUserTickets = (deps = []) => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserTickets = async () => {
      const token = getToken();
      if (!token) {
        setTickets([]);
        setError(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await api.get('/api/lotteries/user/my-tickets', {
          headers: authHeaders(),
        });
        if (response.data.success) {
          setTickets(response.data.data);
          setError(null);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          // User not authenticated, skip error
          setTickets([]);
        } else {
          setError(err.response?.data?.message || 'Failed to fetch tickets');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserTickets();
  }, deps);

  return { tickets, loading, error };
};

/**
 * Custom hook to fetch lottery results
 */
export const useLotteryResults = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const response = await api.get('/api/lotteries/results');
        if (response.data.success) {
          setResults(response.data.data);
          setError(null);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch results');
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();

    const pollId = window.setInterval(fetchResults, 15000);
    return () => window.clearInterval(pollId);
  }, []);

  return { results, loading, error };
};

/**
 * Function to buy a lottery ticket
 */
export const buyLotteryTicket = async (lotteryId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Please login first to buy a ticket');
    }

    const response = await api.post(`/api/lotteries/${lotteryId}/buy`, {}, {
      headers: authHeaders(),
    });
    return response.data;
  } catch (err) {
    throw new Error(err.response?.data?.message || err.message || 'Failed to buy ticket');
  }
};

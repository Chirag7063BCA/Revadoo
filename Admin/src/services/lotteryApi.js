const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

const getToken = () =>
  localStorage.getItem('token') ||
  localStorage.getItem('authToken') ||
  localStorage.getItem('jwt') ||
  localStorage.getItem('accessToken') ||
  '';

const request = async (path, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || `Request failed (${res.status})`);
  }

  return data;
};

export const createLotteryApi = (payload) =>
  request('/api/lotteries/admin/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const getAdminLotteriesApi = () =>
  request('/api/lotteries/admin/list', { method: 'GET' });

export const publishLotteryApi = (lotteryId) =>
  request(`/api/lotteries/admin/${lotteryId}/publish`, { method: 'POST' });

export const deleteLotteryApi = (lotteryId) =>
  request(`/api/lotteries/admin/${lotteryId}/delete`, { method: 'DELETE' });

export const getLotteryTicketsApi = (lotteryId, status = '') =>
  request(
    `/api/lotteries/admin/${lotteryId}/tickets${status ? `?status=${encodeURIComponent(status)}` : ''}`,
    { method: 'GET' }
  );

export const announceWinnerApi = (lotteryId, payload) =>
  request(`/api/lotteries/admin/${lotteryId}/announce`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

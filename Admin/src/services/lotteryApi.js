const BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

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

  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
};

export const createLotteryApi = (payload) =>
  request('/api/lotteries/admin/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateLotteryApi = (id, payload) =>
  request(`/api/lotteries/admin/${id}/update`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });

export const getAdminLotteriesApi = () => request('/api/lotteries/admin/list');

export const publishLotteryApi = (id) =>
  request(`/api/lotteries/admin/${id}/publish`, { method: 'POST' });

export const announceWinnerApi = (id, payload) =>
  request(`/api/lotteries/admin/${id}/announce`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const deleteLotteryApi = (id) =>
  request(`/api/lotteries/admin/${id}/delete`, { method: 'DELETE' });

export const getLotteryTicketsApi = (id, status = '', page = 1) =>
  request(
    `/api/lotteries/admin/${id}/tickets?status=${encodeURIComponent(status || '')}&page=${page}&limit=50`
  );
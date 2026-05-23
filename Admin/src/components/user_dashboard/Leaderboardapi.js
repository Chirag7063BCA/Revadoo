
export const BASE = "http://localhost:5000";

/** Tries every common key — works regardless of what your app uses */
export const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("authToken") ||
  localStorage.getItem("jwt") ||
  localStorage.getItem("accessToken") ||
  localStorage.getItem("userToken") ||
  sessionStorage.getItem("token") ||
  sessionStorage.getItem("authToken") ||
  "";

/** GET helper — returns parsed JSON or null on failure */
export const apiGet = async (path) => {
  const res = await fetch(`${BASE}${path}`, {
    headers: { Authorization: `Bearer ${getToken()}` },
  });
  if (!res.ok) return null;
  return res.json();
};

/** Generic fetch helper for POST / PUT */
export const apiFetch = async (path, opts = {}) => {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...(opts.headers || {}),
    },
  });
  if (!res.ok) return null;
  return res.json();
};
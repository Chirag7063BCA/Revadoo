const BASE = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/+$/, "");

export const apiUrl = (path = "") => `${BASE}/api${path}`;
export const apiOriginUrl = () => BASE;
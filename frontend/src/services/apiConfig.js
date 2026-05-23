const normalizeBaseUrl = (value) => {
  const trimmed = (value || "").replace(/\/+$/, "");
  if (!trimmed) {
    return "http://localhost:5000/api";
  }

  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

export const API_BASE_URL = normalizeBaseUrl(import.meta.env.VITE_API_BASE_URL);
export const API_ORIGIN_URL = API_BASE_URL.replace(/\/api$/, "");

export const apiUrl = (path = "") => {
  if (!path) return API_BASE_URL;
  return `${API_BASE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};

export const apiOriginUrl = (path = "") => {
  if (!path) return API_ORIGIN_URL;
  return `${API_ORIGIN_URL}${path.startsWith("/") ? "" : "/"}${path}`;
};
import { apiUrl } from "./apiConfig";

const API_BASE = apiUrl("/shortlinks");

const getToken = () => localStorage.getItem("token");

const authHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const fetchShortlinks = async () => {
  const response = await fetch(apiUrl("/shortlinks/list"));
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to load shortlinks");
  }

  return data.links || [];
};

export const fetchAdminShortlinks = async () => {
  const response = await fetch(apiUrl("/shortlinks/admin/list"), {
    headers: {
      ...authHeaders(),
    },
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to load admin shortlinks");
  }

  return data.links || [];
};

export const fetchMyShortlinkCompletions = async () => {
  const response = await fetch(apiUrl("/shortlinks/my/completions"), {
    headers: {
      ...authHeaders(),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Failed to load shortlink completions");
  }

  return data.completions || [];
};

export const fetchShortlinkByCode = async (code) => {
  const response = await fetch(apiUrl(`/shortlinks/public/${encodeURIComponent(code)}`));
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Shortlink not found");
  }

  return data.link;
};

export const startShortlinkVisit = async (code) => {
  const response = await fetch(apiUrl("/shortlinks/start"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ code }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Unable to start shortlink visit");
  }

  return data;
};

export const verifyShortlinkVisit = async ({ code, visitToken }) => {
  const response = await fetch(apiUrl("/shortlinks/verify"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ code, visitToken }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Unable to verify shortlink");
  }

  return data;
};

export const completeShortlinkDirect = async ({ code, visitToken }) => {
  const response = await fetch(apiUrl("/shortlinks/complete-direct"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
    },
    body: JSON.stringify({ code, visitToken }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Unable to complete shortlink");
  }

  return data;
};

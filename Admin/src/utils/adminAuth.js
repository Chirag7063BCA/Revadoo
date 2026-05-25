const ADMIN_AUTH_KEY = "adminAuth";
const ADMIN_API_BASE = "http://localhost:5000/api";

export const ADMIN_CREDENTIALS = {
  email: "admin@revadoo.com",
  password: "Admin@123",
};

export const isAdminAuthenticated = () => {
  try {
    const isMarkedAdmin = localStorage.getItem(ADMIN_AUTH_KEY) === "true";
    const token = localStorage.getItem("token");

    if (isMarkedAdmin && !token) {
      localStorage.removeItem(ADMIN_AUTH_KEY);
      return false;
    }

    return isMarkedAdmin && Boolean(token);
  } catch (error) {
    console.warn("Unable to read admin auth state", error);
    return false;
  }
};

export const loginAdmin = async ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  try {
    const response = await fetch(`${ADMIN_API_BASE}/auth/admin-login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: normalizedEmail, password }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return false;
    }

    localStorage.setItem(ADMIN_AUTH_KEY, "true");
    if (data.token) {
      localStorage.setItem("token", data.token);
    }
    localStorage.setItem(
      "user",
      JSON.stringify(data.user || { username: "Admin", creds: 0 })
    );
  } catch (error) {
    console.warn("Unable to persist admin auth state", error);
    return false;
  }

  return true;
};

export const logoutAdmin = () => {
  try {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  } catch (error) {
    console.warn("Unable to clear admin auth state", error);
  }
};

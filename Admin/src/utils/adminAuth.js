const ADMIN_AUTH_KEY = "adminAuth";

export const ADMIN_CREDENTIALS = {
  email: "admin@revadoo.com",
  password: "Admin@123",
};

export const isAdminAuthenticated = () => {
  try {
    return localStorage.getItem(ADMIN_AUTH_KEY) === "true";
  } catch (error) {
    console.warn("Unable to read admin auth state", error);
    return false;
  }
};

export const loginAdmin = ({ email, password }) => {
  const normalizedEmail = email.trim().toLowerCase();
  const isValid =
    normalizedEmail === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password;

  if (!isValid) return false;

  try {
    localStorage.setItem(ADMIN_AUTH_KEY, "true");
    localStorage.setItem(
      "user",
      JSON.stringify({
        username: "Admin",
        creds: 0,
      })
    );
  } catch (error) {
    console.warn("Unable to persist admin auth state", error);
  }

  return true;
};

export const logoutAdmin = () => {
  try {
    localStorage.removeItem(ADMIN_AUTH_KEY);
    localStorage.removeItem("token");
  } catch (error) {
    console.warn("Unable to clear admin auth state", error);
  }
};

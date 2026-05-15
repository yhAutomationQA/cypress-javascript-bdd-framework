const CREDENTIALS = Object.freeze({
  ADMIN: { email: "admin@example.com", password: "admin123" },
  STANDARD: { email: "user@example.com", password: "user123" },
  LOCKED: { email: "locked@example.com", password: "user123" },
  INVALID: { email: "invalid@example.com", password: "wrongpass" },
});

const ROUTES = Object.freeze({
  LOGIN: "/login",
  DASHBOARD: "/dashboard",
  FORGOT_PASSWORD: "/forgot-password",
  REGISTER: "/register",
  PROFILE: "/profile",
  SETTINGS: "/settings",
});

const API_ENDPOINTS = Object.freeze({
  LOGIN: "/auth/login",
  LOGOUT: "/auth/logout",
  USERS: "/users",
  REFRESH: "/auth/refresh",
  RESET: "/test/reset",
  SEED: "/test/seed",
});

const ERROR_MESSAGES = Object.freeze({
  REQUIRED_EMAIL: "Email is required",
  REQUIRED_PASSWORD: "Password is required",
  INVALID_CREDENTIALS: "Invalid email or password",
  ACCOUNT_LOCKED: "Your account has been locked",
  SESSION_EXPIRED: "Your session has expired",
  ACCESS_DENIED: "Access denied",
});

const TIMEOUTS = () => {
  const getEnv = (key, fallback) => {
    try {
      return typeof Cypress !== "undefined" && Cypress.env
        ? Cypress.env(key) || fallback
        : fallback;
    } catch {
      return fallback;
    }
  };
  return Object.freeze({
    IMPLICIT: parseInt(getEnv("IMPLICIT_TIMEOUT", "5000"), 10),
    EXPLICIT: parseInt(getEnv("EXPLICIT_TIMEOUT", "10000"), 10),
    PAGE_LOAD: parseInt(getEnv("PAGE_LOAD_TIMEOUT", "30000"), 10),
    NETWORK: 15000,
    ANIMATION: 1000,
  });
};

const VIEWPORTS = Object.freeze({
  DESKTOP: { width: 1280, height: 720 },
  TABLET: { width: 768, height: 1024 },
  MOBILE: { width: 375, height: 812 },
});

const SORT_ORDERS = Object.freeze({
  ASC: "asc",
  DESC: "desc",
});

const HTTP_METHODS = Object.freeze({
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
});

module.exports = {
  CREDENTIALS,
  ROUTES,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  TIMEOUTS,
  VIEWPORTS,
  SORT_ORDERS,
  HTTP_METHODS,
};

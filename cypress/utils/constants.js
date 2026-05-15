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
  LOGIN: "/api/v1/auth/login",
  LOGOUT: "/api/v1/auth/logout",
  USERS: "/api/v1/users",
  REFRESH: "/api/v1/auth/refresh",
  RESET: "/api/v1/test/reset",
  SEED: "/api/v1/test/seed",
});

const ERROR_MESSAGES = Object.freeze({
  REQUIRED_EMAIL: "Email is required",
  REQUIRED_PASSWORD: "Password is required",
  INVALID_CREDENTIALS: "Invalid email or password",
  ACCOUNT_LOCKED: "Your account has been locked",
  SESSION_EXPIRED: "Your session has expired",
  ACCESS_DENIED: "Access denied",
});

const TIMEOUTS = Object.freeze({
  IMPLICIT: 5000,
  EXPLICIT: 10000,
  PAGE_LOAD: 30000,
  NETWORK: 15000,
  ANIMATION: 1000,
});

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

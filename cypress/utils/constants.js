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
  POSTS: "/posts",
  POST_BY_ID: (id) => `/posts/${id}`,
  POST_COMMENTS: (id) => `/posts/${id}/comments`,
  USERS: "/users",
  USER_BY_ID: (id) => `/users/${id}`,
  COMMENTS: "/comments",
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

const HTTP_STATUS = Object.freeze({
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE: 422,
  TOO_MANY: 429,
  SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
});

const HTTP_METHODS = Object.freeze({
  GET: "GET",
  POST: "POST",
  PUT: "PUT",
  PATCH: "PATCH",
  DELETE: "DELETE",
  HEAD: "HEAD",
  OPTIONS: "OPTIONS",
});

module.exports = {
  CREDENTIALS,
  ROUTES,
  API_ENDPOINTS,
  ERROR_MESSAGES,
  TIMEOUTS,
  HTTP_STATUS,
  HTTP_METHODS,
};

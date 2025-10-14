export const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// ✅ Helper to build full API URLs
export const apiUrl = (path) => `${BASE_URL}${path}`;

export const API_PATHS = {
  AUTH: {
    LOGIN: "/api/v1/auth/login",
    REGISTER: "/api/v1/auth/register",
    GOOGLE: "/api/v1/auth/google",
    CHANGE_PASSWORD: "/api/v1/auth/change-password",
    GET_USER_INFO: "/api/v1/auth/me",
  },

  DASHBOARD: {
    GET_DATA: "/api/v1/dashboard",
  },

  USER: {
    // ✔ Points to /users, not /auth
    ME: "/api/v1/users/me",
    UPDATE: "/api/v1/users/me",
    DELETE_ME: "/api/v1/users/me",
    UPLOAD_PHOTO: "/api/v1/users/me/photo",
    REMOVE_PHOTO: "/api/v1/users/me/photo",
    UPDATE_PREFS: "/api/v1/users/me/preferences",
    GET_PREFS: "/api/v1/users/me/preferences",
  },

  INCOME: {
    // Kept your original endpoints so nothing else changes
    ADD_INCOME: "/api/v1/income/add",
    GET_ALL_INCOME: "/api/v1/income/get",
    UPDATE_INCOME: (id) => `/api/v1/income/${id}`,
    DELETE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
    DOWNLOAD_EXCEL: "/api/v1/income/downloadexcel",
  },

  EXPENSE: {
    ADD_EXPENSE: "/api/v1/expense/add",
    GET_ALL_EXPENSE: "/api/v1/expense/get",
    UPDATE_EXPENSE: (id) => `/api/v1/expense/${id}`,
    DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
    DOWNLOAD_EXCEL: "/api/v1/expense/downloadexcel",
  },

  CATEGORIES: {
    LIST: (type) => `/api/v1/categories?type=${encodeURIComponent(type)}`,
    CREATE: "/api/v1/categories", // POST { type, name }
  },

  // 🔧 FIXED: this used to point to /auth/upload-image (wrong).
  // We keep the IMAGE key for backward compatibility but route it correctly.
  IMAGE: {
    UPLOAD_IMAGE: "/api/v1/users/me/photo",
  },

  CHAT: {
    SEND: "/api/v1/chat/send",
  },

  RECURRING: {
    BASE: "/api/v1/recurring",
  },

  TRANSACTIONS: {
    BASE: "/api/v1/transactions",
    ANALYTICS_SUM: "/api/v1/transactions/analytics/sum",
  },

  ANALYTICS: {
    CATEGORY_SUMMARY: "/api/v1/analytics/category-summary",
  },
  JARS: {
    BASE: '/api/v1/jars',
    FUND: (id) => `/api/v1/jars/${id}/fund`,
    WITHDRAW: (id) => `/api/v1/jars/${id}/withdraw`,
    TRANSFER: '/api/v1/jars/transfer',
    HISTORY: '/api/v1/jars/transfers/history',
  },

  GOALS: {
    BASE: '/api/v1/goals',
    FUND: (id) => `/api/v1/goals/${id}/fund`,
    AUTO_ALLOCATE: '/api/v1/goals/auto-allocate',
  },

};

export default API_PATHS;

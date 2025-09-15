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
    // FIXED: These should point to /users routes, not /auth routes
    ME: "/api/v1/users/me", // Get logged-in user profile
    UPDATE: "/api/v1/users/me",
    DELETE_ME: "/api/v1/users/me",
    UPLOAD_PHOTO: "/api/v1/users/me/photo",
    REMOVE_PHOTO: "/api/v1/users/me/photo",
    UPDATE_PREFS: "/api/v1/users/me/preferences", // FIXED: was /auth/me/preferences
    GET_PREFS: "/api/v1/users/me/preferences",    // Added for completeness
  },
  INCOME: {
    ADD_INCOME: "/api/v1/income/add",
    GET_ALL_INCOME: "/api/v1/income/get",
    DELETE_INCOME: (incomeId) => `/api/v1/income/${incomeId}`,
    DOWNLOAD_EXCEL: "/api/v1/income/downloadexcel",
  },
  EXPENSE: {
    ADD_EXPENSE: "/api/v1/expense/add",
    GET_ALL_EXPENSE: "/api/v1/expense/get",
    DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
    DOWNLOAD_EXCEL: "/api/v1/expense/downloadexcel",
  },
  CATEGORIES: {
    LIST: (type) => `/api/v1/categories?type=${type}`, // GET
    CREATE: "/api/v1/categories", // POST {type,name}
  },
  IMAGE: {
    UPLOAD_IMAGE: "/api/v1/auth/upload-image",
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
};

export default API_PATHS;

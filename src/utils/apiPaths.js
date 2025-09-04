// export const BASE_URL = "http://localhost:8000";
export const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/v1/auth/login",
        REGISTER: "/api/v1/auth/register",
        GOOGLE: '/api/v1/auth/google',
        CHANGE_PASSWORD: '/api/v1/auth/change-password',
        GET_USER_INFO: "/api/v1/auth/me",
    },
    DASHBOARD: {
        GET_DATA: "/api/v1/dashboard",
    },
    USER: {
        ME: '/api/v1/auth/me',                   // Get logged-in user profile
        UPDATE: '/api/v1/auth/me',               // PUT update user profile
        DELETE_ME: '/api/v1/auth/me',            // DELETE account
        UPLOAD_PHOTO: '/api/v1/auth/me/photo',   // POST upload profile photo
        REMOVE_PHOTO: '/api/v1/auth/me/photo',   // DELETE remove profile photo
        UPDATE_PREFS: '/api/v1/auth/me/preferences',
    },
    INCOME: {
        ADD_INCOME: "/api/v1/income/add",
        GET_ALL_INCOME: "/api/v1/income/get",
        DELETE_INCOME: (incomeId)=> `/api/v1/income/${incomeId}`,
        DOWNLOAD_INCOME: `/api/v1/income/downloadexcel`,
    },
    EXPENSE: {
        ADD_EXPENSE: "/api/v1/expense/add",
        GET_ALL_EXPENSE: "/api/v1/expense/get",
        DELETE_EXPENSE: (expenseId) => `/api/v1/expense/${expenseId}`,
        DOWNLOAD_EXPENSE: `/api/v1/expense/downloadexpense`,
    },
    IMAGE: {
        UPLOAD_IMAGE: "/api/v1/auth/upload-image",
    },
    CHAT: {
        SEND: '/api/v1/chat/send',
    },
    RECURRING: {
    BASE: '/api/v1/recurring',
    },
    TRANSACTIONS: {
    BASE: '/api/v1/transactions',
    ANALYTICS_SUM: '/api/v1/transactions/analytics/sum',
    },
};

export default API_PATHS;

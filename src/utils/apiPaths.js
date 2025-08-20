export const BASE_URL = "http://localhost:8000";

export const API_PATHS = {
    AUTH: {
        LOGIN: "/api/v1/auth/login",
        REGISTER: "/api/v1/auth/register",
        GOOGLE: '/api/v1/auth/google',
        CHANGE_PASSWORD: '/api/v1/auth/change-password',
        GET_USER_INFO: "/api/v1/auth/getUser",
    },
    DASHBOARD: {
        GET_DATA: "/api/v1/dashboard",
    },
    USER: {
    ME: '/auth/me',
    UPDATE_PREFS: '/users/me/preferences',    
    DELETE_ME: '/users/me',                   
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
};
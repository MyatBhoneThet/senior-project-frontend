import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create ({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");
        if(accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);


axiosInstance.interceptors.response.use (
    (response) => {
        return response;
    },
    (error) => {
        if(error.response) {
            if(error.response.status == 401) {
                window.location.href = "/login";
            }else if (error.response.status == 500){
                console.error("Server error, Please try again later.");
            }
        }else if (error.code == "ECONNABORTED") {
            console.error("Request timeout. Please try again.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;


// import axios from "axios";

// // Set your backend base URL
// export const BASE_URL = "http://localhost:8000/api/v1";

// const axiosInstance = axios.create({
//     baseURL: BASE_URL,
//     timeout: 10000, // 10 seconds
//     headers: {
//         "Content-Type": "application/json",
//         Accept: "application/json",
//     },
// });

// // Request interceptor: attach token if exists
// axiosInstance.interceptors.request.use(
//     (config) => {
//         const accessToken = localStorage.getItem("token");
//         if (accessToken) {
//             config.headers.Authorization = `Bearer ${accessToken}`;
//         }
//         return config;
//     },
//     (error) => Promise.reject(error)
// );

// // Response interceptor: handle errors globally
// axiosInstance.interceptors.response.use(
//     (response) => response,
//     (error) => {
//         if (error.response) {
//             // Unauthorized
//             if (error.response.status === 401) {
//                 localStorage.removeItem("token"); // optional
//                 window.location.href = "/login";
//             }
//             // Internal server error
//             else if (error.response.status === 500) {
//                 console.error("Server error. Please try again later.");
//             }
//         }
//         // Timeout or network error
//         else if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
//             console.error("Request timeout. Please try again.");
//         } else {
//             console.error("Network error or CORS issue:", error.message);
//         }

//         return Promise.reject(error);
//     }
// );

// export default axiosInstance;

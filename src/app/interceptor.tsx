import axios from "axios";
import {BASE_URL} from "@/shared/constants/url.ts";

export const axiosInstance = axios.create({
    baseURL: BASE_URL,
});

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response.status === 500) {
            console.error("Ошибка сервера:", error);
        }
        if (error.response.status === 401) {
            localStorage.clear();
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);
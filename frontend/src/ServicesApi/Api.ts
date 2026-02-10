import axios, { type AxiosInstance, type AxiosError, type AxiosResponse } from "axios";


// Types & Interfaces


export interface ApiResponse<T = any> {
    ok: boolean;
    data?: T;
    error?: string | null;
}


export interface UserCreate {
    username: string;
    email: string;
    password: string;
}

export interface UserResponse {
    id: number;
    username: string;
    email: string;
    created_at: string;
}

export interface UserLogin {
    username: string;
    password: string;
}

export interface Token {
    access_token: string;
    token_type: string;
}

export interface Conversation {
    id_conv: number;
    title: string;
    date_creation: string;
    id_user: number;
}

export interface ChatResponse {
    response: string; 
}


// Configuration Axios

const API_BASE_URL = "https://le-chat-freeze.onrender.com";

export const Api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

// Intercepteur de requête pour ajouter le token
Api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const getErrorMessage = (error: unknown): string => {
    const axiosError = error as AxiosError;
    const backendError = (axiosError.response?.data as any)?.detail || (axiosError.response?.data as any)?.error;

 
    if (Array.isArray(backendError)) {
        return backendError.map((err: any) => err.msg).join(", ");
    }

    return backendError || axiosError.message || "Erreur de communication avec l'API";
};


// Refresh Token & Intercepteurs

Api.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token");
            if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
                window.location.replace("/login");
            }
        }
        return Promise.reject(error);
    }
);

import axios, { AxiosInstance, AxiosError } from "axios";

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface ApiResponse<T = any> {
    ok: boolean;
    data?: T;
    error?: string | null;
}

// Interfaces générées à partir de la spécification OpenAPI

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
    response: string; // Basé sur "Example Value: string" pour /chat/ask
}

// ============================================================================
// Configuration Axios
// ============================================================================

const API_BASE_URL = "https://le-chat-freeze.onrender.com/";

export const Api: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const getErrorMessage = (error: unknown): string => {
    const axiosError = error as AxiosError;
    const backendError = (axiosError.response?.data as any)?.detail || (axiosError.response?.data as any)?.error;

    // Si backendError est un tableau (cas typique de FastAPI ValidationError), on le convertit en string
    if (Array.isArray(backendError)) {
        return backendError.map((err: any) => err.msg).join(", ");
    }

    return backendError || axiosError.message || "Erreur de communication avec l'API";
};

// ============================================================================
// Refresh Token & Intercepteurs
// ============================================================================

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

Api.interceptors.request.use(
    (config) => {
        return config;
    },
    (error) => Promise.reject(error)
);

// Intercepteur de réponse pour gérer l'expiration (401)
Api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest: any = error.config;

        // On ne tente le refresh QUE si c'est une 401 et que ce n'est pas déjà une requête de refresh
        if (error.response?.status === 401 && originalRequest.url !== "/auth/refresh" && !originalRequest._retry) {

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(() => Api(originalRequest));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Appel au refresh (le cookie est envoyé automatiquement)
                await Api.post("/auth/refresh");

                isRefreshing = false;
                processQueue(null); // On débloque la file

                return Api(originalRequest);
            } catch (err) {
                // En cas d'échec du refresh, on redirige vers le login
                window.location.replace("/login");
                return Promise.reject(err);
            }
        }
        return Promise.reject(error);
    }
);

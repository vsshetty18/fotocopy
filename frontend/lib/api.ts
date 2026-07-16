// ====================================================
// API Client
// Centralized Axios instance — attaches the JWT to every
// request automatically, and handles 401s globally by
// logging out + redirecting to /login.
// ====================================================

import axios, { AxiosError, AxiosInstance } from "axios";
import { getToken, clearAuth } from "./auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  // Loud warning during build/dev if the env var is missing —
  // every API call would otherwise silently fail with a
  // confusing "Network Error".
  console.warn(
    "⚠️ NEXT_PUBLIC_API_URL is not set. Set it in your Vercel project settings."
  );
}

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ----------------------------------------------------
// Request Interceptor
// Attaches "Authorization: Bearer <token>" to every
// outgoing request, if a token exists.
// ----------------------------------------------------
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ----------------------------------------------------
// Response Interceptor
// If any request comes back 401 (expired/invalid token),
// clear stored auth and redirect to /login — centralizes
// this logic so individual pages never need to handle it.
// ----------------------------------------------------
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearAuth();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

/**
 * Helper for extracting a clean error message from a
 * failed API call — backend errors follow the
 * { success: false, message } shape from sendError().
 */
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      (error.response?.data as { message?: string })?.message ||
      "Something went wrong. Please try again."
    );
  }
  return "Something went wrong. Please try again.";
}

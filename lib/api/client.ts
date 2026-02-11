"use client";

import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Client-side axios instance with automatic Bearer token attachment
 * Only use in Client Components
 */
export const clientApi = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// Request interceptor to attach Bearer token
clientApi.interceptors.request.use(
    async (config) => {
        const session = await getSession();

        if (session?.accessToken) {
            config.headers.Authorization = `Bearer ${session.accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for 401 handling
clientApi.interceptors.response.use(
    (response) => response,
    async (error) => {
        if (error.response?.status === 401) {
            // Sign out and redirect to login on 401
            await signOut({ callbackUrl: "/login" });
        }
        return Promise.reject(error);
    }
);

/**
 * Unauthenticated axios instance for public endpoints (register, etc.)
 * Does not attach Bearer token
 */
export const publicApi = axios.create({
    baseURL: API_URL,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

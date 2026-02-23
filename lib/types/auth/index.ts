import "next-auth";
import "next-auth/jwt";

// Laravel API User shape
export interface ApiUser {
    id: number;
    name: string;
    email: string;
    phone: string | null;
    avatar: string | null;
    type: string;
    status: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
}

// NextAuth User (simplified for session)
export interface User {
    id: string;
    name: string;
    email: string;
    image: string | null;
    type: string;
    status: string;
}

// API Response Types
export interface ApiSuccessResponse<T> {
    success: true;
    message?: string;
    data: T;
}

export interface ApiErrorResponse {
    success: false;
    message: string;
    errors?: Record<string, string[]>;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

// Login Response (nested: { success, data: { user, token } })
export interface LoginSuccessData {
    user: ApiUser;
    token: string;
    token_type: string;
}

export type LoginResponse = ApiResponse<LoginSuccessData>;

// Login success response (flat: top-level user, token - e.g. 200/201)
export interface LoginSuccessFlat {
    message?: string;
    user: ApiUser;
    token: string;
    token_type?: string;
    expires_in?: number;
}

// Register Response (nested: { success, data: { user, token } })
export interface RegisterSuccessData {
    user: ApiUser;
    token: string;
    token_type: string;
}

export type RegisterResponse = ApiResponse<RegisterSuccessData>;

// Register success response (flat: top-level user, token - e.g. status 201)
export interface RegisterSuccessFlat {
    message?: string;
    user: ApiUser;
    token: string;
    token_type?: string;
    expires_in?: number;
}

// Auth/Me Response
export interface MeSuccessData {
    user: ApiUser;
}

export type MeResponse = ApiResponse<MeSuccessData>;

// Session User type (without accessToken - that's on session itself)
export interface SessionUser {
    id: string;
    name: string;
    email: string;
    image: string | null;
    type: string;
    status: string;
}

// NextAuth Module Augmentation
declare module "next-auth" {
    interface Session {
        user: SessionUser;
        accessToken: string;
    }

    // User returned from authorize callback (includes accessToken)
    interface User {
        id: string;
        name: string;
        email: string;
        image: string | null;
        type: string;
        status: string;
        accessToken: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        name: string;
        email: string;
        image: string | null;
        type: string;
        status: string;
        accessToken: string;
    }
}
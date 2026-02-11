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

// Login Response
export interface LoginSuccessData {
    user: ApiUser;
    token: string;
    token_type: string;
}

export type LoginResponse = ApiResponse<LoginSuccessData>;

// Register Response
export interface RegisterSuccessData {
    user: ApiUser;
    token: string;
    token_type: string;
}

export type RegisterResponse = ApiResponse<RegisterSuccessData>;

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
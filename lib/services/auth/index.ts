import { clientApi, publicApi } from "@/lib/api";
import type {
    RegisterResponse,
    MeResponse,
    ApiUser,
    ApiErrorResponse,
} from "@/lib/types/auth";
import type { RegisterRequest } from "@/lib/schema/auth";
import { AxiosError } from "axios";

/**
 * Register a new user (unauthenticated)
 * Uses publicApi (no Bearer token)
 */
export const register = async (
    data: RegisterRequest
): Promise<{ success: true; user: ApiUser; token: string } | { success: false; message: string; errors?: string[] }> => {
    try {
        const response = await publicApi.post<RegisterResponse>("/auth/register", data);

        if (response.data.success) {
            return {
                success: true,
                user: response.data.data.user,
                token: response.data.data.token,
            };
        }

        return {
            success: false,
            message: response.data.message,
        };
    } catch (error) {
        if (error instanceof AxiosError && error.response?.data) {
            const errorData = error.response.data as ApiErrorResponse;
            // Flatten errors to a simple string array
            const flatErrors = errorData.errors
                ? Object.values(errorData.errors).flat()
                : undefined;

            return {
                success: false,
                message: errorData.message || "Kayıt sırasında bir hata oluştu",
                errors: flatErrors,
            };
        }

        return {
            success: false,
            message: "Kayıt sırasında bir hata oluştu",
        };
    }
};

/**
 * Get current authenticated user (client-side)
 * Uses clientApi (with Bearer token)
 */
export const getMe = async (): Promise<ApiUser | null> => {
    try {
        const response = await clientApi.get<MeResponse>("/auth/me");

        if (response.data.success) {
            return response.data.data.user;
        }

        return null;
    } catch {
        return null;
    }
};
import { clientApi, publicApi } from "@/lib/api";
import type {
    RegisterResponse,
    RegisterSuccessFlat,
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
        const response = await publicApi.post<
            RegisterResponse | RegisterSuccessFlat
        >("/auth/register", data);
        const isSuccessStatus = response.status === 200 || response.status === 201;
        const data_ = response.data;

        // Flat shape: { message, user, token } (e.g. 201 Created)
        const flat = data_ as RegisterSuccessFlat;
        if (
            isSuccessStatus &&
            flat?.user != null &&
            typeof flat?.token === "string"
        ) {
            return {
                success: true,
                user: flat.user as ApiUser,
                token: flat.token,
            };
        }

        // Nested shape: { success, data: { user, token } }
        if (data_ && "data" in data_ && data_.data?.user != null && data_.data?.token != null) {
            const nested = data_ as { data: { user: ApiUser; token: string } };
            if (isSuccessStatus) {
                return {
                    success: true,
                    user: nested.data.user,
                    token: nested.data.token,
                };
            }
        }

        const errorMessage =
            typeof data_ === "object" && data_ != null && "message" in data_
                ? (data_ as { message?: string }).message
                : undefined;
        return {
            success: false,
            message: errorMessage ?? "Kayıt sırasında bir hata oluştu",
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
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class UnauthorizedError extends Error {
    constructor(message = "Unauthorized") {
        super(message);
        this.name = "UnauthorizedError";
    }
}

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = "ApiError";
        this.status = status;
    }
}

interface ServerApiOptions extends Omit<RequestInit, "headers"> {
    headers?: Record<string, string>;
}

/**
 * Server-side API helper that automatically attaches the Bearer token
 * Only use in Server Components, Route Handlers, or server actions
 */
export const serverApi = async <T = unknown>(
    path: string,
    init?: ServerApiOptions
): Promise<T> => {
    const session = await getServerSession(authOptions);

    if (!session?.accessToken) {
        throw new UnauthorizedError("No valid session found");
    }

    // Build full URL ensuring no double slashes
    const baseUrl = API_URL?.endsWith("/") ? API_URL.slice(0, -1) : API_URL;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    const url = `${baseUrl}${cleanPath}`;

    const response = await fetch(url, {
        ...init,
        cache: "no-store",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${session.accessToken}`,
            ...init?.headers,
        },
    });

    if (response.status === 401 || response.status === 403) {
        throw new UnauthorizedError("Session expired or invalid");
    }

    if (!response.ok) {
        throw new ApiError(
            `API request failed: ${response.statusText}`,
            response.status
        );
    }

    return response.json();
};

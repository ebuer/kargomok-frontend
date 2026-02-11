import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import type { LoginResponse, ApiUser } from "@/lib/types/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    return null;
                }

                try {
                    const response = await fetch(`${API_URL}/auth/login`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                        },
                        body: JSON.stringify({
                            email: credentials.email,
                            password: credentials.password,
                        }),
                    });

                    const data: LoginResponse = await response.json();

                    if (!data.success) {
                        throw new Error(data.message || "Giriş başarısız");
                    }

                    const apiUser: ApiUser = data.data.user;
                    const token = data.data.token;

                    // Return user object that will be passed to JWT callback
                    return {
                        id: String(apiUser.id),
                        name: apiUser.name,
                        email: apiUser.email,
                        image: apiUser.avatar,
                        type: apiUser.type,
                        status: apiUser.status,
                        accessToken: token,
                    };
                } catch (error) {
                    if (error instanceof Error) {
                        throw new Error(error.message);
                    }
                    throw new Error("Giriş sırasında bir hata oluştu");
                }
            },
        }),
    ],
    session: {
        strategy: "jwt",
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    callbacks: {
        async jwt({ token, user }) {
            // On sign-in, persist user data and access token
            if (user) {
                token.id = user.id;
                token.name = user.name;
                token.email = user.email;
                token.image = user.image;
                token.type = user.type;
                token.status = user.status;
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            // Expose token data to session
            session.user = {
                id: token.id,
                name: token.name ?? "",
                email: token.email ?? "",
                image: token.image ?? null,
                type: token.type,
                status: token.status,
            };
            session.accessToken = token.accessToken;
            return session;
        },
    },
    pages: {
        signIn: "/giris",
        error: "/giris",
    },
    debug: process.env.NODE_ENV === "development",
};

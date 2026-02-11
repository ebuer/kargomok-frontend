"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { loginRequestSchema, type LoginRequest } from "@/lib/schema/auth";
import { ZodError } from "zod";

const LoginForm = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    const [formData, setFormData] = useState<LoginRequest>({
        email: "",
        password: "",
    });
    const [errors, setErrors] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors([]);
        setIsLoading(true);

        // Validate with Zod
        try {
            loginRequestSchema.parse(formData);
        } catch (error) {
            if (error instanceof ZodError) {
                setErrors(error.issues.map((issue) => issue.message));
                setIsLoading(false);
                return;
            }
        }

        // Sign in with NextAuth
        const result = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false,
        });

        setIsLoading(false);

        if (result?.error) {
            setErrors([result.error]);
            return;
        }

        if (result?.ok) {
            router.push(callbackUrl);
            router.refresh();
        }
    };

    return (
        <div className="w-full max-w-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Giriş Yap</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                {errors.length > 0 && (
                    <div className="p-3 border border-red-300 bg-red-50 rounded text-red-700 text-sm">
                        <ul className="list-disc list-inside">
                            {errors.map((error, index) => (
                                <li key={index}>{error}</li>
                            ))}
                        </ul>
                    </div>
                )}

                <div>
                    <label
                        htmlFor="email"
                        className="block text-sm font-medium mb-1"
                    >
                        Email
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="ornek@email.com"
                        required
                        disabled={isLoading}
                        aria-label="Email adresi"
                        tabIndex={0}
                    />
                </div>

                <div>
                    <label
                        htmlFor="password"
                        className="block text-sm font-medium mb-1"
                    >
                        Şifre
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                        required
                        disabled={isLoading}
                        aria-label="Şifre"
                        tabIndex={0}
                    />
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    tabIndex={0}
                    aria-label="Giriş yap butonu"
                >
                    {isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                </button>
            </form>

            <p className="mt-4 text-center text-sm text-gray-600">
                Hesabınız yok mu?{" "}
                <Link
                    href="/kayit"
                    className="text-blue-600 hover:underline"
                    tabIndex={0}
                    aria-label="Kayıt ol sayfasına git"
                >
                    Kayıt Ol
                </Link>
            </p>
        </div>
    );
};

export default function GirisPage() {
    return (
        <main className="min-h-screen flex items-center justify-center p-4">
            <Suspense fallback={<div className="text-center">Yükleniyor...</div>}>
                <LoginForm />
            </Suspense>
        </main>
    );
}
